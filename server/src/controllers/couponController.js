import { inMemoryStore } from '../config/inMemoryStore.js';
import { Coupon } from '../models/Coupon.js';
import { isConnectedToMongo } from '../config/db.js';

export const getCoupons = async (req, res, next) => {
  try {
    if (isConnectedToMongo) {
      const coupons = await Coupon.find({ isActive: true });
      return res.json({ success: true, coupons });
    }
    res.json({ success: true, coupons: inMemoryStore.getCoupons() });
  } catch (err) {
    next(err);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    if (isConnectedToMongo) {
      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
      if (!coupon) {
        return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
      }

      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`
        });
      }

      let discountAmount = 0;
      if (coupon.discountPercent) {
        discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
      }

      return res.json({
        success: true,
        coupon,
        discountAmount,
        freeShipping: coupon.freeShipping,
        message: `Coupon ${coupon.code} applied successfully!`
      });
    } else {
      const result = inMemoryStore.validateCoupon(code, subtotal);
      if (!result.valid) {
        return res.status(400).json({ success: false, message: result.message });
      }
      return res.json({ success: true, ...result });
    }
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const couponData = req.body;
    if (isConnectedToMongo) {
      const created = await Coupon.create(couponData);
      return res.status(201).json({ success: true, coupon: created });
    } else {
      const created = inMemoryStore.createCoupon(couponData);
      return res.status(201).json({ success: true, coupon: created });
    }
  } catch (err) {
    next(err);
  }
};
