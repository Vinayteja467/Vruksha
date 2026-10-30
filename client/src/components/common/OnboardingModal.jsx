import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, X, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

export const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const { applyCoupon } = useCart();

  const COUPON_CODE = 'WELCOME10';

  useEffect(() => {
    const hasSeen = localStorage.getItem('vruksha_onboarding_completed');
    if (!hasSeen) {
      // Show shortly after page loads for smooth transition
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('vruksha_onboarding_completed', 'true');
    setIsOpen(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      addToast(`Coupon "${COUPON_CODE}" copied to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      addToast(`Code: ${COUPON_CODE}`, 'info');
    }
  };

  const handleApplyAndShop = () => {
    applyCoupon(COUPON_CODE);
    handleDismiss();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden text-center p-6 sm:p-8 animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-forest-50 border border-forest-100 text-forest-800 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Welcome To VRUKSHA</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl font-bold text-forest-950 mb-2">
          From Our Organic Farms Directly To Your Home
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto mb-6">
          Experience unadulterated cold pressed oils, stone-ground superfood powders, and pure forest honey with zero chemicals or preservatives.
        </p>

        {/* Features Row */}
        <div className="grid grid-cols-2 gap-2 text-left mb-6 bg-cream-50/70 p-3 rounded-2xl border border-cream-200/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest-700 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-stone-700">100% Lab Tested Purity</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-forest-700 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-stone-700">Fair Trade Indian Farmers</span>
          </div>
        </div>

        {/* Welcome Coupon Card */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 mb-6 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
            First Order Exclusive Discount
          </p>
          <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-amber-200">
            <span className="font-mono font-bold text-base tracking-widest text-forest-950">
              {COUPON_CODE}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-xs font-bold text-forest-800 hover:text-forest-900 flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-amber-800/80">Get flat 10% off on your entire natural cart</p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleApplyAndShop}
            className="btn-primary w-full py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow"
          >
            <span>Apply Coupon & Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-[11px] text-stone-400 hover:text-stone-600 hover:underline pt-1 block mx-auto"
          >
            Continue browsing without coupon
          </button>
        </div>
      </div>
    </div>
  );
};
