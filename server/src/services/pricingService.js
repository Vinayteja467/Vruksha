import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { isConnectedToMongo } from '../config/db.js';

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 49;
const EXPRESS_SURCHARGE = 50;

/**
 * Authoritative Server-Side Pricing Engine
 * Never trusts prices, discounts, shipping fees, or totals from the client.
 */
export const calculateOrderPricing = async ({ items, couponCode, deliveryMethod = 'standard' }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one product item');
  }

  const validatedItems = [];
  let subtotal = 0;

  for (const rawItem of items) {
    const productIdOrSlug = rawItem.product || rawItem.id || rawItem.slug;
    const requestedSize = rawItem.size || '100g';
    const quantity = Math.max(1, parseInt(rawItem.quantity, 10) || 1);

    if (!productIdOrSlug) {
      throw new Error('Each item must have a valid product identifier');
    }

    let productDoc;
    if (isConnectedToMongo) {
      productDoc = await Product.findOne({
        $or: [
          { _id: productIdOrSlug.match(/^[0-9a-fA-F]{24}$/) ? productIdOrSlug : null },
          { slug: productIdOrSlug }
        ]
      });
    } else {
      productDoc = inMemoryStore.getProductById(productIdOrSlug) || inMemoryStore.getProductBySlug(productIdOrSlug);
    }

    if (!productDoc) {
      throw new Error(`Product not found or unavailable: ${productIdOrSlug}`);
    }

    // Stock check
    if (productDoc.stock < quantity) {
      throw new Error(`Insufficient stock for "${productDoc.name}". Requested: ${quantity}, Available: ${productDoc.stock}`);
    }

    // Authoritative Variant & Pricing Match
    const baseSize = productDoc.sizes?.[0]?.size || '100g';
    const foundSize = productDoc.sizes?.find((s) => s.size === requestedSize);

    let unitPrice = productDoc.price;
    if (requestedSize === baseSize && productDoc.price) {
      unitPrice = productDoc.price;
    } else if (foundSize?.price) {
      unitPrice = foundSize.price;
    }

    const itemTotal = unitPrice * quantity;
    subtotal += itemTotal;

    validatedItems.push({
      product: productDoc._id ? productDoc._id.toString() : productDoc.id,
      name: productDoc.name,
      slug: productDoc.slug,
      image: productDoc.images?.[0] || '',
      size: requestedSize,
      price: unitPrice,
      quantity,
      itemTotal
    });
  }

  // Coupon Validation
  let discountAmount = 0;
  let validatedCoupon = null;
  let freeShippingFromCoupon = false;

  if (couponCode && typeof couponCode === 'string' && couponCode.trim() !== '') {
    const cleanCode = couponCode.trim().toUpperCase();
    let couponDoc;

    if (isConnectedToMongo) {
      couponDoc = await Coupon.findOne({ code: cleanCode, isActive: true });
    } else {
      couponDoc = inMemoryStore.coupons.find(c => c.code === cleanCode && c.isActive);
    }

    if (couponDoc) {
      if (couponDoc.expiryDate && new Date(couponDoc.expiryDate) < new Date()) {
        // Expired
      } else if (subtotal >= (couponDoc.minOrderAmount || 0)) {
        if (couponDoc.discountPercent) {
          discountAmount = Math.round((subtotal * couponDoc.discountPercent) / 100);
        } else if (couponDoc.discountAmount) {
          discountAmount = Math.min(couponDoc.discountAmount, subtotal);
        }

        if (couponDoc.freeShipping) {
          freeShippingFromCoupon = true;
        }

        validatedCoupon = couponDoc.code;
      }
    }
  }

  // Shipping Calculation
  const isFreeStandard = subtotal >= FREE_SHIPPING_THRESHOLD || freeShippingFromCoupon;
  let baseShipping = isFreeStandard ? 0 : STANDARD_SHIPPING_FEE;
  let expressFee = deliveryMethod === 'express' ? EXPRESS_SURCHARGE : 0;
  let shippingFee = baseShipping + expressFee;

  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalInPaise = Math.round(total * 100);

  return {
    items: validatedItems,
    subtotal,
    discountAmount,
    couponApplied: validatedCoupon || '',
    shippingFee,
    deliveryMethod,
    total,
    totalInPaise,
    currency: 'INR'
  };
};
