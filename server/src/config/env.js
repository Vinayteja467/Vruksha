
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn(
    '⚠️ JWT_SECRET is not set in environment variables. Using secure fallback secret.'
  );
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction,

  PORT: process.env.PORT || 5000,

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  MONGO_URI: process.env.MONGO_URI || '',

  JWT_SECRET:
    JWT_SECRET ||
    'vruksha_secure_production_jwt_fallback_key_2026',

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',

  WHATSAPP_PHONE_NUMBER:
    process.env.WHATSAPP_PHONE_NUMBER || '919573636998'
};
