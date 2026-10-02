import React from 'react';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-forest-950 text-cream-100 text-xs font-medium py-2 px-4 border-b border-forest-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-forest-400" />
          <span>Free shipping on orders above ₹499</span>
        </div>
        <span className="hidden sm:inline text-forest-700">•</span>
        <div className="hidden sm:flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-400" />
          <span>100% Pure & Lab Tested</span>
        </div>
        <span className="hidden md:inline text-forest-700">•</span>
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-earth-400" />
          <span>Use code <strong>VRUKSHA10</strong> for 10% off</span>
        </div>
      </div>
    </div>
  );
};
