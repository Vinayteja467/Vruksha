import React from 'react';
import { Sprout, Wind, ShieldCheck, FileCheck2 } from 'lucide-react';

export const WhyPureHarvest = () => {
  const pillars = [
    {
      icon: Sprout,
      title: 'Ethical Quality Sourcing',
      desc: 'We partner directly with organic family growers across Kerala, Maharashtra, and Tamil Nadu who honor clean chemical-free regenerative farming.'
    },
    {
      icon: Wind,
      title: 'Gentle Low-Temp Drying',
      desc: 'Instead of aggressive high-heat baking that destroys active enzymes, our produce is shade-dried or vacuum-dehydrated below 45°C.'
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Triple-Seal Packaging',
      desc: 'Packed in automated dust-free cleanrooms inside food-grade multi-layer pouches that shield sensitive phytonutrients against sunlight and moisture.'
    },
    {
      icon: FileCheck2,
      title: 'Radical Transparency',
      desc: 'What you see on the front of the pouch is exactly what is inside. No hidden starches, no maltodextrin, no anti-caking silica.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-cream-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Editorial Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-[4/5] bg-cream-200">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
                alt="Organic farm fields in India"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-bold uppercase tracking-widest text-cream-300">
                  Our Philosophy
                </span>
                <p className="font-serif text-xl font-bold leading-tight mt-1">
                  From Indian soil to your home with unmatched integrity.
                </p>
              </div>
            </div>

            {/* Overlapping stat pill */}
            <div className="absolute -bottom-6 -right-6 bg-forest-900 text-cream-50 p-5 rounded-2xl shadow-premium max-w-[200px] hidden sm:block border border-forest-700">
              <p className="text-2xl font-bold font-serif">100%</p>
              <p className="text-xs text-cream-200 mt-0.5">Single-origin, additive-free botanical products</p>
            </div>
          </div>

          {/* Right Editorial Copy */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
                The VRUKSHA Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 mt-2 mb-4 leading-tight">
                Simple ingredients. Thoughtfully prepared.
              </h2>
              <p className="text-base text-stone-600 leading-relaxed font-normal">
                Modern convenience shouldn’t mean compromising on pure nourishment. We take fresh, sun-blessed Indian harvest and dehydrate it with scientific precision so you can enjoy pure vegetables, greens, and fruits in seconds without prep or food waste.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft">
                    <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-forest-950 mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
