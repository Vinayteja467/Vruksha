import mongoose from 'mongoose';
import { env } from './env.js';

export let isConnectedToMongo = false;

export const connectDB = async () => {
  const mongoURI = env.MONGO_URI;
  const isInvalidPlaceholder = !mongoURI || mongoURI.includes('example.mongodb.net') || mongoURI.trim() === '';

  if (isInvalidPlaceholder) {
    if (env.isProduction) {
      throw new Error('FATAL: A valid, production-ready MONGO_URI must be provided. In-memory fallback is disabled in production.');
    }
    console.log('🌱 [Database - Development Mode] No active MONGO_URI supplied. Booting into Zero-Config In-Memory Engine with seeded natural products.');
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
    if (env.isProduction) {
      throw new Error(`FATAL: MongoDB production connection failure: ${error.message}`);
    }
    console.warn(`⚠️ [MongoDB - Dev Fallback] Connection error (${error.message}). Falling back to In-Memory Engine for local development.`);
    isConnectedToMongo = false;
    return false;
  }
};
