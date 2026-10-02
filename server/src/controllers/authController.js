import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { User } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'pureharvest_super_secure_jwt_secret_key_2026_d2c', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    if (isConnectedToMongo) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      const user = await User.create({ name, email, phone, password });
      return res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      const existing = await inMemoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (isConnectedToMongo) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            addresses: user.addresses,
            wishlist: user.wishlist
          },
          token: generateToken(user._id)
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    } else {
      const user = await inMemoryStore.findUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...safeUser } = user;
        return res.json({
          success: true,
          user: safeUser,
          token: generateToken(user.id)
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user
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
