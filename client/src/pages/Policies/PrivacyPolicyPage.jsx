import React from 'react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 shadow-soft space-y-6 text-stone-700 text-sm leading-relaxed">
          <div className="border-b border-cream-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">Legal & Transparency</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">Privacy Policy</h1>
            <p className="text-xs text-stone-400 mt-1">Effective Date: October 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">1. Information We Collect</h2>
            <p>
              When you purchase products, create an account, or contact VRUKSHA, we collect necessary personal details such as your name, billing and shipping address, email address, phone number, and transaction records. Payment credentials such as credit card numbers or UPI handles are processed directly through secure PCI-DSS compliant gateways (such as Razorpay) and are never stored on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>To process, pack, and deliver your natural product orders.</li>
              <li>To send order status updates, delivery OTPs, and transit notifications via SMS and email.</li>
              <li>To provide responsive customer service and address replacement or refund requests.</li>
              <li>To improve our farm supply chain, inventory forecasts, and product offerings.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">3. Data Sharing & Security</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We share your data only with trusted fulfillment partners (such as logistics couriers and payment gateways) strictly for order completion. All data is encrypted during transmission using industry-standard TLS/SSL protocols.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">4. Contact Our Data Protection Officer</h2>
            <p>
              If you have any questions or wish to delete your account data, please email us at <a href="mailto:privacy@vruksha.in" className="text-forest-800 font-bold underline">privacy@vruksha.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
