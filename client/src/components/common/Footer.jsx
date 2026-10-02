import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Heart, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Thank you for subscribing! Your 10% coupon code is VRUKSHA10', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-forest-950 text-cream-100 pt-16 pb-8 border-t border-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-forest-900">
          {/* Column 1: Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="VRUKSHA Farm To Home"
                className="w-10 h-10 rounded-full object-cover shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">
                  VRUKSHA
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-forest-300 -mt-1">
                  Farm To Home
                </span>
              </div>
            </Link>
            <p className="font-serif italic text-cream-300 text-sm">
              "Farm To Home"
            </p>
            <p className="text-sm text-cream-200/80 leading-relaxed max-w-sm">
              A premium Indian natural food brand bringing you 100% farm-sourced, gently dehydrated fruit, vegetable, and leafy products. Crafted for effortless everyday cooking, wholesome morning smoothies, and balanced living.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 flex items-center justify-center text-cream-200 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 flex items-center justify-center text-cream-200 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 flex items-center justify-center text-cream-200 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-forest-900 hover:bg-forest-800 flex items-center justify-center text-cream-200 transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest-300 mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/shop" className="hover:text-cream-50 transition-colors">All Products</Link></li>
              <li><Link to="/shop?sort=featured" className="hover:text-cream-50 transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-cream-50 transition-colors">New Arrivals</Link></li>
              <li><Link to="/category/popular-combos" className="hover:text-cream-50 transition-colors">Curated Combos</Link></li>
              <li><Link to="/#build-a-box" className="hover:text-cream-50 transition-colors">Build Your Own Box</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest-300 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/about" className="hover:text-cream-50 transition-colors">Our Story & Farms</Link></li>
              <li><Link to="/about#production-journey" className="hover:text-cream-50 transition-colors">Farm-to-Pouch Journey</Link></li>
              <li><Link to="/bulk-orders" className="hover:text-cream-50 transition-colors">B2B & Bulk Orders</Link></li>
              <li><Link to="/contact" className="hover:text-cream-50 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-cream-50 transition-colors">FAQ & Guides</Link></li>
            </ul>
          </div>

          {/* Column 4: Support & Policies */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-forest-300 mb-4">Policies</h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li><Link to="/shipping-policy" className="hover:text-cream-50 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-cream-50 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="hover:text-cream-50 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-cream-50 transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin" className="text-forest-400 hover:text-forest-300 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-b border-forest-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-serif font-bold text-cream-50">Join our wellness circle</h4>
            <p className="text-xs text-cream-200/70 mt-1">Get 10% off your first order plus farm recipe inspirations.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-forest-900 border border-forest-800 text-cream-100 placeholder:text-cream-300/40 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-forest-500 w-full"
            />
            <button
              type="submit"
              className="bg-earth-600 hover:bg-earth-500 text-white font-semibold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 transition-colors"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-300/70">
          <p>© {new Date().getFullYear()} VRUKSHA Naturals Pvt. Ltd. All rights reserved.</p>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-cream-300/50">Accepted Payments:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-forest-900 border border-forest-800 text-[10px] font-bold text-cream-200">UPI</span>
              <span className="px-2 py-0.5 rounded bg-forest-900 border border-forest-800 text-[10px] font-bold text-cream-200">Cards</span>
              <span className="px-2 py-0.5 rounded bg-forest-900 border border-forest-800 text-[10px] font-bold text-cream-200">NetBanking</span>
              <span className="px-2 py-0.5 rounded bg-forest-900 border border-forest-800 text-[10px] font-bold text-emerald-400">COD</span>
              <span className="px-2 py-0.5 rounded bg-forest-900 border border-forest-800 text-[10px] font-bold text-cream-200">Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
