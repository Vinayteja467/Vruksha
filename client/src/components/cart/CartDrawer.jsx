import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';
import { FreeShippingTracker } from './FreeShippingTracker';

export const CartDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    closeDrawer,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingThreshold,
    freeShippingUnlocked,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/80">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-forest-800" />
                  <h2 className="font-serif font-bold text-lg text-forest-950">
                    Your Basket ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-cream-200 transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Tracker */}
              <div className="p-4 border-b border-cream-100">
                <FreeShippingTracker
                  subtotal={subtotal}
                  threshold={freeShippingThreshold}
                  unlocked={freeShippingUnlocked}
                />
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-cream-100">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-4 text-forest-700">
                      <ShoppingBag className="w-8 h-8 opacity-40" />
                    </div>
                    <p className="font-serif font-bold text-lg text-forest-950 mb-1">Your cart is empty</p>
                    <p className="text-xs text-stone-500 mb-6">Discover pure organic products for your daily routine.</p>
                    <button
                      type="button"
                      onClick={() => {
                        closeDrawer();
                        navigate('/shop');
                      }}
                      className="px-6 py-2.5 bg-forest-800 hover:bg-forest-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Shop Products
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={`${item.product}-${item.size}`} className="py-4 flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-cream-100 flex-shrink-0 border border-cream-200"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={closeDrawer}
                              className="font-serif font-bold text-sm text-forest-950 hover:text-forest-700 line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product, item.size)}
                              className="text-stone-300 hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-[11px] font-medium text-stone-500 bg-cream-100 px-2 py-0.5 rounded border border-cream-200 mt-1 inline-block">
                            {item.size}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden bg-cream-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)}
                              className="p-1 text-stone-600 hover:bg-cream-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-forest-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)}
                              className="p-1 text-stone-600 hover:bg-cream-200"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-forest-950">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            {item.originalPrice > item.price && (
                              <p className="text-[10px] text-stone-400 line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer / Order Summary */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-cream-200 bg-cream-50/90 space-y-3">
                  {/* Coupon Input */}
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-100/70 border border-forest-300 text-xs">
                      <div className="flex items-center gap-2 text-forest-900 font-semibold">
                        <Tag className="w-3.5 h-3.5 text-forest-700" />
                        <span>Code <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discountAmount)})</span>
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
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600 uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-forest-700">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">FREE</span>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-forest-950 pt-2 border-t border-cream-200">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeDrawer();
                        navigate('/cart');
                      }}
                      className="w-full py-2.5 text-center text-xs font-semibold text-stone-600 hover:text-forest-900 transition-colors"
                    >
                      View Detailed Cart Page
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
