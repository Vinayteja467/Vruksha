import { inMemoryStore } from '../config/inMemoryStore.js';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { isConnectedToMongo } from '../config/db.js';

export const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.query;
    if (isConnectedToMongo) {
      let query = { isApproved: true };
      if (productId) {
        let matchIds = [productId];
        try {
          const pDoc = await Product.findOne({
            $or: [
              { _id: productId.match(/^[0-9a-fA-F]{24}$/) ? productId : null },
              { slug: productId },
              { id: productId }
            ]
          });
          if (pDoc) {
            if (pDoc._id) matchIds.push(pDoc._id.toString());
            if (pDoc.slug) matchIds.push(pDoc.slug);
            if (pDoc.id) matchIds.push(pDoc.id);
          }
        } catch (e) {}
        query.product = { $in: matchIds };
      }
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

    let idList = [cleanProductId];
    if (isConnectedToMongo) {
      try {
        const productDoc = await Product.findOne({
          $or: [
            { _id: cleanProductId.match(/^[0-9a-fA-F]{24}$/) ? cleanProductId : null },
            { slug: cleanProductId },
            { id: cleanProductId }
          ]
        });
        if (productDoc) {
          if (productDoc._id) idList.push(productDoc._id.toString());
          if (productDoc.slug) idList.push(productDoc.slug);
          if (productDoc.id) idList.push(productDoc.id);
        }
      } catch (e) {}
    } else {
      const productDoc = inMemoryStore.getProductById(cleanProductId) || inMemoryStore.getProductBySlug(cleanProductId);
      if (productDoc) {
        if (productDoc.id) idList.push(productDoc.id);
        if (productDoc.slug) idList.push(productDoc.slug);
      }
    }

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
              { 'items.product': { $in: idList } },
              { 'items.slug': { $in: idList } }
            ]
          }
        ]
      });
      isVerifiedPurchase = !!deliveredOrder;
    } else {
      const userOrders = inMemoryStore.getOrdersByUser(userId);
      isVerifiedPurchase = userOrders.some(
        o => o.orderStatus === 'Delivered' &&
             o.items?.some(i => idList.includes(i.product) || idList.includes(i.slug))
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
