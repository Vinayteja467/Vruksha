import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import { formatPrice } from '../../utils/formatters';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const popularSearches = ['Beetroot', 'Moringa', 'Amla', 'Ginger', 'Green Banana', 'Curry Leaf'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.get(`/products?search=${encodeURIComponent(query.trim())}&limit=6`);
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-premium border border-cream-200 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-cream-200 px-4 py-3 sm:py-4">
              <Search className="w-5 h-5 text-forest-700 ml-2 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search natural products (e.g., Beetroot, Moringa, Amla)..."
                className="w-full bg-transparent text-forest-950 placeholder:text-stone-400 font-medium text-base sm:text-lg focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-stone-400 hover:text-stone-600 mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-forest-800 px-2 py-1 bg-stone-100 rounded-md"
              >
                ESC
              </button>
            </form>

            {/* Suggestions & Results Content */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-cream-100">
              {!query.trim() && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-700 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-earth-500" />
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-cream-100 text-forest-800 hover:bg-forest-100 hover:text-forest-900 border border-cream-300 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="py-8 text-center text-stone-500 text-sm">
                  Searching natural products...
                </div>
              )}

              {!loading && query.trim() && results.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-forest-900 font-medium mb-1">No products found for "{query}"</p>
                  <p className="text-xs text-stone-500">Try searching for ingredients like "beetroot", "moringa", or "vegetable"</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Products ({results.length})
                  </div>
                  {results.map((product) => (
                    <div
                      key={product.id || product.slug}
                      onClick={() => handleSelect(product.slug)}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-cream-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-cream-200"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-forest-950 group-hover:text-forest-700 transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-xs text-forest-600 font-medium">
                            {product.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-forest-900">
                          {formatPrice(product.price)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-forest-700 hover:text-forest-900 underline"
                    >
                      View all results for "{query}" →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
