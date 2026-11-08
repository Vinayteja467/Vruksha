import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { User } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';
import { env } from '../config/env.js';

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export const register = async (req, res, next) => {
  try {
    let { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    phone = phone ? String(phone).trim() : '';
    password = String(password);

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (isConnectedToMongo) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in instead.' });
      }
      const user = await User.create({ name, email, phone, password });
      return res.status(201).json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          addresses: user.addresses || [],
          wishlist: user.wishlist || []
        },
        token: generateToken(user._id.toString())
      });
    } else {
      const existing = await inMemoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in instead.' });
      }
      const user = await inMemoryStore.createUser({ name, email, phone, password });
      return res.status(201).json({
        success: true,
        user,
        token: generateToken(user.id)
      });
    }
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    email = String(email).trim().toLowerCase();
    password = String(password);

    if (isConnectedToMongo) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'No account found with this email. Please check your email or register.' });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
      }
      return res.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          addresses: user.addresses || [],
          wishlist: user.wishlist || []
        },
        token: generateToken(user._id.toString())
      });
    } else {
      const user = await inMemoryStore.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'No account found with this email. Please check your email or register.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
      }
      const { password: _, ...safeUser } = user;
      return res.json({
        success: true,
        user: {
          ...safeUser,
          addresses: safeUser.addresses || [],
          wishlist: safeUser.wishlist || []
        },
        token: generateToken(user.id)
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res) => {
  const userObj = req.user && req.user.toObject ? req.user.toObject() : (req.user || {});
  const safeId = userObj._id || userObj.id;
  res.json({
    success: true,
    user: {
      ...userObj,
      id: safeId,
      addresses: userObj.addresses || [],
      wishlist: userObj.wishlist || []
    }
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    if (isConnectedToMongo) {
      const user = await User.findById(req.user._id || req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (addresses) user.addresses = addresses;

      const updated = await user.save();
      res.json({
        success: true,
        user: {
          id: updated._id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          role: updated.role,
          addresses: updated.addresses,
          wishlist: updated.wishlist
        }
      });
    } else {
      const updated = await inMemoryStore.updateUser(req.user.id, {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(addresses && { addresses })
      });
      res.json({ success: true, user: updated });
    }
  } catch (err) {
    next(err);
  }
};
