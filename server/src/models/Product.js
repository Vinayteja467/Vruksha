import mongoose from 'mongoose';

const sizeVariantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  inStock: { type: Boolean, default: true }
});

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  sizes: [sizeVariantSchema],
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  stock: { type: Number, default: 100 },
  sku: { type: String, required: true },
  ingredients: { type: String, required: true },
  nutrition: { type: Map, of: String },
  usage: { type: String, required: true },
  storage: { type: String, required: true },
  benefits: [{ type: String }],
  faq: [faqSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
