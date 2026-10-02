import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: String, required: true },
  productName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
