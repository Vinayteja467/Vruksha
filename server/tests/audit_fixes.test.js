import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getProducts, getCategoryAliases } from '../src/controllers/productController.js';
import { trackOrder, createOrder } from '../src/controllers/orderController.js';
import { subscribeNewsletter } from '../src/controllers/contactController.js';
import { inMemoryStore } from '../src/config/inMemoryStore.js';

describe('Audit Fixes Verification & Regression Suite', () => {
  it('should safely handle regex special characters in product search without crashing', async () => {
    // Search with unescaped bracket, parentheses, asterisks
    const searchTerms = ['[', '(', '*', '+', '?', '\\', '.*.*'];
    for (const term of searchTerms) {
      let responseData = null;
      let statusCode = 200;
      const req = { query: { search: term } };
      const res = {
        status: (code) => { statusCode = code; return res; },
        json: (data) => { responseData = data; return res; }
      };

      await getProducts(req, res, (err) => {
        if (err) throw err;
      });

      assert.strictEqual(statusCode, 200, `Search for "${term}" must not crash`);
      assert.strictEqual(responseData.success, true);
      assert(Array.isArray(responseData.products));
    }
  });

  it('should resolve category aliases seamlessly between powders and products', () => {
    const fruitAliases = getCategoryAliases('fruit-powders');
    assert(fruitAliases.includes('fruit-products'));
    assert(fruitAliases.includes('fruit-powders'));
    assert(fruitAliases.includes('fruit powders'));
    assert(fruitAliases.includes('fruit products'));

    const vegAliases = getCategoryAliases('vegetable-products');
    assert(vegAliases.includes('vegetable-powders'));
    assert(vegAliases.includes('vegetable-products'));

    const comboAliases = getCategoryAliases('popular-combos');
    assert(comboAliases.includes('combos'));
    assert(comboAliases.includes('popular combos'));
  });

  it('should filter inMemoryStore products across category aliases', () => {
    const res1 = inMemoryStore.getProducts({ category: 'vegetable-powders' });
    const res2 = inMemoryStore.getProducts({ category: 'vegetable-products' });

    assert(res1.products.length > 0, 'vegetable-powders should match products');
    assert.strictEqual(res1.products.length, res2.products.length, 'Both alias forms must return matching count');
  });

  it('should reject invalid phone numbers on order placement', async () => {
    let responseData = null;
    let statusCode = 200;
    const req = {
      body: {
        customerInfo: { fullName: 'Invalid Phone User', email: 'user@test.com', phone: '12345' }, // Invalid phone
        shippingAddress: { house: '1', street: 'Street', city: 'City', pincode: '560001' },
        items: [{ product: inMemoryStore.products[0].id, quantity: 1 }],
        paymentMethod: 'cod'
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await createOrder(req, res, () => {});
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.success, false);
    assert(responseData.message.includes('10-digit'));
  });

  it('should track orders publicly with order number and matching phone/email', async () => {
    // 1. Create a known test order
    let newOrderData = null;
    const orderReq = {
      body: {
        customerInfo: { fullName: 'Tracker User', email: 'trackme@vruksha.in', phone: '9845098450' },
        shippingAddress: { house: '10', street: 'Green Lane', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
        items: [{ product: inMemoryStore.products[0].id, quantity: 1 }],
        paymentMethod: 'cod'
      }
    };
    const orderRes = {
      status: () => orderRes,
      json: (data) => { newOrderData = data; return orderRes; }
    };
    await createOrder(orderReq, orderRes, () => {});
    const orderNumber = newOrderData.order.orderNumber;
    assert(orderNumber.startsWith('VRK-ORD-'), 'New order must use VRK-ORD- prefix');

    // 2. Track with matching phone
    let trackResData = null;
    let trackStatus = 200;
    const trackReq1 = {
      body: { orderNumber, contact: '9845098450' }
    };
    const trackRes1 = {
      status: (code) => { trackStatus = code; return trackRes1; },
      json: (data) => { trackResData = data; return trackRes1; }
    };
    await trackOrder(trackReq1, trackRes1, () => {});
    assert.strictEqual(trackStatus, 200);
    assert.strictEqual(trackResData.success, true);
    assert.strictEqual(trackResData.order.orderNumber, orderNumber);

    // 3. Track with matching email
    trackStatus = 200;
    const trackReq2 = {
      body: { orderNumber, contact: 'trackme@vruksha.in' }
    };
    await trackOrder(trackReq2, trackRes1, () => {});
    assert.strictEqual(trackStatus, 200);

    // 4. Reject tracking when contact does not match
    trackStatus = 200;
    const badTrackReq = {
      body: { orderNumber, contact: '9999999999' }
    };
    await trackOrder(badTrackReq, trackRes1, () => {});
    assert.strictEqual(trackStatus, 403, 'Must reject unauthorized contact mismatch');
  });

  it('should persist newsletter subscriptions and return promo coupon', async () => {
    let subData = null;
    let subStatus = 200;
    const req = { body: { email: 'subscriber@naturalwellness.in' } };
    const res = {
      status: (code) => { subStatus = code; return res; },
      json: (data) => { subData = data; return res; }
    };

    await subscribeNewsletter(req, res, () => {});
    assert.strictEqual(subStatus, 200);
    assert.strictEqual(subData.success, true);
    assert.strictEqual(subData.coupon, 'VRUKSHA10');

    // Verify persisted inquiry
    const saved = inMemoryStore.contactInquiries?.find(c => c.email === 'subscriber@naturalwellness.in');
    assert(saved, 'Newsletter subscriber must be persisted');
    assert.strictEqual(saved.status, 'Subscribed');
  });
});

