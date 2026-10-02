import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { RatingStars } from '../common/RatingStars';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0]?.size || '100g'
  );
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const baseSize = product.sizes?.[0]?.size || '100g';
  const foundSize = product.sizes?.find((s) => s.size === selectedSize);
  const currentSizeObj = {
    size: selectedSize,
    price: (selectedSize === baseSize && product.price) ? product.price : (foundSize?.price || product.price),
    originalPrice: (selectedSize === baseSize && product.originalPrice) ? product.originalPrice : (foundSize?.originalPrice || product.originalPrice || product.price),
  };

  const discountPercent = currentSizeObj.originalPrice > currentSizeObj.price
    ? Math.round(((currentSizeObj.originalPrice - currentSizeObj.price) / currentSizeObj.originalPrice) * 100)
    : product.discount || 0;

  const isFavorited = isInWishlist(product.slug);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container with Badges */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cream-100">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount / Best Seller Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-forest-900 text-cream-50 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-stone-600 hover:bg-white hover:text-rose-600 shadow-xs'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add overlay on hover for desktop */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-forest-900/95 hover:bg-forest-900 text-cream-50 font-semibold text-xs tracking-wider uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add ({selectedSize})</span>
          </button>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-700">
              {product.category}
            </span>
            <RatingStars rating={product.rating || 4.8} reviewCount={product.reviewCount} size="sm" />
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block group-hover:text-forest-700 transition-colors">
            <h3 className="font-serif font-bold text-base sm:text-lg text-forest-950 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Size Pills */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {product.sizes.slice(0, 4).map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => setSelectedSize(s.size)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                    selectedSize === s.size
                      ? 'bg-forest-800 text-white border-forest-800 shadow-2xs'
                      : 'bg-cream-50 text-stone-600 border-cream-300 hover:border-forest-600'
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          )}

          {/* Price & Mobile Add Button */}
          <div className="flex items-center justify-between pt-2 border-t border-cream-100">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-forest-950">
                {formatPrice(currentSizeObj.price)}
              </span>
              {currentSizeObj.originalPrice > currentSizeObj.price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(currentSizeObj.originalPrice)}
                </span>
              )}
            </div>

            {/* Mobile / Direct Add Button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              className="sm:hidden p-2 bg-forest-800 text-white rounded-lg hover:bg-forest-700 shadow-sm"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
