import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    house: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  items: [orderItemSchema],
  deliveryMethod: { type: String, default: 'standard' },
  paymentMethod: { type: String, required: true, enum: ['razorpay', 'upi', 'card', 'netbanking', 'cod'] },
  paymentStatus: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
  paymentId: { type: String, default: '' },
  orderStatus: {
    type: String,
    default: 'Placed',
    enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponApplied: { type: String, default: '' },
  total: { type: Number, required: true },
  timeline: [
    {
      status: { type: String, required: true },
      date: { type: Date, default: Date.now },
      description: { type: String }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
