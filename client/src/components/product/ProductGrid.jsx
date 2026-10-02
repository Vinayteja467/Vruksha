import React from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles, RefreshCcw } from 'lucide-react';

export const ProductGrid = ({ products = [], loading = false, onResetFilters }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-cream-200 overflow-hidden animate-pulse">
            <div className="aspect-square bg-cream-200" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-cream-200 rounded w-1/3" />
              <div className="h-5 bg-cream-200 rounded w-3/4" />
              <div className="h-3 bg-cream-200 rounded w-full" />
              <div className="h-6 bg-cream-200 rounded w-1/2 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-16 text-center max-w-lg mx-auto shadow-soft my-6">
        <div className="w-14 h-14 rounded-full bg-cream-100 flex items-center justify-center text-forest-700 mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-earth-500" />
        </div>
        <h3 className="font-serif text-xl font-bold text-forest-950 mb-2">No matching products found</h3>
        <p className="text-sm text-stone-500 mb-6 leading-relaxed">
          We couldn't find any products matching your selected filters. Try broadening your criteria or reset the search.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  );
};
