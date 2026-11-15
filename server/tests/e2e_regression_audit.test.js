import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../src/server.js';

describe('VRUKSHA 2nd-Round End-to-End Regression Audit', () => {
  let server;
  let BASE_URL;
  let customerToken = null;
  let customerUser = null;
  let createdOrderId = null;
  let createdOrderNumber = null;
  const testEmail = `e2e_customer_${Date.now()}@vruksha.in`;
  const testPhone = '9876543210';

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        BASE_URL = `http://127.0.0.1:${port}/api`;
        resolve();
      });
    });
  });

  after(() => {
    if (server) {
      server.close();
    }
  });

  // 1. SYSTEM HEALTH
  it('1. System Health: /api/health should be online with brand info', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'online');
    assert.strictEqual(data.brand, 'VRUKSHA');
  });

  // 2. AUTHENTICATION & VALIDATION
  it('2. Registration: should reject invalid phone formats', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid User',
        email: 'invalid@vruksha.in',
        phone: '12345', // invalid phone
        password: 'Password123'
      })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert(data.message.includes('10-digit'));
  });

  it('2. Registration: should register new customer account successfully', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ananya Sharma',
        email: testEmail,
        phone: testPhone,
        password: 'Password123'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.token, 'Token must be returned');
    assert.strictEqual(data.user.email, testEmail);
    customerToken = data.token;
    customerUser = data.user;
  });

  it('2. Login: should authenticate user and return token', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password123'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.token);
  });

  it('2. Login: should reject invalid credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999'
      })
    });
    assert.strictEqual(res.status, 401);
  });

  // 3. CATALOG & CATEGORY NAVIGATION
  it('3. Category Navigation: should resolve category aliases seamlessly', async () => {
    // Both fruit-powders and fruit-products should return valid items
    const res1 = await fetch(`${BASE_URL}/products?category=fruit-powders`);
    assert.strictEqual(res1.status, 200);
    const data1 = await res1.json();
    assert(data1.products.length > 0, 'fruit-powders must return products');

    const res2 = await fetch(`${BASE_URL}/products?category=fruit-products`);
    assert.strictEqual(res2.status, 200);
    const data2 = await res2.json();
    assert(data2.products.length > 0, 'fruit-products must return products');

    const resCombos = await fetch(`${BASE_URL}/products?category=popular-combos`);
    assert.strictEqual(resCombos.status, 200);
    const dataCombos = await resCombos.json();
    assert(dataCombos.products.length > 0, 'popular-combos must return products');
  });

  // 4. SEARCH & REGEX RESILIENCE
  it('4. Search: should safely handle regex special characters without crashing (200 OK)', async () => {
    const specialQueries = ['[', ']', '(', ')', '*', '+', '?', '\\', '.*.*', '[pack'];
    for (const q of specialQueries) {
      const res = await fetch(`${BASE_URL}/products?search=${encodeURIComponent(q)}`);
      assert.strictEqual(res.status, 200, `Search for "${q}" must return 200 OK without crashing`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert(Array.isArray(data.products));
    }
  });

  // 5. PRODUCT DETAILS
  it('5. Product Details: should fetch product by slug', async () => {
    const res = await fetch(`${BASE_URL}/products/beetroot-powder`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.product.slug, 'beetroot-powder');
    assert(data.product.sizes?.length > 0);
  });

  // 6. CHECKOUT & CASH ON DELIVERY (COD)
  it('6. Checkout: should place Cash on Delivery order with VRK-ORD- prefix', async () => {
    const orderPayload = {
      customerInfo: {
        fullName: 'Ananya Sharma',
        email: testEmail,
        phone: testPhone
      },
      shippingAddress: {
        house: 'Flat 304, Green Heights',
        street: '12th Main, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      items: [
        { product: 'prod-001', size: '100g', quantity: 2 }
      ],
      deliveryMethod: 'standard',
      paymentMethod: 'cod'
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify(orderPayload)
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.order, 'Order must be created');
    assert(data.order.orderNumber.startsWith('VRK-ORD-'), `Order prefix must be VRK-ORD-, got ${data.order.orderNumber}`);
    assert.strictEqual(data.order.paymentMethod, 'cod');
    assert.strictEqual(data.order.paymentStatus, 'pending');
    assert.strictEqual(data.order.shippingAddress.state, 'Karnataka');

    createdOrderId = data.order._id || data.order.id;
    createdOrderNumber = data.order.orderNumber;
  });

  // 7. UNIVERSAL GUEST ORDER TRACKING
  it('7. Order Tracking: should allow public tracking with order number and matching contact', async () => {
    assert(createdOrderNumber, 'Must have created order number');

    // Matching phone lookup
    const resPhone = await fetch(`${BASE_URL}/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: createdOrderNumber,
        contact: testPhone
      })
    });
    assert.strictEqual(resPhone.status, 200);
    const dataPhone = await resPhone.json();
    assert.strictEqual(dataPhone.success, true);
    assert.strictEqual(dataPhone.order.orderNumber, createdOrderNumber);
    assert(dataPhone.order.timeline.length > 0);

    // Matching email lookup
    const resEmail = await fetch(`${BASE_URL}/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: createdOrderNumber,
        contact: testEmail
      })
    });
    assert.strictEqual(resEmail.status, 200);

    // Unauthorized contact lookup
    const resBad = await fetch(`${BASE_URL}/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: createdOrderNumber,
        contact: '9000000000' // wrong contact
      })
    });
    assert.strictEqual(resBad.status, 403, 'Must forbid tracking with mismatched contact');
  });

  // 8. ACCOUNT MANAGEMENT & ADDRESSES
  it('8. Account Management: should update user profile and manage addresses', async () => {
    // 1. Update Profile
    const resProfile = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        name: 'Ananya Sharma (Verified)',
        phone: '9876543210'
      })
    });
    assert.strictEqual(resProfile.status, 200);
    const dataProfile = await resProfile.json();
    assert.strictEqual(dataProfile.user.name, 'Ananya Sharma (Verified)');

    // 2. Add Address & toggle default
    const newAddresses = [
      {
        fullName: 'Ananya Sharma',
        phone: '9876543210',
        house: 'Villa 12',
        street: 'Palm Meadows',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066',
        isDefault: true
      },
      {
        fullName: 'Ananya Sharma Office',
        phone: '9876543210',
        house: 'Floor 4, Tech Park',
        street: 'Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        isDefault: false
      }
    ];

    const resAddr = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ addresses: newAddresses })
    });
    assert.strictEqual(resAddr.status, 200);
    const dataAddr = await resAddr.json();
    assert.strictEqual(dataAddr.user.addresses.length, 2);
    assert.strictEqual(dataAddr.user.addresses[0].isDefault, true);
  });

  // 9. REVIEW SUBMISSION
  it('9. Reviews: should submit product review successfully', async () => {
    const resReview = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        productId: 'prod-001',
        productName: 'Pure Beetroot Powder',
        name: 'Ananya Sharma',
        rating: 5,
        title: 'Amazing quality and aroma',
        comment: 'Fresh farm taste, mixes seamlessly in smoothies.'
      })
    });

    assert.strictEqual(resReview.status, 201);
    const dataReview = await resReview.json();
    assert.strictEqual(dataReview.success, true);
    assert.strictEqual(dataReview.review.rating, 5);
  });

  // 10. NEWSLETTER SUBSCRIPTION
  it('10. Newsletter: should persist newsletter subscriptions', async () => {
    const subEmail = `newsletter_${Date.now()}@organiclife.in`;
    const resSub = await fetch(`${BASE_URL}/contact/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subEmail })
    });

    assert.strictEqual(resSub.status, 200);
    const dataSub = await resSub.json();
    assert.strictEqual(dataSub.success, true);
    assert.strictEqual(dataSub.coupon, 'VRUKSHA10');
  });

  // 11. SECURITY & IDOR PROTECTION
  it('11. Security: should block unauthenticated access to admin routes', async () => {
    const resAdmin = await fetch(`${BASE_URL}/admin/stats`);
    assert.strictEqual(resAdmin.status, 401);
  });

  it('11. Security: should block regular customers from admin routes', async () => {
    const resAdmin = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert.strictEqual(resAdmin.status, 403);
  });
});
