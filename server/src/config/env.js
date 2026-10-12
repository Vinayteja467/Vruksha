import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (isProduction) {
    throw new Error('FATAL: JWT_SECRET must be explicitly set in production environment variables.');
  }
  console.warn('⚠️ [Config] JWT_SECRET is not set. Using dev secret. Set JWT_SECRET in server/.env for production.');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction,
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: JWT_SECRET || 'dev_pureharvest_jwt_secret_key_only_for_local_testing_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  WHATSAPP_PHONE_NUMBER: process.env.WHATSAPP_PHONE_NUMBER || '919573636998'
};
