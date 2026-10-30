import express from 'express';
import { getDashboardStats, getCustomers, triggerBackup } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/customers', protect, adminOnly, getCustomers);
router.post('/backup', protect, adminOnly, triggerBackup);

export default router;
