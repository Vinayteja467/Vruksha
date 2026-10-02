import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { api } from '../api/client';

export const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        const [prodData, catData] = await Promise.all([
          api.get(`/products?category=${category}`),
          api.get('/categories')
        ]);

        if (prodData.success) {
          setProducts(prodData.products || []);
        }

        if (catData.success) {
          const current = (catData.categories || []).find(
            (c) => c.slug === category || c.id === category
          );
          setCategoryInfo(current);
        }
      } catch (err) {
        console.error('Error fetching category page', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [category]);

  const displayName = categoryInfo?.name || category?.replace(/-/g, ' ');

  return (
    <div className="bg-cream-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-500 hover:text-forest-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </Link>

        {/* Category Header Banner */}
        <div className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 mb-10 shadow-soft relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Botanical Category
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 capitalize mt-2 mb-3">
              {displayName}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {categoryInfo?.description ||
                `Explore our pure, sun-dried range of 100% natural ${displayName} crafted without artificial additives.`}
            </p>
          </div>

          {categoryInfo?.image && (
            <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:block opacity-20 pointer-events-none">
              <img
                src={categoryInfo.image}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>Found {products.length} products in this category</span>
        </div>

        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
};
