import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { api } from '../api/client';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State from URL or defaults
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(sortParam);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Synchronize URL search params
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
    if (sortParam) setSortBy(sortParam);
  }, [categoryParam, searchParam, sortParam]);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await api.get('/categories');
        if (data.success) setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on all active filters
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') queryParams.append('category', selectedCategory);
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());
        if (maxPrice < 2000) queryParams.append('maxPrice', maxPrice);
        if (selectedRating > 0) queryParams.append('rating', selectedRating);
        if (inStockOnly) queryParams.append('inStock', 'true');
        if (sortBy) queryParams.append('sort', sortBy);

        const data = await api.get(`/products?${queryParams.toString()}`);
        if (data.success) {
          let list = data.products || [];
          // Client-side size filter if active
          if (selectedSize) {
            list = list.filter((p) => p.sizes?.some((s) => s.size === selectedSize));
          }
          setProducts(list);
          setTotalCount(list.length);
        }
      } catch (err) {
        console.error('Failed to load shop products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [selectedCategory, searchQuery, maxPrice, selectedRating, selectedSize, inStockOnly, sortBy]);

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMaxPrice(2000);
    setSelectedRating(0);
    setSelectedSize('');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-cream-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-cream-200 pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
                Pure Indian Produce
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-1">
                Shop All Products
              </h1>
              <p className="text-sm text-stone-600 mt-2 max-w-xl">
                100% natural, farm-sourced vegetable, fruit, and green products for culinary excellence and effortless daily nutrition.
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-xs font-bold text-forest-900 shadow-2xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-forest-700" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-cream-300 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold text-forest-950 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout with Sidebar and Grid */}
        <div className="flex items-start gap-8">
          {/* Faceted Filter Sidebar */}
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            maxPrice={maxPrice}
            onPriceChange={setMaxPrice}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            inStockOnly={inStockOnly}
            onStockToggle={setInStockOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleReset}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Main Product Grid */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4 text-xs text-stone-500 font-medium">
              <span>Showing {totalCount} products</span>
              {selectedCategory !== 'all' && (
                <span className="capitalize font-semibold text-forest-800">
                  Filtered by: {selectedCategory.replace(/-/g, ' ')}
                </span>
              )}
            </div>

            <ProductGrid
              products={products}
              loading={loading}
              onResetFilters={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
