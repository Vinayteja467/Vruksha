import React from 'react';
import { Leaf, Award, PackageCheck, Zap } from 'lucide-react';

export const TrustBar = () => {
  const points = [
    {
      icon: Leaf,
      title: 'Quality Ingredients',
      desc: '100% farm-sourced with no fillers or synthetic anti-caking agents.'
    },
    {
      icon: Award,
      title: 'Carefully Processed',
      desc: 'Low-temperature dehydration preserves vital aroma, color & enzymes.'
    },
    {
      icon: PackageCheck,
      title: 'Secure Packaging',
      desc: 'Triple-layer airtight, moisture-barrier pouches for enduring freshness.'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      desc: 'Dispatched within 24 hours across all major Indian pin codes.'
    }
  ];

  return (
    <section className="bg-white border-y border-cream-200 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-forest-950 flex items-center gap-1.5">
                    <span>✓</span>
                    <span>{pt.title}</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
