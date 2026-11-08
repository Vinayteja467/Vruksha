import React from 'react';

export const TermsPage = () => {
  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 shadow-soft space-y-6 text-stone-700 text-sm leading-relaxed">
          <div className="border-b border-cream-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">Legal Agreement</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">Terms of Service</h1>
            <p className="text-xs text-stone-400 mt-1">Last Updated: October 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or placing an order on VRUKSHA (vruksha.in), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and applicable Indian laws and consumer regulations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">2. Product Factual Representation</h2>
            <p>
              All products sold on this website are whole botanical food ingredients and products. VRUKSHA does not make medical, pharmaceutical, or therapeutic claims. Information provided regarding dietary fiber, vitamins, or traditional culinary preparation is educational and should not replace advice from a qualified healthcare practitioner.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">3. Orders, Pricing & Taxes</h2>
            <p>
              All product prices displayed on the store are listed in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). We reserve the right to modify prices or cancel orders in cases of demonstrable typographical or system pricing errors.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">4. Intellectual Property</h2>
            <p>
              All brand assets, photography, logos, copy, and layout designs on this platform are the proprietary intellectual property of VRUKSHA Naturals Pvt. Ltd. Unauthorized replication or distribution is strictly prohibited.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
