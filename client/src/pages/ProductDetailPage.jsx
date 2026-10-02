import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  PackageCheck,
  Truck,
  CreditCard,
  Plus,
  Minus,
  CheckCircle2,
  Star,
  ChevronRight,
  Share2,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/product/ProductCard';
import { formatPrice } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openDrawer } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('100g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  // Review Form State
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/products/${slug}`);
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedSize(data.product.sizes?.[0]?.size || '100g');
          setSelectedImgIndex(0);

          // Fetch reviews for this product
          const revData = await api.get(`/reviews?productId=${data.product.id || data.product.slug}`);
          if (revData.success) {
            setReviews(revData.reviews || []);
          }

          // Fetch related products
          const related = await api.get(`/products?category=${data.product.categorySlug || 'all'}&limit=5`);
          if (related.success) {
            setRelatedProducts((related.products || []).filter((p) => p.slug !== slug).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-cream-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-cream-200 rounded w-1/4" />
            <div className="h-8 bg-cream-200 rounded w-3/4" />
            <div className="h-4 bg-cream-200 rounded w-1/3" />
            <div className="h-20 bg-cream-200 rounded" />
            <div className="h-10 bg-cream-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-forest-950 mb-3">Product not found</h2>
        <p className="text-sm text-stone-500 mb-6">The product you are looking for may have moved or is unavailable.</p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-forest-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-block"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

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

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    openDrawer();
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      addToast('Please provide your name and review', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const data = await api.post('/reviews', {
        productId: product.id || product.slug,
        productName: product.name,
        name: reviewName,
        rating: reviewRating,
        title: reviewTitle || 'Verified Customer Review',
        comment: reviewComment
      });

      if (data.success) {
        setReviews([data.review, ...reviews]);
        setReviewName('');
        setReviewTitle('');
        setReviewComment('');
        addToast('Review submitted successfully! Thank you.', 'success');
      }
    } catch (err) {
      addToast('Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Upsell pair item for "Frequently Bought Together"
  const upsellItem = relatedProducts[0];

  return (
    <div className="bg-cream-50/40 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-forest-800">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to="/shop" className="hover:text-forest-800">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to={`/category/${product.categorySlug}`} className="hover:text-forest-800">{product.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-forest-950 font-semibold">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-soft mb-16">
          {/* Left Column: Image Gallery with Thumbnails (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image with Zoom */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 group">
              <img
                src={product.images?.[selectedImgIndex] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {discountPercent > 0 && (
                  <span className="bg-forest-900 text-cream-50 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.bestSeller && (
                  <span className="bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/90 text-stone-600 hover:text-rose-600'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImgIndex === idx
                        ? 'border-forest-700 ring-2 ring-forest-200'
                        : 'border-cream-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-forest-50 px-2.5 py-1 rounded-md border border-forest-100">
                  {product.category}
                </span>
                <RatingStars rating={product.rating || 4.8} reviewCount={reviews.length || product.reviewCount} size="md" />
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 leading-tight">
                {product.name}
              </h1>

              <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Price Block */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex items-baseline gap-3">
              <span className="font-serif text-3xl font-bold text-forest-950">
                {formatPrice(currentSizeObj.price)}
              </span>
              {currentSizeObj.originalPrice > currentSizeObj.price && (
                <span className="text-base text-stone-400 line-through">
                  {formatPrice(currentSizeObj.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
              <span className="text-[11px] text-stone-500 ml-auto hidden sm:inline">
                Inclusive of all taxes
              </span>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-forest-900">
                  Select Size
                </label>
                <span className="text-xs text-stone-500">Selected: <strong>{selectedSize}</strong></span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.sizes?.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === s.size
                        ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                        : 'bg-white text-stone-700 border-cream-300 hover:border-forest-700'
                    }`}
                  >
                    <span>{s.size}</span>
                    <span className="block text-[10px] font-normal opacity-80">
                      {formatPrice(s.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controls & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity Counter */}
                <div className="flex items-center border border-cream-300 rounded-xl bg-white overflow-hidden p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-cream-100 rounded-lg"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-forest-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-cream-100 rounded-lg"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* ADD TO CART */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
              </div>

              {/* BUY NOW Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-earth-600 hover:bg-earth-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>BUY NOW WITH 1-CLICK</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-cream-200">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                <PackageCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Secure Packaging</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                <Truck className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-700">
                <CreditCard className="w-4 h-4 text-forest-600 flex-shrink-0" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs Section */}
        <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden mb-16">
          {/* Tab Navigation Header */}
          <div className="flex items-center border-b border-cream-200 overflow-x-auto whitespace-nowrap bg-cream-50/50">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'ingredients', label: 'Ingredients & Sourcing' },
              { id: 'nutrition', label: 'Nutrition Facts' },
              { id: 'usage', label: 'How to Use & Recipes' },
              { id: 'storage', label: 'Storage & Freshness' },
              { id: 'shipping', label: 'Shipping & FAQ' },
              { id: 'reviews', label: `Reviews (${reviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-forest-800 text-forest-900 bg-white'
                    : 'border-transparent text-stone-500 hover:text-forest-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-10">
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-3xl">
                <h3 className="font-serif text-2xl font-bold text-forest-950">About {product.name}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-normal">{product.description}</p>
                {product.benefits && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-3">Key Natural Attributes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700 bg-cream-50 p-3 rounded-xl border border-cream-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-serif text-2xl font-bold text-forest-950">Ingredients</h3>
                <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200">
                  <p className="text-sm font-semibold text-forest-950">{product.ingredients}</p>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  We maintain a strict single-ingredient policy for our pure single-origin products. No added starch, sugar, silica, or artificial colors.
                </p>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-6 max-w-xl">
                <h3 className="font-serif text-2xl font-bold text-forest-950">Nutritional Information</h3>
                <p className="text-xs text-stone-500">Approximate values per 100g serving of product:</p>
                <div className="border border-cream-200 rounded-2xl overflow-hidden divide-y divide-cream-100">
                  {product.nutrition ? (
                    Object.entries(product.nutrition).map(([key, val]) => (
                      <div key={key} className="flex justify-between p-3.5 text-xs">
                        <span className="capitalize text-stone-600 font-medium">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="font-bold text-forest-950">{val}</span>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-xs text-stone-500">Nutritional table available on retail package.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-serif text-2xl font-bold text-forest-950">Suggested Culinary & Wellness Uses</h3>
                <div className="bg-cream-50 p-5 rounded-2xl border border-cream-200 text-sm text-stone-700 leading-relaxed">
                  {product.usage}
                </div>
                <div className="p-4 rounded-xl border border-cream-200 text-xs text-stone-500">
                  <strong className="text-forest-900 block mb-1">Chef’s Tip:</strong>
                  When baking, whisk product with dry flour before adding liquid ingredients to ensure seamless, clump-free blending.
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-serif text-2xl font-bold text-forest-950">Storage Guidelines</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{product.storage}</p>
                <div className="bg-forest-50 p-4 rounded-xl border border-forest-100 text-xs text-forest-900 space-y-1">
                  <p>• Avoid dipping wet spoons or measuring cups into the pouch.</p>
                  <p>• Shelf life: 12 months unopened; 6 months after opening.</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-2xl">
                <h3 className="font-serif text-2xl font-bold text-forest-950">Shipping & Delivery Details</h3>
                <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                  <li>• <strong>Dispatched within 24 hours</strong> from our certified hygienic packing center.</li>
                  <li>• <strong>Free standard delivery</strong> on all orders above ₹499.</li>
                  <li>• Metro city transit: 2 to 4 business days. Regional transit: 4 to 7 business days.</li>
                  <li>• Real-time SMS and email tracking links provided upon courier handover.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row gap-8 items-start justify-between pb-8 border-b border-cream-200">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950">Customer Feedback</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <RatingStars rating={product.rating || 4.8} reviewCount={reviews.length} size="lg" />
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        100% Verified Purchases
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="bg-cream-50 p-6 rounded-2xl border border-cream-200 max-w-xl">
                  <h4 className="font-serif font-bold text-lg text-forest-950 mb-3">Write a Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">Your Name *</label>
                        <input
                          type="text"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="w-full text-xs p-2.5 rounded-lg border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">Rating *</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full text-xs p-2.5 rounded-lg border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                        >
                          <option value="5">5 Stars - Outstanding</option>
                          <option value="4">4 Stars - Very Good</option>
                          <option value="3">3 Stars - Average</option>
                          <option value="2">2 Stars - Below Expectations</option>
                          <option value="1">1 Star - Poor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">Review Title</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Enter review headline"
                        className="w-full text-xs p-2.5 rounded-lg border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">Your Feedback *</label>
                      <textarea
                        rows="3"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others how you use this product in your cooking or wellness routine..."
                        required
                        className="w-full text-xs p-2.5 rounded-lg border border-cream-300 bg-white focus:outline-none focus:border-forest-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2.5 bg-forest-800 hover:bg-forest-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
                    </button>
                  </form>
                </div>

                {/* Review Cards */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">No reviews yet for this product. Be the first to share your experience!</p>
                  ) : (
                    reviews.map((r, i) => (
                      <div key={r.id || i} className="p-4 rounded-xl border border-cream-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-forest-800 text-cream-50 font-bold text-[10px] flex items-center justify-center">
                              {r.avatar || r.name?.[0]}
                            </span>
                            <span className="text-xs font-bold text-forest-950">{r.name}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                            </span>
                          </div>
                          <RatingStars rating={r.rating} size="sm" showCount={false} />
                        </div>
                        {r.title && <h5 className="text-xs font-bold text-forest-900">{r.title}</h5>}
                        <p className="text-xs text-stone-600 leading-relaxed">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        {upsellItem && (
          <div className="bg-cream-100 rounded-3xl p-6 sm:p-8 border border-cream-200 mb-16 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700 block mb-1">
              Curated Pairing
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 mb-6">
              Frequently Bought Together
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                {/* Item 1 */}
                <div className="flex items-center gap-3">
                  <img src={product.images?.[0]} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-white" />
                  <div>
                    <h4 className="text-xs font-bold text-forest-950">{product.name}</h4>
                    <p className="text-xs font-bold text-forest-700">{formatPrice(currentSizeObj.price)}</p>
                  </div>
                </div>

                <span className="text-lg font-bold text-stone-400">+</span>

                {/* Item 2 */}
                <div className="flex items-center gap-3">
                  <img src={upsellItem.images?.[0]} alt={upsellItem.name} className="w-16 h-16 rounded-xl object-cover bg-white" />
                  <div>
                    <h4 className="text-xs font-bold text-forest-950">{upsellItem.name}</h4>
                    <p className="text-xs font-bold text-forest-700">{formatPrice(upsellItem.price)}</p>
                  </div>
                </div>
              </div>

              {/* Bundle Action */}
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[11px] text-stone-500 block">Combined Total:</span>
                  <span className="font-serif text-xl font-bold text-forest-950">
                    {formatPrice(currentSizeObj.price + upsellItem.price)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product, selectedSize, 1);
                    addToCart(upsellItem, '100g', 1);
                    openDrawer();
                  }}
                  className="px-5 py-3 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Add Both to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like Carousel */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="font-serif text-2xl font-bold text-forest-950 mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id || p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
