import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please complete all required fields', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Thank you! Your message has been sent to our customer care team.', 'success');
  };

  const whatsappUrl = 'https://wa.me/919876543210?text=Hello%20VRUKSHA%20Customer%20Support%2C%20I%20have%20an%20inquiry.';

  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-forest-100 px-3 py-1 rounded-full border border-forest-200">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest-950 mt-2 mb-3">
            Contact VRUKSHA
          </h1>
          <p className="text-sm text-stone-600">
            Have questions about our products, bulk orders, or your current shipment? We’re always here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-soft">
            <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">Send us a message</h2>
            <p className="text-xs text-stone-500 mb-6">Our customer care desk typically responds within 3 hours.</p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-forest-950">Message Sent!</h3>
                <p className="text-xs text-stone-600">Thank you for reaching out. We will get back to your email shortly.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                  }}
                  className="px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Your Name *
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
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your 10-digit mobile number"
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your message or inquiry..."
                    className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Right Contact Details & Map Placeholder (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-6">
              <h3 className="font-serif font-bold text-xl text-forest-950">Direct Contacts</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-forest-950 block">Customer Support</span>
                    <a href="mailto:support@vruksha.in" className="text-stone-600 hover:text-forest-800">
                      support@vruksha.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-forest-950 block">Direct Line</span>
                    <a href="tel:+919876543210" className="text-stone-600 hover:text-forest-800">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-forest-950 block">Business Hours</span>
                    <p className="text-stone-600">Monday to Saturday: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-forest-950 block">Headquarters & Packing Facility</span>
                    <p className="text-stone-600 leading-relaxed">
                      VRUKSHA Naturals Pvt. Ltd.<br />
                      No. 42, Green Orchard Estate, Indiranagar,<br />
                      Bengaluru, Karnataka 560038, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Placeholder */}
            <div className="bg-white rounded-3xl border border-cream-200 p-3 shadow-soft overflow-hidden">
              <div className="aspect-[16/9] w-full rounded-2xl bg-cream-100 border border-cream-200 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-forest-800 text-cream-50 flex items-center justify-center mb-2 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="font-serif font-bold text-sm text-forest-950">Bengaluru Headquarters & Dispatch</p>
                <p className="text-[11px] text-stone-500">Karnataka, India • 560038</p>
                <span className="mt-2 text-[10px] font-bold text-forest-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                  Coordinates: 12.9716° N, 77.5946° E
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
