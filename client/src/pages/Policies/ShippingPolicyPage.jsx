import React from 'react';

export const ShippingPolicyPage = () => {
  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 shadow-soft space-y-6 text-stone-700 text-sm leading-relaxed">
          <div className="border-b border-cream-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">Fulfillment & Delivery</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">Shipping Policy</h1>
            <p className="text-xs text-stone-400 mt-1">Reliable Pan-India Delivery</p>
          </div>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">1. Dispatch Timeline</h2>
            <p>
              All orders placed before 2:00 PM IST on business days are processed and handed over to our express logistics partners within 24 hours. Orders placed on Sundays or public holidays are dispatched on the immediate next business day.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">2. Shipping Charges & Free Shipping</h2>
            <p>
              • <strong>Free Shipping:</strong> Automatically applied to all standard domestic retail orders with a subtotal of ₹499 and above.
            </p>
            <p>
              • <strong>Standard Shipping:</strong> A flat ₹49 nominal shipping fee is charged for retail orders below ₹499.
            </p>
            <p>
              • <strong>Priority Express Delivery:</strong> Optional 1-2 day air transit is available for an additional ₹50 surcharge.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">3. Estimated Transit Times</h2>
            <p>
              • Tier 1 Metros (Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, Kolkata, Pune): 2 to 4 business days.
            </p>
            <p>
              • Tier 2 & Regional Towns: 4 to 7 business days.
            </p>
            <p>
              • North-East & Island Territories: 5 to 8 business days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-lg text-forest-950">4. Tracking Your Parcel</h2>
            <p>
              Upon dispatch, a direct tracking link and courier AWB number are automatically sent via SMS and email. You can also view live delivery progress anytime inside the <a href="/orders" className="text-forest-800 font-bold underline">My Orders</a> dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
