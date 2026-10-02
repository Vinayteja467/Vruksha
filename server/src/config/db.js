import mongoose from 'mongoose';

export let isConnectedToMongo = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI || mongoURI.includes('example.mongodb.net') || mongoURI.trim() === '') {
    console.log('🌱 [Database] No active MONGO_URI supplied. Booting into Zero-Config In-Memory Engine with 12 seeded natural products.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnectedToMongo = true;
    console.log(`✅ [MongoDB Atlas] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [MongoDB] Connection error (${error.message}). Falling back smoothly to In-Memory Engine.`);
    isConnectedToMongo = false;
    return false;
  }
};
