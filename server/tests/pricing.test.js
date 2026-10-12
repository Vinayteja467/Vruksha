import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateOrderPricing } from '../src/services/pricingService.js';
import { inMemoryStore } from '../src/config/inMemoryStore.js';

describe('Server Authoritative Pricing Service', () => {
  it('should calculate accurate pricing from authoritative store data and ignore client price claims', async () => {
    // Client attempts to claim Beetroot powder is ₹1
    const clientItems = [
      {
        product: 'prod-001',
        size: '100g',
        quantity: 2,
        price: 1, // TAMPER ATTEMPT
        total: 2  // TAMPER ATTEMPT
      }
    ];

    const result = await calculateOrderPricing({
      items: clientItems,
      deliveryMethod: 'standard'
    });

    const expectedProduct = inMemoryStore.getProductById('prod-001');
    const expectedUnitPrice = expectedProduct.sizes[0].price; // 249

    assert.strictEqual(result.items[0].price, expectedUnitPrice, 'Server must enforce authoritative database price');
    assert.strictEqual(result.subtotal, expectedUnitPrice * 2, 'Subtotal must equal authoritative price * quantity');
    assert.strictEqual(result.totalInPaise, result.total * 100, 'Paise must be exact integer multiple');
  });

  it('should apply free shipping when order exceeds threshold of ₹499', async () => {
    // 3 units of 100g @ ₹249 = ₹747 >= ₹499
    const items = [
      {
        product: 'prod-001',
        size: '100g',
        quantity: 3
      }
    ];

    const result = await calculateOrderPricing({
      items,
      deliveryMethod: 'standard'
    });

    assert.strictEqual(result.shippingFee, 0, 'Shipping fee must be ₹0 when subtotal >= ₹499');
    assert.strictEqual(result.total, 747);
  });

  it('should apply standard shipping fee of ₹49 when below threshold', async () => {
    // Single 100g item: ₹249 < ₹499
    const items = [
      {
        product: 'prod-001',
        size: '100g',
        quantity: 1
      }
    ];

    const result = await calculateOrderPricing({
      items,
      deliveryMethod: 'standard'
    });

    assert.strictEqual(result.shippingFee, 49, 'Standard shipping fee of ₹49 must apply below ₹499');
    assert.strictEqual(result.total, 249 + 49);
  });

  it('should validate coupons against server database rules', async () => {
    // 3 units @ ₹249 = ₹747. 10% coupon = ₹75 discount
    const items = [
      {
        product: 'prod-001',
        size: '100g',
        quantity: 3
      }
    ];

    const result = await calculateOrderPricing({
      items,
      couponCode: 'PURE10',
      deliveryMethod: 'standard'
    });

    assert.strictEqual(result.couponApplied, 'PURE10');
    assert.strictEqual(result.discountAmount, Math.round((747 * 10) / 100));
    assert.strictEqual(result.total, 747 - 75);
  });

  it('should reject non-existent products', async () => {
    await assert.rejects(
      async () => {
        await calculateOrderPricing({
          items: [{ product: 'invalid-non-existent-product-id', quantity: 1 }]
        });
      },
      /Product not found or unavailable/
    );
  });
});
