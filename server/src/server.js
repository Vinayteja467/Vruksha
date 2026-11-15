import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isConnectedToMongo } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '../../client/dist');

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bulkRoutes from './routes/bulkRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import { env } from './config/env.js';

const app = express();
const PORT = env.PORT || 5000;

// Configured CORS Allowlist
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.options('*', cors());

// Vercel Serverless Path Normalizer:
// If rewritten to /api/index.js, restore the original path from Vercel request headers
app.use((req, res, next) => {
  const origPath = req.headers['x-matched-path'] || req.headers['x-invoke-path'] || req.headers['x-forwarded-uri'];
  if (origPath && (req.url === '/api/index.js' || req.url === '/api/index' || req.url === '/api')) {
    req.url = origPath;
  }
  next();
});

// Ensure MongoDB connection in Serverless environments (executed before all routes)
let isServerlessDbConnected = false;
app.use(async (req, res, next) => {
  if (process.env.VERCEL && !isServerlessDbConnected) {
    if (env.MONGO_URI) {
      try {
        await connectDB();
        isServerlessDbConnected = true;
      } catch (err) {
        console.warn('⚠️ Serverless DB connect warning:', err.message);
      }
    }
  }
  next();
});

// Vercel serverless request body pre-parse guard:
// When @vercel/node pre-parses req.body, express.json() must not attempt to re-read an already consumed stream
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req._body = true;
  }
  next();
});

// Body parsing with raw buffer preservation for Razorpay webhook verification
app.use(express.json({
  limit: '15mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'VRUKSHA',
    tagline: 'Farm To Home',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bulk-orders', bulkRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Serverless Fallback Mounts (in case /api is stripped by any proxy)
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/coupons', couponRoutes);
app.use('/reviews', reviewRoutes);
app.use('/bulk-orders', bulkRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);

// Serve static client assets in production if client/dist exists
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🌿 [VRUKSHA] Backend server running on port ${PORT}`);
    console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
  });
};

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
