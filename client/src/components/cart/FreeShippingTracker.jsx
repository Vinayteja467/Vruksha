import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const FreeShippingTracker = () => {
  return (
    <div className="bg-cream-100/90 rounded-2xl p-3.5 border border-cream-200">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-xs font-semibold text-forest-950">
          <span className="text-emerald-700 font-bold">🎉 Free shipping unlocked on all orders!</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-cream-300 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-600 w-full"
        />
      </div>
    </div>
  );
};
