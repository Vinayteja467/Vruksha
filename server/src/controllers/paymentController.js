import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';
import { calculateOrderPricing } from '../services/pricingService.js';
import { Order } from '../models/Order.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { isConnectedToMongo } from '../config/db.js';

let razorpayInstance = null;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && !env.RAZORPAY_KEY_ID.includes('placeholder')) {
  try {
    razorpayInstance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET
    });
    console.log('💳 [Razorpay] Official SDK initialized with configured API credentials');
  } catch (err) {
    console.warn('⚠️ [Razorpay] Failed to initialize Razorpay SDK instance:', err.message);
  }
}

export const getPaymentConfig = (req, res) => {
  res.json({
    success: true,
    razorpayKeyId: env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
    isTestMode: !env.RAZORPAY_KEY_ID || env.RAZORPAY_KEY_ID.includes('placeholder') || env.RAZORPAY_KEY_ID.startsWith('rzp_test_'),
    supportedMethods: [
      { id: 'razorpay', name: 'Razorpay Gateway', description: 'Instant UPI, Cards & NetBanking' },
      { id: 'upi', name: 'UPI Quick Pay', description: 'Google Pay, PhonePe, Paytm, BHIM' },
      { id: 'card', name: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay' },
      { id: 'netbanking', name: 'Net Banking', description: 'All major Indian banks' },
      { id: 'cod', name: 'Cash on Delivery', description: 'Pay cash upon delivery at your doorstep' }
    ],
    codAvailable: true,
    currency: 'INR'
  });
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, couponCode, deliveryMethod, receipt } = req.body;

    let amountInPaise;
    let pricingBreakdown;

    if (items && Array.isArray(items) && items.length > 0) {
      // Authoritative pricing calculation
      pricingBreakdown = await calculateOrderPricing({ items, couponCode, deliveryMethod });
      amountInPaise = pricingBreakdown.totalInPaise;
    } else if (req.body.amount) {
      amountInPaise = Math.round(Number(req.body.amount) * 100);
    } else {
      return res.status(400).json({ success: false, message: 'Cart items or amount required' });
    }

    const orderReceipt = receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (razorpayInstance) {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderReceipt,
        notes: {
          brand: 'VRUKSHA Farm To Home'
        }
      });

      return res.json({
        success: true,
        order: razorpayOrder,
        keyId: env.RAZORPAY_KEY_ID,
        pricing: pricingBreakdown
      });
    }

    // Test / Simulated Razorpay Order Structure
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;
    res.json({
      success: true,
      order: {
        id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: orderReceipt,
        status: 'created'
      },
      keyId: env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
      pricing: pricingBreakdown,
      isSimulated: true
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Missing Razorpay order or payment ID' });
    }

    // Verify cryptographic signature if secret is active
    const secret = env.RAZORPAY_KEY_SECRET;
    if (secret && !secret.includes('placeholder')) {
      if (!razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Razorpay signature is required for verification' });
      }

      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
      }
    }

    // Idempotently update order status if orderId supplied
    if (orderId) {
      if (isConnectedToMongo) {
        const order = await Order.findOne({
          $or: [
            { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
            { orderNumber: orderId }
          ]
        });

        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.paymentId = razorpay_payment_id;
          order.orderStatus = 'Confirmed';
          order.timeline.push({
            status: 'Payment Received',
            date: new Date(),
            description: `Payment authorized via Razorpay (${razorpay_payment_id})`
          });
          await order.save();
        }
      } else {
        const order = inMemoryStore.getOrderById(orderId);
        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.paymentId = razorpay_payment_id;
          order.orderStatus = 'Confirmed';
        }
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    next(err);
  }
};

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET || env.RAZORPAY_KEY_SECRET;

    if (webhookSecret && !webhookSecret.includes('placeholder') && req.rawBody) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(req.rawBody)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body;
    console.log(`🔔 [Razorpay Webhook] Event received: ${event?.event}`);

    if (event?.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      if (isConnectedToMongo) {
        await Order.updateMany(
          { paymentId: orderId },
          {
            $set: {
              paymentStatus: 'paid',
              paymentId: paymentId,
              orderStatus: 'Confirmed'
            }
          }
        );
      }
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
