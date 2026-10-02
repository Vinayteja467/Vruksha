import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What are natural food products?',
      a: 'Natural food products are whole fruits, vegetables, and botanical leaves that have been harvested fresh, cleansed, gently dehydrated at low temperatures, and finely pulverized. They contain 100% pure produce with zero artificial additives, preservatives, or chemical flowing agents.'
    },
    {
      q: 'How should products be stored?',
      a: 'Keep your products sealed tightly in their original moisture-barrier pouch or transfer them into an airtight, dry glass container. Store in a cool, dark pantry away from direct heat and sunlight. Always ensure your scoop or spoon is completely dry before dipping in.'
    },
    {
      q: 'How long do products last?',
      a: 'Our unopened products possess a natural shelf life of 12 months from manufacturing date when stored correctly in a cool, dry place. Once unsealed, we recommend consuming within 4 to 6 months for maximum aroma and taste freshness.'
    },
    {
      q: 'Do you offer bulk orders?',
      a: 'Yes! We actively serve bakeries, cafes, food manufacturers, smoothie bars, and private-label wellness brands. Bulk quantities are available in 1 KG, 5 KG, 10 KG, and 25 KG multi-ply kraft drums. Visit our Bulk Orders page to submit an inquiry.'
    },
    {
      q: 'What payment methods are available?',
      a: 'We support all major payment methods including Instant UPI (Google Pay, PhonePe, Paytm, BHIM), Credit and Debit Cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ Indian banks, and secure online processing via Razorpay.'
    },
    {
      q: 'Do you offer COD?',
      a: 'Yes, Cash on Delivery (COD) is available on all standard retail orders across serviceable pin codes in India.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Orders are dispatched within 24 hours from our certified fulfillment center. Typical delivery timelines are 2 to 4 business days for metropolitan cities and 4 to 7 business days for regional locations.'
    },
    {
      q: 'Can I return an order?',
      a: 'Because our products are consumable food items, we cannot accept returns once packaging has been opened. However, if your shipment arrives damaged, unsealed, or incorrect, reach out to us within 48 hours and we will happily dispatch an instant replacement or full refund.'
    }
  ];

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="py-16 lg:py-24 bg-cream-50 border-b border-cream-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-700 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-600">
            Everything you need to know about our natural products, storage, ordering, and delivery.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base sm:text-lg text-forest-950 hover:text-forest-700 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-forest-600 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-cream-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
