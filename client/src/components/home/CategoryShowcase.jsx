import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryShowcase = ({ categories = [] }) => {
  return (
    <section className="section bg-cream-50">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="eyebrow">
            Botanical Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2 mb-4">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Explore our wholesome collection of farm-dried whole foods pulverized into everyday convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              className="group relative card card-hover flex flex-col justify-between overflow-hidden"
            >
              <div className="relative aspect-[4/3] zoom-wrap bg-cream-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 mb-4 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <Link
                  to={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-forest-600 transition-colors group/link"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
