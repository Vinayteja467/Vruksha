import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  itemCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
