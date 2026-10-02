import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MessageCircle, ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';

export const BulkPromo = () => {
  const sizes = ['1 KG', '5 KG', '10 KG', '25 KG'];
  const targets = [
    'Cafes & Juice Bars',
    'Bakeries & Patisseries',
    'FMCG Food Brands',
    'Health Food Retailers',
    'Contract Manufacturers',
    'Private-Label Businesses'
  ];

  const whatsappUrl = 'https://wa.me/919876543210?text=Hello%20VRUKSHA%20Team%2C%20I%20am%20interested%20in%20bulk%20and%20wholesale%20product%20orders.';

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-cream-100/90 via-cream-50 to-cream-100/60 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-950 text-cream-100 rounded-3xl p-8 sm:p-12 lg:p-16 border border-forest-900 shadow-premium overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-forest-800/30 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-forest-300 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>B2B Wholesale & Supply</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Need larger quantities?
              </h2>

              <p className="text-sm sm:text-base text-cream-200/80 max-w-xl leading-relaxed">
                We supply laboratory-tested, single-origin fruit, vegetable, and leafy products in industrial wholesale quantities with custom packaging, full COA certifications, and consistent harvest batches.
              </p>

              {/* Target Business Tags */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-400 block mb-2.5">
                  Trusted Partner for:
                </span>
                <div className="flex flex-wrap gap-2">
                  {targets.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs bg-forest-900 border border-forest-800 text-cream-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/bulk-orders"
                  className="w-full sm:w-auto px-7 py-4 bg-earth-600 hover:bg-earth-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group"
                >
                  <span>REQUEST BULK QUOTE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-7 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>CHAT ON WHATSAPP</span>
                </a>
              </div>
            </div>

            {/* Right Packaging Sizes Showcase (5 cols) */}
            <div className="lg:col-span-5 bg-forest-900/90 rounded-2xl p-6 sm:p-8 border border-forest-800">
              <div className="flex items-center gap-2.5 mb-6">
                <PackageCheck className="w-5 h-5 text-forest-400" />
                <h3 className="font-serif font-bold text-lg text-white">Commercial Packaging Sizes</h3>
              </div>

              <div className="grid grid-cols-2 gap-3.5 mb-6">
                {sizes.map((sz, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-forest-950 border border-forest-800 text-center"
                  >
                    <span className="block font-serif text-2xl font-bold text-white mb-0.5">
                      {sz}
                    </span>
                    <span className="text-[10px] text-cream-300/70 uppercase tracking-wider">
                      Poly-Lined Kraft
                    </span>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 text-xs text-cream-200/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Complete Batch Lab COA & Microbiological reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>White-label and private packaging support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Pan-India B2B freight and GST invoicing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
