import { describe, it } from 'node:test';
import assert from 'node:assert';
import crypto from 'crypto';
import { verifyPayment } from '../src/controllers/paymentController.js';
import { env } from '../src/config/env.js';

describe('Razorpay Cryptographic Signature & Payment Verification', () => {
  it('should accept verified Razorpay payment with valid HMAC-SHA256 signature', async () => {
    const testOrderId = 'order_valid_12345';
    const testPaymentId = 'pay_valid_67890';
    const secret = env.RAZORPAY_KEY_SECRET || 'test_secret_for_suite';

    // Temporarily set a test secret to verify HMAC calculation
    const originalSecret = env.RAZORPAY_KEY_SECRET;
    env.RAZORPAY_KEY_SECRET = 'sample_secret_key_123';

    const validSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${testOrderId}|${testPaymentId}`)
      .digest('hex');

    let responseData = null;
    let statusCode = 200;

    const req = {
      body: {
        razorpay_order_id: testOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: validSignature
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await verifyPayment(req, res, () => {});

    // Restore original secret
    env.RAZORPAY_KEY_SECRET = originalSecret;

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.paymentId, testPaymentId);
  });

  it('should reject tampered or forged Razorpay signature', async () => {
    const testOrderId = 'order_valid_12345';
    const testPaymentId = 'pay_valid_67890';

    const originalSecret = env.RAZORPAY_KEY_SECRET;
    env.RAZORPAY_KEY_SECRET = 'sample_secret_key_123';

    const forgedSignature = 'forged_fake_signature_hex_value_000000000000';

    let responseData = null;
    let statusCode = 200;

    const req = {
      body: {
        razorpay_order_id: testOrderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: forgedSignature
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await verifyPayment(req, res, () => {});

    env.RAZORPAY_KEY_SECRET = originalSecret;

    assert.strictEqual(statusCode, 400, 'Must return 400 Bad Request on signature mismatch');
    assert.strictEqual(responseData.success, false);
    assert.match(responseData.message, /Signature mismatch/);
  });
});
