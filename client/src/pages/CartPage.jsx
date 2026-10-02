import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { FreeShippingTracker } from '../components/cart/FreeShippingTracker';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../api/client';

export const CartPage = () => {
  const {
    cartItems,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingThreshold,
    freeShippingUnlocked,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await api.get('/products?limit=4');
        if (data.success) {
          setRecommended(data.products || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecommended();
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-cream-50/50">
        <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl border border-cream-200 shadow-soft text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-forest-700">
            <ShoppingBag className="w-8 h-8 opacity-50" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Your Cart is Empty</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Looks like you haven't added any botanical products yet. Discover our farm-sourced selections!
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-200">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest-950">Shopping Cart</h1>
            <p className="text-xs text-stone-500 mt-1">Review your pure botanical pantry selections</p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-forest-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free Shipping Banner */}
        <div className="mb-8">
          <FreeShippingTracker
            subtotal={subtotal}
            threshold={freeShippingThreshold}
            unlocked={freeShippingUnlocked}
          />
        </div>

        {/* Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Table / List (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-cream-200 p-6 shadow-soft divide-y divide-cream-100">
            {cartItems.map((item) => (
              <div
                key={`${item.product}-${item.size}`}
                className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-cream-100 border border-cream-200 flex-shrink-0"
                  />
                  <div>
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-serif font-bold text-base text-forest-950 hover:text-forest-700 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-stone-500 bg-cream-100 px-2.5 py-0.5 rounded-md border border-cream-200 font-medium">
                        Size: {item.size}
                      </span>
                      <span className="text-xs text-forest-800 font-semibold">
                        {formatPrice(item.price)} each
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-100">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-cream-300 rounded-xl overflow-hidden bg-cream-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)}
                      className="p-1.5 text-stone-600 hover:bg-cream-200 rounded-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-forest-950">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)}
                      className="p-1.5 text-stone-600 hover:bg-cream-200 rounded-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="font-serif font-bold text-base text-forest-950">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    {item.originalPrice > item.price && (
                      <p className="text-[11px] text-stone-400 line-through">
                        {formatPrice(item.originalPrice * item.quantity)}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product, item.size)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Order Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-cream-200 p-6 shadow-soft space-y-6 sticky top-28">
            <h3 className="font-serif font-bold text-xl text-forest-950 border-b border-cream-100 pb-3">
              Order Summary
            </h3>

            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-forest-100/70 border border-forest-300 text-xs">
                  <div className="flex items-center gap-2 text-forest-900 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-forest-700" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discountAmount)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-rose-600 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code (e.g. VRUKSHA10)"
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-cream-300 uppercase bg-cream-50 focus:outline-none focus:border-forest-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-cream-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-forest-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-forest-950 pt-3 border-t border-cream-200">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/shop"
                className="block text-center text-xs font-semibold text-stone-600 hover:text-forest-900 transition-colors py-1"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="pt-2 border-t border-cream-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              <span>Safe & Secure 256-Bit Encrypted Checkout</span>
            </div>
          </div>
        </div>

        {/* Recommended Add-ons */}
        {recommended.length > 0 && (
          <div className="pt-8 border-t border-cream-200">
            <h3 className="font-serif text-2xl font-bold text-forest-950 mb-6">
              Recommended for You
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id || p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
