import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const FreeShippingTracker = ({ subtotal, threshold = 499, unlocked = false }) => {
  const remaining = Math.max(0, threshold - subtotal);
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-cream-100/90 rounded-2xl p-3.5 border border-cream-200">
      <div className="flex items-center gap-2 mb-2">
        {unlocked ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        ) : (
          <Truck className="w-4 h-4 text-forest-700 flex-shrink-0" />
        )}
        <p className="text-xs font-semibold text-forest-950">
          {unlocked ? (
            <span className="text-emerald-700 font-bold">🎉 Free standard shipping unlocked!</span>
          ) : (
            <span>
              Add <strong className="text-forest-800">{formatPrice(remaining)}</strong> more to get <strong>FREE shipping</strong>
            </span>
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-cream-300 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            unlocked ? 'bg-emerald-600' : 'bg-forest-700'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
