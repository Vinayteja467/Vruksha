import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createOrder } from '../src/controllers/orderController.js';
import { submitContactInquiry } from '../src/controllers/contactController.js';
import { addReview } from '../src/controllers/reviewController.js';
import { inMemoryStore } from '../src/config/inMemoryStore.js';

describe('Inventory, Contact Persistence & Verified Review Controls', () => {
  it('should decrement product stock when order is placed successfully', async () => {
    // Pick prod-012 (Sun-Dried Ginger Powder) for isolated stock test
    const product = inMemoryStore.products.find(p => p.id === 'prod-012') || inMemoryStore.products[inMemoryStore.products.length - 1];
    const initialStock = product.stock;

    let responseData = null;
    let statusCode = 200;

    const req = {
      body: {
        customerInfo: { fullName: 'Test Buyer', email: 'buyer@test.com', phone: '9876543210' },
        shippingAddress: { house: '42', street: 'Farm Rd', city: 'Pune', pincode: '411001' },
        items: [{ product: product.id, size: '100g', quantity: 2 }],
        paymentMethod: 'cod'
      },
      user: { id: 'test-buyer-1', email: 'buyer@test.com' }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await createOrder(req, res, () => {});

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(product.stock, initialStock - 2, 'Stock must be decremented by ordered quantity');
  });

  it('should reject purchase requests when ordered quantity exceeds available stock', async () => {
    const product = inMemoryStore.products[0];
    let responseData = null;
    let statusCode = 200;

    const req = {
      body: {
        customerInfo: { fullName: 'Big Buyer', email: 'big@test.com', phone: '9876543210' },
        shippingAddress: { house: '42', street: 'Farm Rd', city: 'Pune', pincode: '411001' },
        items: [{ product: product.id, size: '100g', quantity: product.stock + 500 }],
        paymentMethod: 'cod'
      },
      user: { id: 'test-buyer-2', email: 'big@test.com' }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    let nextError = null;
    await createOrder(req, res, (err) => { nextError = err; });

    assert.ok(nextError, 'Must throw error when stock is insufficient');
    assert.match(nextError.message, /Insufficient stock/);
  });

  it('should persist contact inquiry and return unique reference ID', async () => {
    let responseData = null;
    let statusCode = 200;

    const req = {
      body: {
        name: 'Anita Roy',
        email: 'anita@example.com',
        phone: '9812345678',
        message: 'Inquiring about shipment status'
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await submitContactInquiry(req, res, () => {});

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(responseData.success, true);
    assert.ok(responseData.referenceId.startsWith('VRK-INQ-'), 'Must generate VRK-INQ reference number');
  });

  it('should mark review verifiedPurchase as FALSE if customer has no delivered order of that product', async () => {
    let responseData = null;
    let statusCode = 200;

    const req = {
      body: {
        productId: 'prod-009',
        productName: 'Sweet Carrot Powder',
        rating: 5,
        comment: 'Great packaging!'
      },
      user: { id: 'random-user-unpurchased', name: 'Random User', email: 'random@example.com' }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await addReview(req, res, () => {});

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.review.verifiedPurchase, false, 'Unpurchased product review cannot have verifiedPurchase: true');
  });

  it('should mark review verifiedPurchase as TRUE if customer actually ordered and received the product', async () => {
    inMemoryStore.createOrder({
      orderNumber: `PH-ORD-DELIVERED-${Date.now()}`,
      user: 'test-buyer-verified-user',
      customerInfo: { fullName: 'Verified Buyer', email: 'verified-unique@example.com', phone: '9999999999' },
      shippingAddress: { house: '1', street: 'Main', city: 'Delhi', pincode: '110001' },
      items: [{ product: 'prod-003', slug: 'wild-amla-powder', name: 'Wild Amla Powder', price: 349, quantity: 1 }],
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      orderStatus: 'Delivered', // Delivered state!
      subtotal: 349,
      total: 398
    });

    let responseData = null;
    let statusCode = 200;

    const req = {
      body: {
        productId: 'prod-003',
        productName: 'Wild Amla Powder',
        rating: 5,
        comment: 'Pure and effective!'
      },
      user: { id: 'test-buyer-verified-user', name: 'Verified Buyer', email: 'verified-unique@example.com' }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await addReview(req, res, () => {});

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.review.verifiedPurchase, true, 'Delivered purchase must receive verifiedPurchase: true');
  });
});
