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
<<<<<<< HEAD
    let { name, email, phone, password } = req.body;
=======
    const { name, email, phone, password } = req.body;
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

<<<<<<< HEAD
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
=======
    if (isConnectedToMongo) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
      }
      const user = await User.create({ name, email, phone, password });
      return res.status(201).json({
        success: true,
        user: {
<<<<<<< HEAD
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          addresses: user.addresses || [],
          wishlist: user.wishlist || []
        },
        token: generateToken(user._id.toString())
=======
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        token: generateToken(user._id)
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
      });
    } else {
      const existing = await inMemoryStore.findUserByEmail(email);
      if (existing) {
<<<<<<< HEAD
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in instead.' });
=======
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
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
<<<<<<< HEAD
    let { email, password } = req.body;
=======
    const { email, password } = req.body;
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
    }
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res) => {
<<<<<<< HEAD
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
=======
  res.json({
    success: true,
    user: req.user
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
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
