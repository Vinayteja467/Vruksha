import { inMemoryStore } from '../config/inMemoryStore.js';
import { Product } from '../models/Product.js';
import { isConnectedToMongo } from '../config/db.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort, inStock, limit, page } = req.query;

    if (isConnectedToMongo) {
      let query = {};
      if (category && category !== 'all') {
        query.$or = [{ categorySlug: category }, { category: new RegExp(category, 'i') }];
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, 'i') },
          { shortDescription: new RegExp(search, 'i') },
          { ingredients: new RegExp(search, 'i') }
        ];
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (rating) {
        query.rating = { $gte: Number(rating) };
      }
      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      }

      let sortOptions = {};
      if (sort === 'price-asc') sortOptions.price = 1;
      else if (sort === 'price-desc') sortOptions.price = -1;
      else if (sort === 'rating') sortOptions.rating = -1;
      else if (sort === 'newest') sortOptions.createdAt = -1;
      else sortOptions.bestSeller = -1;

      const total = await Product.countDocuments(query);
      const limitNum = limit ? Number(limit) : 50;
      const pageNum = page ? Number(page) : 1;
      const products = await Product.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      res.json({
        success: true,
        products,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      });
    } else {
      const result = inMemoryStore.getProducts({ category, search, minPrice, maxPrice, rating, sort, inStock, limit, page });
      res.json({
        success: true,
        ...result
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product;

    if (isConnectedToMongo) {
      product = await Product.findOne({ slug });
    } else {
      product = inMemoryStore.getProductBySlug(slug) || inMemoryStore.getProductById(slug);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };

    // Mandatory fields validation: name, price, category, stock, image
    if (!productData.name || !String(productData.name).trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (productData.price === undefined || productData.price === null || isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid selling price is required' });
    }
    if (!productData.category || !String(productData.category).trim()) {
      return res.status(400).json({ success: false, message: 'Product category is required' });
    }
    if (productData.stock === undefined || productData.stock === null || isNaN(Number(productData.stock)) || Number(productData.stock) < 0) {
      return res.status(400).json({ success: false, message: 'Valid stock quantity is required' });
    }

    // Image validation (mandatory)
    let images = [];
    if (Array.isArray(productData.images) && productData.images.length > 0) {
      images = productData.images.filter(img => Boolean(img && String(img).trim()));
    } else if (productData.image && String(productData.image).trim()) {
      images = [String(productData.image).trim()];
    }
    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'Product image is required' });
    }
    productData.images = images;

    const priceNum = Number(productData.price);
    const originalPriceNum = Number(productData.originalPrice) || Math.round(priceNum * 1.25);
    productData.name = String(productData.name).trim();
    productData.price = priceNum;
    productData.originalPrice = originalPriceNum;
    productData.stock = Number(productData.stock);

    // Auto-generate slug from product name
    const baseSlug = (productData.slug || productData.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `product-${Date.now()}`;

    // Auto-generate categorySlug
    productData.categorySlug = (productData.categorySlug || productData.category)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'general';

    // Auto-generate SKU if omitted
    if (!productData.sku || !String(productData.sku).trim()) {
      const cleanSlug = baseSlug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      productData.sku = `VRK-${cleanSlug || 'PROD'}-${Math.floor(100 + Math.random() * 900)}`;
    }

    // Optional fields defaulted gracefully
    productData.shortDescription = productData.shortDescription || '';
    productData.description = productData.description || '';
    productData.ingredients = productData.ingredients || '';
    productData.usage = productData.usage || '';
    productData.storage = productData.storage || 'Store in a cool, dry place away from direct sunlight.';

    // Size variants handling
    if (productData.sizes && productData.sizes.length > 0) {
      productData.sizes = productData.sizes.map((s, idx) => ({
        size: s.size || (idx === 0 ? '100g' : `${(idx + 1) * 100}g`),
        price: idx === 0 ? priceNum : Number(s.price || priceNum),
        originalPrice: idx === 0 ? originalPriceNum : Number(s.originalPrice || s.price * 1.25 || originalPriceNum),
        inStock: s.inStock !== false
      }));
    } else {
      productData.sizes = [{ size: '100g', price: priceNum, originalPrice: originalPriceNum, inStock: true }];
    }

    let newProduct;
    if (isConnectedToMongo) {
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }
      productData.slug = uniqueSlug;
      newProduct = await Product.create(productData);
    } else {
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (inMemoryStore.getProductBySlug(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }
      productData.slug = uniqueSlug;
      newProduct = inMemoryStore.createProduct(productData);
    }

    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.name) {
      updates.name = String(updates.name).trim();
      if (!updates.slug) {
        updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
    }

    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
    }

    if (updates.price !== undefined) {
      const priceNum = Number(updates.price);
      const originalPriceNum = Number(updates.originalPrice) || Math.round(priceNum * 1.25);
      updates.price = priceNum;
      updates.originalPrice = originalPriceNum;

      if (updates.sizes && updates.sizes.length > 0) {
        updates.sizes = updates.sizes.map((s, idx) => ({
          size: s.size || (idx === 0 ? '100g' : `${(idx + 1) * 100}g`),
          price: idx === 0 ? priceNum : Number(s.price || priceNum),
          originalPrice: idx === 0 ? originalPriceNum : Number(s.originalPrice || s.price * 1.25 || originalPriceNum),
          inStock: s.inStock !== false
        }));
      }
    }

    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.filter(img => Boolean(img && String(img).trim()));
    }

    let updated;
    if (isConnectedToMongo) {
      const isObjectId = id && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/);
      updated = await Product.findOneAndUpdate(
        {
          $or: [
            ...(isObjectId ? [{ _id: id }] : []),
            { slug: id },
            { sku: id }
          ]
        },
        updates,
        { new: true }
      );
    } else {
      updated = inMemoryStore.updateProduct(id, updates);
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted;

    if (isConnectedToMongo) {
      const isObjectId = id && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/);
      deleted = await Product.findOneAndDelete({
        $or: [
          ...(isObjectId ? [{ _id: id }] : []),
          { slug: id },
          { sku: id }
        ]
      });
    } else {
      deleted = inMemoryStore.deleteProduct(id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
