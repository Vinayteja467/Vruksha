import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export const ProductSpotlight = ({ product }) => {
  const spotlightProd = product || {
    id: 'prod-001',
    name: 'Pure Beetroot Powder',
    slug: 'beetroot-powder',
    category: 'Vegetable Products',
    price: 249,
    originalPrice: 299,
    discount: 17,
    rating: 4.9,
    reviewCount: 248,
    images: ['https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80'],
    sizes: [
      { size: '100g', price: 249, originalPrice: 299 },
      { size: '250g', price: 499, originalPrice: 649 },
      { size: '500g', price: 899, originalPrice: 1199 },
    ],
    benefits: [
      'Rich natural dietary nitrates for daily cardiovascular wellness',
      'Intense ruby food color for healthy baking and pink lattes',
      'High in plant dietary fiber and potassium',
      'No added sugars, anti-caking agents, or artificial colors'
    ],
    usage: 'Whisk 1 teaspoon into warm water, morning smoothies, fresh citrus juices, pancake batter, or pink velvet frostings.'
  };

  const [selectedSize, setSelectedSize] = useState('250g');
  const { addToCart } = useCart();

  const currentSizeObj = spotlightProd.sizes?.find((s) => s.size === selectedSize) || {
    size: selectedSize,
    price: spotlightProd.price,
    originalPrice: spotlightProd.originalPrice,
  };

  const handleAdd = () => {
    addToCart(spotlightProd, selectedSize, 1);
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-cream-100/90 via-cream-50 to-white rounded-3xl border border-cream-200 p-6 sm:p-10 lg:p-16 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Product Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-white border border-cream-200 aspect-square">
                <img
                  src={spotlightProd.images?.[0]}
                  alt={spotlightProd.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-forest-900 text-cream-50 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Product Spotlight
                </div>
              </div>
            </div>

            {/* Right: Info, Benefits & Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-forest-900">
                    {spotlightProd.rating} / 5 ({spotlightProd.reviewCount} reviews)
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-forest-700">
                    {spotlightProd.category}
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mb-3">
                  {spotlightProd.name}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Cold-milled from deep red Indian beets. Celebrated for its natural dietary nitrates, brilliant natural pigment, and gentle earthy sweetness that effortlessly enriches everyday family meals.
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-3">
                  Key Botanical Highlights
                </h4>
                <div className="space-y-2">
                  {spotlightProd.benefits?.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Uses */}
              <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-cream-200 text-xs text-stone-600">
                <strong className="text-forest-950 block mb-1">Suggested Everyday Uses:</strong>
                {spotlightProd.usage}
              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
                  Select Size
                </label>
                <div className="flex items-center gap-2">
                  {spotlightProd.sizes?.map((s) => (
                    <button
                      key={s.size}
                      type="button"
                      onClick={() => setSelectedSize(s.size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === s.size
                          ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                          : 'bg-white text-stone-700 border-cream-300 hover:border-forest-700'
                      }`}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing & CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl sm:text-3xl font-bold text-forest-950 font-serif">
                      {formatPrice(currentSizeObj.price)}
                    </span>
                    {currentSizeObj.originalPrice > currentSizeObj.price && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatPrice(currentSizeObj.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Inclusive of all taxes • Ready to dispatch
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="flex-1 sm:flex-initial px-6 py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/product/${spotlightProd.slug}`}
                    className="px-4 py-3.5 bg-white hover:bg-cream-100 text-forest-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-cream-300 transition-all flex items-center gap-1.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
