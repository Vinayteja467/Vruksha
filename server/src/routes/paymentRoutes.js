import express from 'express';
import { getPaymentConfig, createRazorpayOrder, verifyPayment, checkPaymentStatus, handleRazorpayWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/config', getPaymentConfig);
router.post('/razorpay/create-order', createRazorpayOrder);
router.get('/razorpay/status/:orderId', checkPaymentStatus);
router.post('/razorpay/verify', verifyPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

export default router;
