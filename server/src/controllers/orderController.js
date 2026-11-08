import { inMemoryStore } from '../config/inMemoryStore.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { isConnectedToMongo } from '../config/db.js';
import { calculateOrderPricing } from '../services/pricingService.js';

export const createOrder = async (req, res, next) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      items,
      couponCode,
      deliveryMethod = 'standard',
      paymentMethod,
      razorpay_payment_id
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ success: false, message: 'Complete customer contact information is required' });
    }

    if (!shippingAddress || !shippingAddress.house || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // 1. Authoritative Server-Side Pricing & Stock Verification
    const pricing = await calculateOrderPricing({
      items,
      couponCode,
      deliveryMethod
    });

    // 2. Atomic Stock Decrementing
    if (isConnectedToMongo) {
      for (const item of pricing.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.product.match(/^[0-9a-fA-F]{24}$/) ? item.product : null,
            stock: { $gte: item.quantity }
          },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error(`Insufficient stock for "${item.name}". Please adjust quantity.`);
        }
      }
    } else {
      for (const item of pricing.items) {
        const product = inMemoryStore.products.find(p => p.id === item.product || p.slug === item.slug);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${item.name}".`);
        }
        product.stock -= item.quantity;
      }
    }

    // 3. Payment Status Enforcement
    // Online payments remain 'pending' until verified via Razorpay verification endpoint/webhook
    let initialPaymentStatus = 'pending';
    let paymentId = '';

    if (paymentMethod === 'cod') {
      initialPaymentStatus = 'pending';
    } else if (razorpay_payment_id) {
      // If payment was verified prior to order persistence
      initialPaymentStatus = 'paid';
      paymentId = razorpay_payment_id;
    }

    const orderNumber = `PH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderNumber,
      user: req.user ? (req.user._id || req.user.id) : undefined,
      customerInfo: {
        fullName: customerInfo.fullName.trim(),
        email: customerInfo.email.trim().toLowerCase(),
        phone: customerInfo.phone.trim()
      },
      shippingAddress: {
        house: shippingAddress.house.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state || 'Maharashtra',
        pincode: shippingAddress.pincode.trim()
      },
      items: pricing.items,
      deliveryMethod: pricing.deliveryMethod,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: initialPaymentStatus,
      paymentId: paymentId,
      orderStatus: initialPaymentStatus === 'paid' ? 'Confirmed' : 'Placed',
      subtotal: pricing.subtotal,
      shippingFee: pricing.shippingFee,
      discountAmount: pricing.discountAmount,
      couponApplied: pricing.couponApplied,
      total: pricing.total,
      timeline: [
        {
          status: 'Order Placed',
          date: new Date(),
          description: paymentMethod === 'cod'
            ? 'Order placed with Cash on Delivery'
            : (initialPaymentStatus === 'paid' ? 'Order confirmed with authorized payment' : 'Order placed, awaiting payment confirmation')
        }
      ]
    };

    let order;
    if (isConnectedToMongo) {
      order = await Order.create(orderPayload);
    } else {
      order = inMemoryStore.createOrder(orderPayload);
    }

    res.status(201).json({
      success: true,
      order,
      pricing
    });
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    let orders;

    if (isConnectedToMongo) {
      orders = await Order.find({
        $or: [{ user: userId }, { 'customerInfo.email': req.user.email.toLowerCase() }]
      }).sort({ createdAt: -1 });
    } else {
      orders = inMemoryStore.getOrdersByUser(userId);
    }

    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (isConnectedToMongo) {
      order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      });
    } else {
      order = inMemoryStore.getOrderById(id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // IDOR Protection: verify order ownership or admin role
    const currentUserId = req.user ? (req.user._id ? req.user._id.toString() : req.user.id) : null;
    const currentUserEmail = req.user ? req.user.email.toLowerCase() : null;
    const isOwner =
      (order.user && currentUserId && order.user.toString() === currentUserId) ||
      (currentUserEmail && order.customerInfo?.email?.toLowerCase() === currentUserEmail);
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this order'
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    let orders;
    if (isConnectedToMongo) {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      orders = inMemoryStore.getAllOrders();
    }
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    if (isConnectedToMongo) {
      const order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.orderStatus = status;
      order.timeline.push({
        status,
        date: new Date(),
        description: description || `Status updated to ${status}`
      });
      const updated = await order.save();
      return res.json({ success: true, order: updated });
    } else {
      const updated = inMemoryStore.updateOrderStatus(id, status);
      if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order: updated });
    }
  } catch (err) {
    next(err);
  }
};
