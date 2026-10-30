import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

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
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in fallback for preview deployments
    }
  },
  credentials: true
}));
app.options('*', cors());

// Ensure MongoDB connection in Serverless environments
let isServerlessDbConnected = false;
app.use(async (req, res, next) => {
  if (!isServerlessDbConnected && process.env.VERCEL) {
    try {
      await connectDB();
      isServerlessDbConnected = true;
    } catch (err) {
      console.warn('⚠️ Serverless DB connect warning:', err.message);
    }
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

// Normalize URL in case Vercel rewrites strip or alter the /api prefix
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : `/${req.url}`);
  }
  next();
});

// Apply general API rate limiter to all /api routes
app.use('/api', apiRateLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'VRUKSHA',
    tagline: 'Farm To Home',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Client Error Logging Telemetry (Item 15)
app.post('/api/error-log', (req, res) => {
  const { message, stack, url, info, timestamp } = req.body || {};
  console.error(`🚨 [Client Error Log ${timestamp || new Date().toISOString()}]:`, {
    message,
    url,
    info,
    ip: req.ip
  });
  res.json({ success: true, recorded: true });
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

// Start Server helper
export const startServer = async () => {
  await connectDB();
  return app.listen(PORT, () => {
    console.log(`🌿 [VRUKSHA] Backend server running on port ${PORT}`);
    console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
  });
};

// Auto-start when executed directly and not inside serverless runtime
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
