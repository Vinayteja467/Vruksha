import { inMemoryStore } from '../config/inMemoryStore.js';
import { Order } from '../models/Order.js';
import { isConnectedToMongo } from '../config/db.js';

export const createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;

    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (!orderData.customerInfo || !orderData.shippingAddress) {
      return res.status(400).json({ success: false, message: 'Customer info and shipping address are required' });
    }

    let order;
    if (isConnectedToMongo) {
      const orderNumber = `PH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      order = await Order.create({
        ...orderData,
        orderNumber,
        user: req.user ? (req.user._id || req.user.id) : undefined,
        timeline: [
          {
            status: 'Order Placed',
            date: new Date(),
            description: orderData.paymentMethod === 'cod' ? 'Order placed with Cash on Delivery' : 'Payment authorized and verified'
          }
        ]
      });
    } else {
      order = inMemoryStore.createOrder({
        ...orderData,
        user: req.user ? req.user.id : undefined
      });
    }

    res.status(201).json({ success: true, order });
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
        $or: [{ user: userId }, { 'customerInfo.email': req.user.email }]
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
