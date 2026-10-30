import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Sprout, ArrowRight } from 'lucide-react';

export const NotFoundPage = () => {
  const quickCategories = [
    { name: 'Cold Pressed Oils', path: '/category/cold-pressed-oils' },
    { name: 'Superfood Powders', path: '/category/superfood-powders' },
    { name: 'Raw Honey & Sweeteners', path: '/category/raw-honey-and-sweeteners' },
    { name: 'Organic Millets', path: '/category/organic-millets' }
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-cream-50/50">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-forest-100/70 border border-forest-200 flex items-center justify-center mx-auto text-forest-800 shadow-sm animate-bounce-subtle">
            <Sprout className="w-12 h-12" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-forest-900 text-amber-300 font-mono font-bold text-xs px-2.5 py-1 rounded-full border-2 border-white shadow-xs">
            404
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-forest-700 bg-forest-100/80 px-3 py-1 rounded-full">
            Page Not Found
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2">
            Lost In The Harvest?
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
            The page you are looking for may have sprouted elsewhere, had its name changed, or returned to nature.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="btn-primary w-full sm:w-auto py-3 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow"
          >
            <Home className="w-4 h-4" />
            <span>Return To Home</span>
          </Link>
          <Link
            to="/shop"
            className="btn-secondary w-full sm:w-auto py-3 px-6 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore All Products</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-cream-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-forest-900 mb-3">
            Popular Farm Collections
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickCategories.map((c) => (
              <Link
                key={c.path}
                to={c.path}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-cream-300 text-stone-700 hover:border-forest-600 hover:text-forest-800 transition flex items-center gap-1.5"
              >
                <span>{c.name}</span>
                <ArrowRight className="w-3 h-3 text-stone-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
