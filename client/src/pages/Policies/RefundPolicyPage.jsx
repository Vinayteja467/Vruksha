import React from 'react';

export const RefundPolicyPage = () => {
  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 shadow-soft space-y-6 text-stone-700 text-sm leading-relaxed">
          <div className="border-b border-cream-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">Customer Assurance</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">Refund & Return Policy</h1>
            <p className="text-xs text-stone-400 mt-1">Hassle-Free Resolution Guarantee</p>
          </div>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">1. Consumable Goods Return Guidelines</h2>
            <p>
              Due to strict food hygiene and safety standards mandated by FSSAI for dehydrated and consumable goods, we cannot accept returns once the tamper-evident security seal on a product pouch has been opened or unzipped.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">2. Damaged, Defective or Incorrect Shipments</h2>
            <p>
              If your shipment arrives in any of the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Pouch is torn, punctured, or compromised during courier transit.</li>
              <li>Incorrect product variant or missing package.</li>
              <li>Product defect or unusual packaging condition upon arrival.</li>
            </ul>
            <p className="pt-1">
              Please take a photograph of the outer package and damaged pouch, and contact our care team at <a href="mailto:support@vruksha.in" className="text-forest-800 font-bold underline">support@vruksha.in</a> or WhatsApp (+91 98765 43210) within <strong>48 hours of delivery</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">3. Resolution & Refund Timelines</h2>
            <p>
              Upon verification, we will offer you an <strong>instant priority replacement</strong> or a <strong>full refund</strong> to your original payment method. Online payment refunds (UPI, Debit/Credit Card, Net Banking) typically reflect within 3 to 5 business days depending on your bank. For COD orders, refunds are issued via instant UPI transfer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
