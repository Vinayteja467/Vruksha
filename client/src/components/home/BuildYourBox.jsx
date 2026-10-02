import React, { useState, useMemo } from 'react';
import { Package, Plus, Minus, Check, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const BuildYourBox = ({ products = [] }) => {
  const [selectedItems, setSelectedItems] = useState({}); // { [productId]: quantity }
  const { addBundleToCart } = useCart();

  const availableProducts = products.length > 0 ? products.slice(0, 8) : [];

  const handleToggle = (prodId) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[prodId]) {
        delete next[prodId];
      } else {
        next[prodId] = 1;
      }
      return next;
    });
  };

  const handleQtyChange = (prodId, delta) => {
    setSelectedItems((prev) => {
      const next = { ...prev };
      const current = next[prodId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        delete next[prodId];
      } else {
        next[prodId] = updated;
      }
      return next;
    });
  };

  const totalSelectedCount = useMemo(() => {
    return Object.values(selectedItems).reduce((sum, q) => sum + q, 0);
  }, [selectedItems]);

  const rawSubtotal = useMemo(() => {
    return Object.entries(selectedItems).reduce((sum, [id, qty]) => {
      const p = availableProducts.find((item) => (item.id || item.slug) === id);
      return sum + (p ? p.price * qty : 0);
    }, 0);
  }, [selectedItems, availableProducts]);

  // Dynamic Tiered Bundle Discount
  const discountPercent = totalSelectedCount >= 5 ? 20 : totalSelectedCount === 4 ? 15 : totalSelectedCount >= 3 ? 10 : 0;
  const savings = Math.round((rawSubtotal * discountPercent) / 100);
  const bundlePrice = Math.max(0, rawSubtotal - savings);

  const handleBuildBox = () => {
    if (totalSelectedCount < 3) return;

    const bundleList = Object.entries(selectedItems).map(([id, qty]) => {
      const p = availableProducts.find((item) => (item.id || item.slug) === id);
      return {
        product: p.id || p.slug,
        name: p.name,
        slug: p.slug,
        size: '100g',
        price: p.price,
        quantity: qty
      };
    });

    addBundleToCart(bundleList, `Custom VRUKSHA Box (${totalSelectedCount} Products)`, bundlePrice);
    setSelectedItems({});
  };

  return (
    <section id="build-a-box" className="py-16 lg:py-24 bg-forest-950 text-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-forest-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-earth-400" />
            <span>Interactive Custom Bundle</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Build Your Own Box
          </h2>
          <p className="text-sm sm:text-base text-cream-200/80">
            Choose your favorite products and create your own combination. Pick 3 or more products to unlock progressive bundle discounts up to 20% OFF!
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Product Selection Grid (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {availableProducts.map((p) => {
                const id = p.id || p.slug;
                const isSelected = !!selectedItems[id];
                const qty = selectedItems[id] || 0;

                return (
                  <div
                    key={id}
                    onClick={() => handleToggle(id)}
                    className={`relative rounded-2xl p-3 border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-forest-900 border-forest-500 shadow-md ring-2 ring-forest-400'
                        : 'bg-forest-900/40 border-forest-800/80 hover:bg-forest-900 hover:border-forest-700'
                    }`}
                  >
                    <div>
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2.5 bg-forest-950">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-forest-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-cream-300/70">{p.category}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-forest-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-cream-100">
                        {formatPrice(p.price)}
                      </span>

                      {isSelected ? (
                        <div
                          className="flex items-center gap-1.5 bg-forest-800 rounded-lg p-0.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleQtyChange(id, -1)}
                            className="p-1 text-cream-200 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[11px] font-bold text-white px-1">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(id, 1)}
                            className="p-1 text-cream-200 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-6 h-6 rounded-full bg-forest-800 hover:bg-forest-700 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Custom Box Summary & Tray (4 cols) */}
          <div className="lg:col-span-4 bg-forest-900 rounded-3xl p-6 border border-forest-800 shadow-premium sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-forest-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-forest-400" />
                <h3 className="font-serif font-bold text-lg text-white">Your Custom Box</h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                totalSelectedCount >= 3 ? 'bg-forest-700 text-forest-200' : 'bg-forest-950 text-stone-400'
              }`}>
                {totalSelectedCount} of 3 min.
              </span>
            </div>

            {/* Discount Badge Bar */}
            <div className="bg-forest-950 p-3 rounded-2xl border border-forest-800/80 text-xs">
              <div className="flex justify-between items-center text-cream-200 mb-1.5">
                <span>Bundle Discount Status:</span>
                <span className="font-bold text-forest-300">
                  {discountPercent > 0 ? `${discountPercent}% OFF Unlocked!` : 'Select 3 to get 10% off'}
                </span>
              </div>
              <div className="w-full bg-forest-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-earth-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (totalSelectedCount / 5) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-cream-300/60 mt-1.5">
                3 items = 10% off • 4 items = 15% off • 5+ items = 20% off
              </p>
            </div>

            {/* Selected Items Tray List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {totalSelectedCount === 0 ? (
                <p className="text-xs text-cream-300/50 py-6 text-center italic">
                  Tap any product from the left to begin filling your box.
                </p>
              ) : (
                Object.entries(selectedItems).map(([id, qty]) => {
                  const p = availableProducts.find((item) => (item.id || item.slug) === id);
                  if (!p) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-forest-800/50"
                    >
                      <span className="text-cream-100 font-medium truncate max-w-[160px]">
                        {p.name} <span className="text-stone-400">(x{qty})</span>
                      </span>
                      <span className="font-bold text-white">{formatPrice(p.price * qty)}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Calculation Totals */}
            <div className="space-y-2 pt-2 border-t border-forest-800 text-xs text-cream-200">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Bundle Savings ({discountPercent}%)</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-forest-800">
                <span>Bundle Total</span>
                <span>{formatPrice(bundlePrice)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              disabled={totalSelectedCount < 3}
              onClick={handleBuildBox}
              className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md ${
                totalSelectedCount >= 3
                  ? 'bg-earth-600 hover:bg-earth-500 text-white cursor-pointer hover:shadow-lg'
                  : 'bg-forest-800 text-stone-500 cursor-not-allowed opacity-60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {totalSelectedCount < 3
                  ? `Select ${3 - totalSelectedCount} More to Build Box`
                  : 'BUILD MY BOX'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
