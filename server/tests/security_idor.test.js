import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getOrderById } from '../src/controllers/orderController.js';
import { inMemoryStore } from '../src/config/inMemoryStore.js';

describe('Order Ownership & IDOR Security Controls', () => {
  // Create test orders in inMemoryStore
  const orderA = inMemoryStore.createOrder({
    orderNumber: 'PH-ORD-TEST-A',
    user: 'user-id-alice',
    customerInfo: { fullName: 'Alice Johnson', email: 'alice@example.com', phone: '9000000001' },
    shippingAddress: { house: '12', street: 'Alice St', city: 'Bengaluru', pincode: '560001' },
    items: [{ product: 'prod-001', name: 'Beetroot Powder', price: 299, quantity: 1 }],
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    subtotal: 299,
    total: 348
  });

  it('should allow Customer Alice to retrieve her own order', async () => {
    let responseData = null;
    let statusCode = 200;

    const req = {
      params: { id: orderA.orderNumber },
      user: { id: 'user-id-alice', email: 'alice@example.com', role: 'user' }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await getOrderById(req, res, () => {});

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.order.orderNumber, 'PH-ORD-TEST-A');
  });

  it('should block Customer Bob from accessing Customer Alice order (IDOR Prevention)', async () => {
    let responseData = null;
    let statusCode = 200;

    const req = {
      params: { id: orderA.orderNumber },
      user: { id: 'user-id-bob', email: 'bob@example.com', role: 'user' } // Bob tries to access Alice's order
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await getOrderById(req, res, () => {});

    assert.strictEqual(statusCode, 403, 'Must return 403 Forbidden for cross-account order access');
    assert.strictEqual(responseData.success, false);
    assert.match(responseData.message, /Forbidden/);
  });

  it('should allow Administrator to access any customer order for fulfillment', async () => {
    let responseData = null;
    let statusCode = 200;

    const req = {
      params: { id: orderA.orderNumber },
      user: { id: 'admin-id', email: 'admin@vruksha.in', role: 'admin' }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await getOrderById(req, res, () => {});

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
  });
});
