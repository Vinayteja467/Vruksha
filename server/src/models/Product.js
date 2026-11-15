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
  stock: { type: Number, default: 100 },
  sku: { type: String, default: '' },
  ingredients: { type: String, default: '100% Pure & Natural Ingredients' },
  nutrition: { type: Map, of: String },
  usage: { type: String, default: 'Mix 1 teaspoon with water, warm milk, or smoothies daily.' },
  storage: { type: String, default: 'Store in an airtight container in a cool, dry place.' },
  benefits: [{ type: String }],
  faq: [faqSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!this.categorySlug && this.category) {
    this.categorySlug = this.category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.slice(0, 150);
  }
  if (!this.sku) {
    this.sku = `VRK-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  if (!this.ingredients) {
    this.ingredients = `100% Pure & Natural ${this.name || 'Ingredients'}`;
  }
  if (!this.usage) {
    this.usage = 'Mix 1 teaspoon (approx 5g) with water, smoothies, or meals daily.';
  }
  if (!this.storage) {
    this.storage = 'Store in an airtight container in a cool, dry place.';
  }
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
