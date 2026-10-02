import React from 'react';
import { Filter, X, RotateCcw, Search, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const ProductFilters = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  maxPrice = 2000,
  onPriceChange,
  selectedRating = 0,
  onRatingChange,
  selectedSize = '',
  onSizeChange,
  inStockOnly = false,
  onStockToggle,
  sortBy = 'featured',
  onSortChange,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const sizes = ['100g', '150g', '250g', '500g', '1kg'];

  const filterContent = (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
          Search Product
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or ingredient..."
            className="w-full text-xs p-2.5 pl-8 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-3">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-forest-800 text-white font-semibold'
                : 'text-stone-700 hover:bg-cream-100'
            }`}
          >
            <span>All Products</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug || cat.name.toLowerCase().replace(/ /g, '-'))}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug || selectedCategory === cat.name
                  ? 'bg-forest-800 text-white font-semibold'
                  : 'text-stone-700 hover:bg-cream-100'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-forest-800">
            Max Price
          </label>
          <span className="text-xs font-bold text-forest-900">{formatPrice(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="150"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-cream-300 rounded-lg appearance-none cursor-pointer accent-forest-700"
        />
        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>₹150</span>
          <span>₹2,000</span>
        </div>
      </div>

      {/* Package Size Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-2.5">
          Package Size
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSizeChange('')}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
              selectedSize === ''
                ? 'bg-forest-800 text-white border-forest-800'
                : 'bg-white text-stone-700 border-cream-300 hover:border-forest-600'
            }`}
          >
            Any
          </button>
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSizeChange(s === selectedSize ? '' : s)}
              className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                selectedSize === s
                  ? 'bg-forest-800 text-white border-forest-800'
                  : 'bg-white text-stone-700 border-cream-300 hover:border-forest-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
          Minimum Rating
        </h4>
        <div className="space-y-1">
          {[4.8, 4.5, 4.0].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRatingChange(selectedRating === r ? 0 : r)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${
                selectedRating === r
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'hover:bg-cream-100 text-stone-700'
              }`}
            >
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>{r} & above</span>
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-2 border-t border-cream-200">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockToggle(e.target.checked)}
            className="w-4 h-4 rounded text-forest-800 border-cream-300 focus:ring-forest-500 rounded"
          />
          <span className="text-xs font-medium text-stone-700 select-none">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Reset Filter Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full py-2.5 rounded-xl border border-cream-300 text-stone-600 hover:bg-cream-100 hover:text-forest-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-white p-5 rounded-2xl border border-cream-200 shadow-soft h-fit sticky top-28">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-forest-700" />
            <h3 className="font-serif font-bold text-base text-forest-950">Filters</h3>
          </div>
        </div>
        {filterContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-forest-950/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-cream-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-forest-700" />
                  <h3 className="font-serif font-bold text-base text-forest-950">Filter Products</h3>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 mt-6 border-t border-cream-200">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 bg-forest-800 text-white rounded-xl text-xs uppercase font-bold tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
