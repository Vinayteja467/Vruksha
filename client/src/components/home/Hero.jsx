import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100/70 via-cream-50 to-white pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative background radial leaves */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-forest-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cream-300/40 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-900 text-xs font-semibold uppercase tracking-wider"
            >
              <Leaf className="w-3.5 h-3.5 text-forest-600" />
              <span>100% Farm-Sourced Indian Products</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest-950 leading-[1.12]"
            >
              Pure ingredients for everyday living.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Discover naturally sourced fruit, vegetable and leafy products made for simple, wholesome everyday use. Gently dehydrated to protect natural colors, flavors, and plant nutrients.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-widest rounded-xl shadow-elevated hover:shadow-premium transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/category/popular-combos"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-cream-100 text-forest-950 font-bold text-xs uppercase tracking-widest rounded-xl border border-cream-300 shadow-soft transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>EXPLORE PRODUCTS</span>
              </Link>
            </motion.div>

            {/* Micro Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-xs text-stone-600 font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-600" />
                <span>Zero Preservatives</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-600" />
                <span>No Artificial Colors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-600" />
                <span>Non-GMO & Vegan</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Visual with Floating Cards (5 cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Circular/Pill Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-premium border-4 border-white bg-cream-200 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80"
                  alt="VRUKSHA Natural Products"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
                
                {/* Floating Tag inside image */}
                <div className="absolute bottom-5 left-5 right-5 text-cream-50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cream-300">Origin Story</span>
                  <p className="font-serif text-lg font-bold leading-tight">Shade-dried & cold-pulverized for optimal freshness</p>
                </div>
              </div>

              {/* Floating Element 1: Top Right Product Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-elevated border border-cream-200 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-forest-950 ml-1">4.9 / 5</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium">1,200+ Verified Buyers</p>
                </div>
              </motion.div>

              {/* Floating Element 2: Bottom Left Mini Product Card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-elevated border border-cream-200 flex items-center gap-3 z-20 max-w-[240px]"
              >
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
                  alt="Moringa Powder"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-forest-950 truncate">Moringa Powder</p>
                  <p className="text-[11px] font-semibold text-forest-700">{formatPrice(229)}</p>
                  <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    High Chlorophyll
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
