import mongoose from 'mongoose';
import { env } from './env.js';

export let isConnectedToMongo = false;

export const connectDB = async () => {
  const mongoURI = env.MONGO_URI;
  const isInvalidPlaceholder = !mongoURI || mongoURI.includes('example.mongodb.net') || mongoURI.trim() === '';

  if (isInvalidPlaceholder) {
    console.log('🌱 [Database Engine] No active MONGO_URI supplied. Running with built-in in-memory engine.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnectedToMongo = true;
    console.log(`✅ [MongoDB Atlas] Connected: ${conn.connection.host}`);
    await seedAdminAccounts();
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB Fallback] Connection error (${error.message}). Falling back to In-Memory Engine.`);
    isConnectedToMongo = false;
    return false;
  }
};

const seedAdminAccounts = async () => {
  try {
    const { User } = await import('../models/User.js');
    const adminEmail = 'yathkirishivashankar123@gmail.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: 'Shivashankar Admin',
        email: adminEmail,
        password: '@Shivashankar123',
        role: 'admin'
      });
      console.log(`👑 [Admin Seed] Created admin account in MongoDB: ${adminEmail}`);
    } else if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`👑 [Admin Seed] Verified admin role for: ${adminEmail}`);
    }
  } catch (err) {
    console.warn('⚠️ [Admin Seed] Notice:', err.message);
  }
};
