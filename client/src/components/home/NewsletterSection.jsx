import React, { useState } from 'react';
import { Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Welcome! Your 10% discount coupon code is VRUKSHA10', 'success');
    setEmail('');
  };

  return (
    <section className="py-16 lg:py-20 bg-forest-900 text-cream-50 relative overflow-hidden">
      {/* Decorative leaf blur */}
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-forest-800/60 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-forest-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-earth-400" />
          <span>Special Welcome Offer</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Get 10% off your first order
        </h2>

        <p className="text-sm sm:text-base text-cream-200/80 max-w-xl mx-auto leading-relaxed">
          Subscribe to our botanical newsletter for exclusive seasonal harvest discounts, whole food cooking tips, and wholesome morning recipes.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto pt-2">
          <div className="relative w-full">
            <Mail className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-forest-950/80 border border-forest-700 text-white placeholder:text-stone-400 text-xs sm:text-sm pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-forest-400"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-earth-600 hover:bg-earth-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex-shrink-0 transition-all hover:shadow-lg"
          >
            GET MY DISCOUNT
          </button>
        </form>

        <p className="text-[11px] text-cream-300/60 flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-400" />
          <span>We respect your privacy. No spam, ever. Unsubscribe at any time.</span>
        </p>
      </div>
    </section>
  );
};
