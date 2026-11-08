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
    const priceNum = Number(productData.price);
    const originalPriceNum = Number(productData.originalPrice) || Math.round(priceNum * 1.25);
    productData.price = priceNum;
    productData.originalPrice = originalPriceNum;

    if (productData.sizes && productData.sizes.length > 0) {
      productData.sizes = productData.sizes.map((s, idx) => ({
        ...s,
        price: idx === 0 ? priceNum : Number(s.price),
        originalPrice: idx === 0 ? originalPriceNum : Number(s.originalPrice || s.price * 1.25)
      }));
    } else {
      productData.sizes = [{ size: '100g', price: priceNum, originalPrice: originalPriceNum, inStock: true }];
    }

    let newProduct;
    if (isConnectedToMongo) {
      newProduct = await Product.create(productData);
    } else {
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

    if (updates.price !== undefined) {
      const priceNum = Number(updates.price);
      const originalPriceNum = Number(updates.originalPrice) || Math.round(priceNum * 1.25);
      updates.price = priceNum;
      updates.originalPrice = originalPriceNum;

      if (updates.sizes && updates.sizes.length > 0) {
        updates.sizes = updates.sizes.map((s, idx) => ({
          ...s,
          price: idx === 0 ? priceNum : Number(s.price),
          originalPrice: idx === 0 ? originalPriceNum : Number(s.originalPrice || s.price * 1.25)
        }));
      }
    }

    let updated;
    if (isConnectedToMongo) {
      updated = await Product.findByIdAndUpdate(id, updates, { new: true });
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
      deleted = await Product.findByIdAndDelete(id);
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
