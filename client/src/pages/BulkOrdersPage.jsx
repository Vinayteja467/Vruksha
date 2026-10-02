import React, { useState } from 'react';
import { Building2, MessageCircle, Send, CheckCircle2, ShieldCheck, Package, Layers, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const BulkOrdersPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: 'Beetroot Powder',
    requiredQuantity: '25 KG',
    packagingPreference: '25 KG Kraft Drum with Double Poly Liner',
    location: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const productsList = [
    'Pure Beetroot Powder',
    'Organic Moringa Leaf Powder',
    'Wild Amla Powder',
    'Sun-Dried Ginger Powder',
    'Raw Green Banana Powder',
    'Sweet Carrot Powder',
    'Tender Spinach Powder',
    'Zesty Lemon Powder',
    'Curry Leaf Powder',
    'Creamy Coconut Powder',
    'Sun-Ripened Tomato Powder',
    'Sweet Potato Powder',
    'Custom Blend / Multiple Products'
  ];

  const quantityOptions = ['5 KG', '10 KG', '25 KG', '50 KG+', 'Custom Quantity (100KG+)'];
  const packagingOptions = [
    '5 KG Heavy-Duty Zip Bags',
    '10 KG Food-Grade Pails',
    '25 KG Kraft Drum with Double Poly Liner',
    'White-Label Stand-up Retail Pouches',
    'Custom OEM Printing'
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello VRUKSHA B2B Team, I am inquiring about wholesale pricing for ${formData.product} (Quantity: ${formData.requiredQuantity}). Company: ${formData.company || 'Direct Inquiry'}.`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/bulk-orders', formData);
      if (res.success) {
        addToast('Bulk quote request submitted! Our corporate sales manager will reach out within 2 hours.', 'success');
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          product: 'Beetroot Powder',
          requiredQuantity: '25 KG',
          packagingPreference: '25 KG Kraft Drum with Double Poly Liner',
          location: '',
          message: ''
        });
      }
    } catch (err) {
      addToast(err.data?.message || 'Failed to submit quote request. Please reach out via WhatsApp.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-forest-200">
            <Building2 className="w-3.5 h-3.5 text-forest-600" />
            <span>Industrial & Corporate Supply</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950 mb-4">
            Natural products for your business.
          </h1>
          <p className="text-base text-stone-600 leading-relaxed font-normal">
            Whether you operate an artisan bakery, cafe chain, FMCG food brand, or private-label wellness label, VRUKSHA provides reliable farm supply, laboratory certifications, and custom packaging.
          </p>
        </div>

        {/* Pillars / Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {[
            { title: 'Bulk Supply', desc: 'Direct from origin in 5kg to 500kg monthly volume tiers.' },
            { title: 'Private Label', desc: 'Finished retail-ready pouches branded with your corporate logo.' },
            { title: 'White Label', desc: 'Unlabeled sterile master cartons ready for your in-house packaging.' },
            { title: 'Custom Packaging', desc: 'Nitrogen-flushed foil pouches, PET jars, or drums.' },
            { title: 'Consistent Sourcing', desc: 'Uniform color, mesh size, and microbiological compliance guaranteed.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-cream-200 shadow-soft text-center">
              <span className="w-8 h-8 rounded-full bg-forest-50 text-forest-800 font-serif font-bold text-xs flex items-center justify-center mx-auto mb-3">
                0{idx + 1}
              </span>
              <h3 className="font-serif font-bold text-base text-forest-950 mb-1">{item.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Form & Contact Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-soft">
            <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">Request Wholesale Quote</h2>
            <p className="text-xs text-stone-500 mb-6">Complete the specifications below for tier pricing and sample packets.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Company / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Enter company or brand name"
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter corporate email address"
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter 10-digit mobile or WhatsApp number"
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Product of Interest *
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600 cursor-pointer"
                  >
                    {productsList.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Required Quantity *
                  </label>
                  <select
                    value={formData.requiredQuantity}
                    onChange={(e) => setFormData({ ...formData, requiredQuantity: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600 cursor-pointer"
                  >
                    {quantityOptions.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Packaging Preference
                  </label>
                  <select
                    value={formData.packagingPreference}
                    onChange={(e) => setFormData({ ...formData, packagingPreference: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600 cursor-pointer"
                  >
                    {packagingOptions.map((pkg) => (
                      <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Delivery Location / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter delivery city & state"
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                  Additional Details & Mesh Size Requirements
                </label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Specify intended recipe application, target mesh fineness, or certifications needed (FSSAI, Organic, Halal, etc.)..."
                  className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'SUBMITTING...' : 'REQUEST QUOTE'}</span>
                </button>

                <a
                  href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>CHAT ON WHATSAPP</span>
                </a>
              </div>
            </form>
          </div>

          {/* Right Highlights & FAQ (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-forest-950 text-cream-100 rounded-3xl p-6 sm:p-8 border border-forest-900 shadow-premium space-y-6">
              <h3 className="font-serif font-bold text-xl text-white">Commercial Assurance</h3>
              <ul className="space-y-4 text-xs text-cream-200/90 leading-relaxed">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Full Lab COA:</strong> Every batch is tested for heavy metals, moisture percentage, and microbial purity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Sample Kits:</strong> We supply 100g complimentary evaluation samples to verified manufacturing companies.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>GST Compliance:</strong> Official B2B invoices with input tax credit support across India.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Contract Volume Lock:</strong> Annual contract agreements with stabilized crop harvest pricing.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-soft space-y-3 text-xs text-stone-600">
              <h4 className="font-serif font-bold text-base text-forest-950">Corporate Sales Desk</h4>
              <p>Email: <a href="mailto:bulk@vruksha.in" className="text-forest-800 font-bold underline">bulk@vruksha.in</a></p>
              <p>Direct B2B Hotline: <a href="tel:+919876543210" className="text-forest-800 font-bold">+91 98765 43210</a></p>
              <p className="text-[11px] text-stone-400">Desk Hours: Mon - Sat, 9:00 AM - 7:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
