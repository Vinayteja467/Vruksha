import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export const BestSellers = ({ products = [] }) => {
  const bestSellersList = products.filter((p) => p.bestSeller).slice(0, 6);
  const displayList = bestSellersList.length > 0 ? bestSellersList : products.slice(0, 6);

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
              <Flame className="w-4 h-4 fill-current" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              Best Selling Products
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              Our most celebrated pure products, trusted daily by thousands of Indian households for breakfast bowls, gravies, and herbal teas.
            </p>
          </div>

          <Link
            to="/shop?sort=featured"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-forest-600 transition-colors group"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {displayList.map((product) => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
