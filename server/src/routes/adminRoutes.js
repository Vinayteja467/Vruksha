import express from 'express';
import { getDashboardStats, getCustomers } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/customers', protect, adminOnly, getCustomers);

export default router;
