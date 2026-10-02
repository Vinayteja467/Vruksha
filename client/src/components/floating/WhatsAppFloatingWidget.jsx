import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingWidget = ({ productName = '', productSlug = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const location = useLocation();

  const isBulkPage = location.pathname.includes('/bulk-orders');
  const isProductPage = location.pathname.includes('/product/');

  const defaultNumber = '919876543210'; // WhatsApp number

  const buildUrl = (text) => {
    return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(text)}`;
  };

  const getDefaultMessage = () => {
    if (isBulkPage) {
      return 'Hello VRUKSHA team, I am interested in wholesale/bulk order pricing for your natural products.';
    }
    if (isProductPage && productName) {
      return `Hello VRUKSHA team, I have a question regarding ${productName}.`;
    }
    return 'Hello VRUKSHA team, I would like to know more about your natural food products.';
  };

  const handleSend = (e) => {
    e.preventDefault();
    const finalMsg = customMsg.trim() || getDefaultMessage();
    window.open(buildUrl(finalMsg), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-premium border border-cream-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Chat with VRUKSHA</p>
                <p className="text-[11px] text-emerald-100">Typically replies in 15 mins</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
              aria-label="Close chat popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-cream-50">
            <div className="bg-white p-3 rounded-xl border border-cream-200 text-xs text-stone-700 mb-3 shadow-xs">
              🌿 {getDefaultMessage()}
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your message..."
                className="w-full text-xs p-2.5 rounded-lg border border-cream-300 focus:outline-none focus:border-emerald-600 bg-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Start WhatsApp Chat</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-elevated hover:shadow-premium transition-all duration-300 hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          {isBulkPage ? 'Bulk Pricing Chat' : isProductPage ? 'Ask about Product' : 'Chat with Us'}
        </span>
      </button>
    </div>
  );
};
