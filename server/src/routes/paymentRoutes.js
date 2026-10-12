import express from 'express';
import { getPaymentConfig, createRazorpayOrder, verifyPayment, handleRazorpayWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/config', getPaymentConfig);
router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

export default router;
