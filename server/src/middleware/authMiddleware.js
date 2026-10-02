import jwt from 'jsonwebtoken';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { User } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pureharvest_super_secure_jwt_secret_key_2026_d2c');

    if (isConnectedToMongo) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = await inMemoryStore.findUserById(decoded.id);
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
};
