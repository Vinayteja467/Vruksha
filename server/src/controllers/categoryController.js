import { inMemoryStore } from '../config/inMemoryStore.js';
import { Category } from '../models/Category.js';
import { isConnectedToMongo } from '../config/db.js';

export const getCategories = async (req, res, next) => {
  try {
    if (isConnectedToMongo) {
      const categories = await Category.find();
      return res.json({ success: true, categories });
    }
    res.json({ success: true, categories: inMemoryStore.categories });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image } = req.body;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (isConnectedToMongo) {
      const cat = await Category.create({ name, slug: catSlug, description, image });
      return res.status(201).json({ success: true, category: cat });
    } else {
      const newCat = { id: `cat-${Date.now()}`, name, slug: catSlug, description, image, itemCount: 0 };
      inMemoryStore.categories.push(newCat);
      return res.status(201).json({ success: true, category: newCat });
    }
  } catch (err) {
    next(err);
  }
};
