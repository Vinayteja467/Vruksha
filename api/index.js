// Vercel Serverless Function entry point bridging Express API routes
import app from '../server/src/server.js';
import { connectDB } from '../server/src/config/db.js';

let isDbInitialized = false;

export default async function handler(req, res) {
  if (!isDbInitialized) {
    try {
      await connectDB();
      isDbInitialized = true;
    } catch (err) {
      console.warn('⚠️ Serverless DB init fallback:', err.message);
    }
  }
  return app(req, res);
}
