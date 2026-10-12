import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

export const Hero = () => {
  const prefersReducedMotion = useReducedMotion();

  /* ── animation variants ── */
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative w-full min-h-[85svh] md:min-h-[100svh] flex items-center overflow-hidden bg-[#FAF8F5]">

      {/* ─── BACKGROUND IMAGE  (z-0) ─── */}
      <picture className="absolute inset-0 z-0 pointer-events-none select-none">
        <source media="(max-width: 767px)" srcSet="/hero-bg-mobile.webp" />
        <motion.img
          src="/hero-bg.webp"
          alt=""
          role="presentation"
          width="1920"
          height="871"
          fetchPriority="high"
          decoding="async"
          initial={prefersReducedMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-[right_center]"
        />
      </picture>

      {/* ─── READABILITY OVERLAY  (z-[1]) ─── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none
          bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/75 to-[#FAF8F5]/40
          md:bg-gradient-to-r md:from-[#FAF8F5]/95 md:via-[#FAF8F5]/70 md:to-transparent"
      />

      {/* ─── BOTTOM FADE STRIP  (z-[2]) ─── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-[120px] z-[2] pointer-events-none
          bg-gradient-to-t from-[#FAF8F5] to-transparent"
      />

      {/* ─── TEXT CONTENT  (z-10) ─── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-2xl space-y-6 md:space-y-7"
        >
          {/* 1 ▸ Eyebrow */}
          <motion.p variants={fadeUp} className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-forest-700 shrink-0" />
            <span className="uppercase text-xs tracking-[0.2em] text-forest-700 font-bold">
              Rooted in Nature. Crafted with Care.
            </span>
          </motion.p>

          {/* 2 ▸ Headline */}
          <motion.h1
            variants={fadeUp}
            style={{ fontSize: 'clamp(1.9rem, 4.5vw + 0.75rem, 4.75rem)', textWrap: 'balance' }}
            className="font-serif font-bold leading-[1.08] tracking-tight text-[#152E22]"
          >
            Pure Ingredients.{' '}
            <span className="block sm:inline">Straight From Nature.</span>
            <span className="block italic text-[#B08D4A] font-semibold mt-1">
              Made for Everyday Wellness.
            </span>
          </motion.h1>

          {/* 3 ▸ Sub-text */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-forest-900/80 max-w-xl leading-relaxed"
          >
            Real ingredients. Naturally sourced. Carefully processed. Nothing unnecessary.
          </motion.p>

          {/* 4 ▸ Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
          >
            <Link
              to="/shop"
              className="rounded-full bg-forest-600 hover:bg-forest-700 text-white font-medium
                px-8 py-4 text-sm shadow-glow
                flex items-center justify-center gap-2.5 group
                transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-500/40"
            >
              Explore Our Powders
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/category/raw-powders"
              className="rounded-full bg-white/70 hover:bg-white text-forest-900
                border border-forest-700/30 font-medium
                px-8 py-4 text-sm backdrop-blur-sm
                flex items-center justify-center gap-2
                transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-forest-500/30"
            >
              Explore Products
            </Link>
          </motion.div>

          {/* 5 ▸ Trust row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs sm:text-sm text-forest-900/80 font-medium pt-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600 shrink-0" />
            <span>Zero Preservatives</span>
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600 shrink-0 ml-2" />
            <span>No Artificial Colors</span>
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600 shrink-0 ml-2" />
            <span>Non-GMO &amp; Vegan</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
