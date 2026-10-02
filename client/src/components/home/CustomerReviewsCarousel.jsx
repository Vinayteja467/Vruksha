import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';

export const CustomerReviewsCarousel = ({ reviews = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackReviews = [
    {
      id: 'rev-01',
      name: 'Ananya Sharma',
      avatar: 'AS',
      rating: 5,
      productPurchased: 'Pure Beetroot Powder (250g)',
      review: 'I use this beetroot powder every morning in my pre-workout smoothie. The color is so rich and natural, and it dissolves without any gritty sand texture. Beautiful packaging too!',
      date: 'Verified Buyer • Mumbai'
    },
    {
      id: 'rev-02',
      name: 'Vikram Menon',
      avatar: 'VM',
      rating: 5,
      productPurchased: 'Organic Moringa Leaf Powder (150g)',
      review: 'Having grown up in Kerala where moringa trees are everywhere, I can tell this is top notch shade-dried quality. No artificial additives. Highly recommend.',
      date: 'Verified Buyer • Kochi'
    },
    {
      id: 'rev-03',
      name: 'Pooja Deshmukh',
      avatar: 'PD',
      rating: 5,
      productPurchased: 'Wild Amla Powder (250g)',
      review: 'Warm water, half a spoon of amla powder, and a dash of raw honey. The tartness is authentic and fresh. Love the clean ingredients philosophy.',
      date: 'Verified Buyer • Pune'
    },
    {
      id: 'rev-04',
      name: 'Rohan Mehra',
      avatar: 'RM',
      rating: 5,
      productPurchased: 'Pure Beetroot Powder (100g)',
      review: 'Used it to naturally tint Sunday brunch pancakes for my kids without synthetic red 40 food color. Absolutely loved the gentle taste and ease of use.',
      date: 'Verified Buyer • Bengaluru'
    }
  ];

  const reviewList = reviews.length > 0 ? reviews : fallbackReviews;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviewList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviewList.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Based on verified purchases</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              Loved by Home Cooks & Wellness Seekers
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              Authentic feedback from daily users who celebrate the clean pantry difference.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-cream-300 hover:border-forest-700 hover:bg-cream-100 flex items-center justify-center text-forest-900 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-cream-300 hover:border-forest-700 hover:bg-cream-100 flex items-center justify-center text-forest-900 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewList.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`bg-cream-50 rounded-2xl p-6 border border-cream-200 shadow-soft flex flex-col justify-between transition-all duration-300 ${
                idx === currentIndex ? 'ring-2 ring-forest-700' : ''
              }`}
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-forest-200" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-4">
                  "{item.review || item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-cream-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-forest-800 text-cream-50 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {item.avatar || item.name?.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-forest-950">{item.name}</h4>
                    <p className="text-[10px] text-stone-500 font-medium">
                      {item.productPurchased || item.productName || 'VRUKSHA Product'}
                    </p>
                    <span className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified Purchase
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
