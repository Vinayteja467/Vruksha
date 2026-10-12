import { inMemoryStore } from '../config/inMemoryStore.js';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { isConnectedToMongo } from '../config/db.js';

export const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.query;
    if (isConnectedToMongo) {
      let query = { isApproved: true };
      if (productId) query.product = productId;
      const reviews = await Review.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, reviews });
    }
    const reviews = productId ? inMemoryStore.getReviews(productId) : inMemoryStore.getAllReviews();
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { productId, productName, rating, title, comment } = req.body;
    const name = req.body.name || req.user.name;

    if (!productName || !name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all review fields' });
    }

    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    const userEmail = req.user.email ? req.user.email.toLowerCase() : '';
    const cleanProductId = productId || 'prod-001';

    // Verify if customer actually purchased and received this product
    let isVerifiedPurchase = false;

    if (isConnectedToMongo) {
      const deliveredOrder = await Order.findOne({
        $and: [
          {
            $or: [
              { user: userId },
              { 'customerInfo.email': userEmail }
            ]
          },
          { orderStatus: 'Delivered' },
          {
            $or: [
              { 'items.product': cleanProductId },
              { 'items.slug': cleanProductId }
            ]
          }
        ]
      });
      isVerifiedPurchase = !!deliveredOrder;
    } else {
      const userOrders = inMemoryStore.getOrdersByUser(userId);
      isVerifiedPurchase = userOrders.some(
        o => o.orderStatus === 'Delivered' &&
             o.items?.some(i => i.product === cleanProductId || i.slug === cleanProductId)
      );
    }

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    if (isConnectedToMongo) {
      const review = await Review.create({
        product: cleanProductId,
        productName,
        user: req.user._id || req.user.id,
        name,
        avatar: initials,
        rating: Math.min(5, Math.max(1, Number(rating))),
        title: title || (isVerifiedPurchase ? 'Verified Purchase Review' : 'Customer Review'),
        comment: comment.trim(),
        verifiedPurchase: isVerifiedPurchase,
        isApproved: true
      });
      return res.status(201).json({ success: true, review });
    } else {
      const review = inMemoryStore.addReview({
        productId: cleanProductId,
        productName,
        user: userId,
        name,
        avatar: initials,
        rating: Math.min(5, Math.max(1, Number(rating))),
        title: title || (isVerifiedPurchase ? 'Verified Purchase Review' : 'Customer Review'),
        comment: comment.trim(),
        verifiedPurchase: isVerifiedPurchase,
        isApproved: true
      });
      return res.status(201).json({ success: true, review });
    }
  } catch (err) {
    next(err);
  }
};
