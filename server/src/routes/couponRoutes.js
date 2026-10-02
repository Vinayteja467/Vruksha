import express from 'express';
import { getCoupons, applyCoupon, createCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/apply', applyCoupon);
router.post('/', protect, adminOnly, createCoupon);

export default router;
