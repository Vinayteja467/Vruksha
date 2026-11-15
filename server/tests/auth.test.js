import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { register, login, getProfile } from '../src/controllers/authController.js';
import { protect } from '../src/middleware/authMiddleware.js';
import { inMemoryStore } from '../src/config/inMemoryStore.js';
import { env } from '../src/config/env.js';

describe('Authentication & Serverless Self-Healing Controls', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  let issuedToken = null;
  let testUserId = null;

  it('should register a new customer account successfully', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      body: {
        name: 'Vruksha Customer',
        email: testEmail,
        phone: '9876543210',
        password: 'Password@123'
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await register(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.user.email, testEmail);
    assert.ok(responseData.token, 'Token must be issued');

    issuedToken = responseData.token;
    testUserId = responseData.user.id;

    // Verify token contains self-healing user payload
    const decoded = jwt.verify(issuedToken, env.JWT_SECRET);
    assert.strictEqual(decoded.id, testUserId);
    assert.strictEqual(decoded.email, testEmail);
    assert.strictEqual(decoded.name, 'Vruksha Customer');
    assert.strictEqual(decoded.role, 'user');
  });

  it('should prevent duplicate registration with the same email', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      body: {
        name: 'Another Customer',
        email: testEmail,
        phone: '9876543211',
        password: 'Password@123'
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await register(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 400);
    assert.strictEqual(responseData.success, false);
    assert.match(responseData.message, /already exists/i);
  });

  it('should authenticate user with valid credentials via login', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      body: {
        email: testEmail,
        password: 'Password@123'
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await login(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.user.email, testEmail);
    assert.ok(responseData.token);
  });

  it('should reject login with wrong password', async () => {
    let statusCode = 200;
    let responseData = null;

    const req = {
      body: {
        email: testEmail,
        password: 'IncorrectPassword'
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await login(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(responseData.success, false);
    assert.match(responseData.message, /incorrect password/i);
  });

  it('should authorize protected routes and self-heal user session across stateless serverless lambdas', async () => {
    // Simulate a fresh Vercel serverless cold-start container by removing test user from RAM
    const initialIndex = inMemoryStore.users.findIndex(u => u.id === testUserId);
    if (initialIndex !== -1) {
      inMemoryStore.users.splice(initialIndex, 1);
    }

    // Verify user is not currently in memory
    const userInMemoryBefore = await inMemoryStore.findUserById(testUserId);
    assert.strictEqual(userInMemoryBefore, null, 'User should not exist in RAM to simulate new serverless lambda');

    // Make protected request with Bearer token
    let statusCode = 200;
    let responseData = null;
    let nextCalled = false;

    const req = {
      headers: {
        authorization: `Bearer ${issuedToken}`
      }
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { responseData = data; return res; }
    };

    await protect(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true, 'Protect middleware must succeed');
    assert.ok(req.user, 'req.user must be self-healed');
    assert.strictEqual(req.user.id, testUserId);
    assert.strictEqual(req.user.email, testEmail);

    // Call getProfile with self-healed user
    await getProfile(req, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.user.email, testEmail);
  });
});
