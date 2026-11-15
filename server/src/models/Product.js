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
  shortDescription: { type: String, default: '' },
  description: { type: String, default: '' },
  images: [{ type: String }],
  sizes: [sizeVariantSchema],
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  stock: { type: Number, required: true, default: 100 },
  sku: { type: String, default: '' },
  ingredients: { type: String, default: '' },
  nutrition: { type: Map, of: String },
  usage: { type: String, default: '' },
  storage: { type: String, default: 'Store in a cool, dry place away from direct sunlight.' },
  benefits: [{ type: String }],
  faq: [faqSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (!this.categorySlug && this.category) {
    this.categorySlug = this.category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (!this.sku && this.name) {
    const clean = (this.slug || this.name).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    this.sku = `VRK-${clean || 'PROD'}-${Math.floor(100 + Math.random() * 900)}`;
  }
  if (!this.originalPrice && this.price) {
    this.originalPrice = Math.round(Number(this.price) * 1.25);
  }
  next();
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
