import React from 'react';
import { FAQAccordion } from '../components/home/FAQAccordion';
import { Link } from 'react-router-dom';
import { MessageCircle, HelpCircle } from 'lucide-react';

export const FAQPage = () => {
  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-forest-100 px-3 py-1 rounded-full border border-forest-200">
            Knowledge Base
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950">
            Help Center & FAQ
          </h1>
          <p className="text-sm text-stone-600 max-w-xl mx-auto">
            Everything you need to know about our sourcing, processing, storage tips, shipping policies, and wholesale inquiries.
          </p>
        </div>

        <FAQAccordion />

        {/* Additional Assistance Box */}
        <div className="bg-white rounded-3xl border border-cream-200 p-8 text-center shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-xl text-forest-950">Still have a question?</h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            If you cannot find the answer above, our wellness and customer support specialists are ready to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="px-6 py-3 bg-forest-900 text-cream-50 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest-800 transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
