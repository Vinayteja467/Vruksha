import { inMemoryStore } from '../config/inMemoryStore.js';
import { Review } from '../models/Review.js';
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
    const { productId, productName, name, rating, title, comment } = req.body;
    if (!productName || !name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide all review fields' });
    }

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    if (isConnectedToMongo) {
      const review = await Review.create({
        product: productId || 'prod-001',
        productName,
        user: req.user ? (req.user._id || req.user.id) : undefined,
        name,
        avatar: initials,
        rating: Number(rating),
        title: title || 'Verified Purchase',
        comment,
        verifiedPurchase: true
      });
      return res.status(201).json({ success: true, review });
    } else {
      const review = inMemoryStore.addReview({
        productId: productId || 'prod-001',
        productName,
        name,
        avatar: initials,
        rating: Number(rating),
        title: title || 'Verified Purchase',
        comment,
        verifiedPurchase: true
      });
      return res.status(201).json({ success: true, review });
    }
  } catch (err) {
    next(err);
  }
};
