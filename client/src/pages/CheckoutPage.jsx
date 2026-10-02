import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Truck, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatters';
import { api } from '../api/client';

export const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    house: user?.addresses?.[0]?.house || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Maharashtra',
    pincode: user?.addresses?.[0]?.pincode || '',
    deliveryMethod: 'standard', // 'standard' | 'express'
    paymentMethod: 'upi', // 'razorpay' | 'upi' | 'card' | 'netbanking' | 'cod'
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR'
  ];

  const expressSurcharge = formData.deliveryMethod === 'express' ? 50 : 0;
  const finalTotal = total + expressSurcharge;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      addToast('Your cart is empty', 'error');
      navigate('/shop');
      return;
    }

    // Validations
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      addToast('Please fill out all contact information fields', 'error');
      return;
    }

    if (!formData.house.trim() || !formData.street.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      addToast('Please complete your delivery address', 'error');
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      addToast('Please enter a valid 6-digit Indian PIN code', 'error');
      return;
    }

    if (!formData.agreeTerms) {
      addToast('Please accept the Terms of Service & Privacy Policy', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          house: formData.house,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: cartItems,
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
        paymentId: formData.paymentMethod === 'cod' ? '' : `pay_rzp_${Date.now()}`,
        subtotal,
        discountAmount,
        shippingFee: shippingFee + expressSurcharge,
        couponApplied: appliedCoupon?.code || '',
        total: finalTotal
      };

      const res = await api.post('/orders', orderPayload);

      if (res.success && res.order) {
        clearCart();
        addToast('Order placed successfully! 🎉', 'success');
        navigate('/order-success', { state: { order: res.order } });
      }
    } catch (err) {
      console.error('Order creation error', err);
      addToast(err.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-forest-950">Express Checkout</h1>
          <p className="text-xs text-stone-500 mt-1">Safe, encrypted and fast ordering</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: Contact Information */}
              <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-4">
                <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest-800 text-cream-50 text-xs flex items-center justify-center font-sans">
                    1
                  </span>
                  <span>Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit mobile number"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Delivery Address */}
              <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-4">
                <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest-800 text-cream-50 text-xs flex items-center justify-center font-sans">
                    2
                  </span>
                  <span>Delivery Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Flat / House No. / Building Name *
                    </label>
                    <input
                      type="text"
                      name="house"
                      value={formData.house}
                      onChange={handleChange}
                      placeholder="Enter flat / house no., building name"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Street Address & Landmark *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Enter street address, area, landmark"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter 6-digit PIN code"
                      maxLength={6}
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white cursor-pointer"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Delivery Speed */}
              <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-3">
                <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest-800 text-cream-50 text-xs flex items-center justify-center font-sans">
                    3
                  </span>
                  <span>Delivery Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.deliveryMethod === 'standard'
                        ? 'border-forest-700 bg-forest-50/50 shadow-2xs'
                        : 'border-cream-300 hover:bg-cream-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard"
                      checked={formData.deliveryMethod === 'standard'}
                      onChange={handleChange}
                      className="mt-0.5 text-forest-800 focus:ring-forest-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-forest-950">Standard Delivery</p>
                      <p className="text-[11px] text-stone-500">2 - 5 business days transit</p>
                      <span className="text-xs font-semibold text-emerald-700 mt-1 block">
                        {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.deliveryMethod === 'express'
                        ? 'border-forest-700 bg-forest-50/50 shadow-2xs'
                        : 'border-cream-300 hover:bg-cream-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="express"
                      checked={formData.deliveryMethod === 'express'}
                      onChange={handleChange}
                      className="mt-0.5 text-forest-800 focus:ring-forest-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-forest-950">Priority Air Express</p>
                      <p className="text-[11px] text-stone-500">1 - 2 business days transit</p>
                      <span className="text-xs font-semibold text-forest-800 mt-1 block">
                        +₹50 Flat Surcharge
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 4: Payment Options */}
              <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-4">
                <h3 className="font-serif font-bold text-lg text-forest-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest-800 text-cream-50 text-xs flex items-center justify-center font-sans">
                    4
                  </span>
                  <span>Payment Method</span>
                </h3>

                <div className="space-y-2.5 pt-1">
                  {[
                    { id: 'upi', name: 'Instant UPI', desc: 'Google Pay, PhonePe, Paytm, BHIM QR' },
                    { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                    { id: 'netbanking', name: 'Net Banking', desc: 'All major Indian banking institutions' },
                    { id: 'razorpay', name: 'Razorpay Gateway', desc: 'Multi-option secure online checkout' },
                    { id: 'cod', name: 'Cash on Delivery (COD)', desc: 'Pay cash or UPI scan at delivery' }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-forest-800 bg-forest-50/60 shadow-2xs'
                          : 'border-cream-300 hover:bg-cream-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="text-forest-800 focus:ring-forest-600"
                        />
                        <div>
                          <p className="text-xs font-bold text-forest-950">{method.name}</p>
                          <p className="text-[10px] text-stone-500">{method.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-white px-2 py-0.5 rounded border border-cream-200">
                        Secure
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6 sticky top-28">
              <h3 className="font-serif font-bold text-xl text-forest-950 pb-3 border-b border-cream-100">
                Order Summary ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.product}-${item.size}`} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-cream-100 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-forest-950 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-stone-500">{item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-forest-950">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-stone-600 border-t border-cream-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-forest-700 font-semibold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 && expressSurcharge === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingFee + expressSurcharge)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-forest-950 pt-3 border-t border-cream-200">
                  <span>Total Amount</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Terms Acceptance */}
              <label className="flex items-start gap-2 text-[11px] text-stone-600 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 text-forest-800 rounded border-cream-300 focus:ring-forest-600"
                />
                <span>
                  I agree to the <Link to="/terms" className="underline text-forest-800">Terms of Service</Link> and <Link to="/privacy" className="underline text-forest-800">Privacy Policy</Link>.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'PROCESSING ORDER...' : `PLACE ORDER (${formatPrice(finalTotal)})`}</span>
              </button>

              <div className="text-center space-y-1">
                <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Your payment and details are encrypted and 100% safe.</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
