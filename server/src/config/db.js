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
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB Fallback] Connection error (${error.message}). Falling back to In-Memory Engine.`);
    isConnectedToMongo = false;
    return false;
  }
};
