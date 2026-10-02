import React from 'react';
import { MousePointerClick, CreditCard, PackageCheck, Smile } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Select your products',
      desc: 'Browse single products or build a custom wellness box with your everyday essentials.',
      icon: MousePointerClick
    },
    {
      num: '02',
      title: 'Place your order',
      desc: 'Secure checkout with zero friction via UPI, Cards, Net Banking, or Cash on Delivery.',
      icon: CreditCard
    },
    {
      num: '03',
      title: 'We carefully pack it',
      desc: 'Hygienically sealed in multi-layer protective pouches and dispatched within 24 hours.',
      icon: PackageCheck
    },
    {
      num: '04',
      title: 'Enjoy it at home',
      desc: 'Elevate your daily cooking, teas, rotis, and morning smoothies with pure farm flavors.',
      icon: Smile
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
            Simple & Transparent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Enjoying 100% natural, farm-fresh Indian produce in pure plant simplicity takes just four easy steps.
          </p>
        </div>

        {/* Timeline (Horizontal on desktop, vertical on mobile) */}
        <div className="relative">
          {/* Desktop horizontal connector line */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-cream-200 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-cream-50 rounded-2xl p-6 border border-cream-200 shadow-soft hover:shadow-elevated transition-all flex flex-col items-center text-center group"
                >
                  {/* Step Badge */}
                  <span className="text-[11px] font-bold uppercase tracking-widest text-forest-600 bg-white px-3 py-1 rounded-full border border-cream-200 mb-4 shadow-2xs">
                    Step {step.num}
                  </span>

                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-forest-800 text-cream-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-serif font-bold text-lg text-forest-950 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
