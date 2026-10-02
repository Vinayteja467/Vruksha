import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Compass, ShieldCheck, Sparkles, Heart, ArrowDown, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  const journeySteps = [
    {
      step: '01',
      title: 'Regenerative Farm',
      desc: 'Cultivated in rich, organic-certified Indian soils by family-owned partner growers without chemical pesticides.',
      icon: '🌱'
    },
    {
      step: '02',
      title: 'Peak Harvest',
      desc: 'Produce is hand-picked at peak nutritional maturity when vitamins and natural pigments are at their highest concentration.',
      icon: '🌾'
    },
    {
      step: '03',
      title: 'Micro-Filtered Cleaning',
      desc: 'Multiple stages of washing using reverse-osmosis purified water to eliminate soil, impurities, and natural residues.',
      icon: '💧'
    },
    {
      step: '04',
      title: 'Low-Temp Dehydration',
      desc: 'Gentle shade and vacuum dehydration below 45°C preserves living plant enzymes, vivid colors, and aromatic notes.',
      icon: '🌬️'
    },
    {
      step: '05',
      title: 'Fine Pulverization',
      desc: 'Cold-milled through specialized stainless-steel milling to achieve an ultrafine 80-mesh product that dissolves cleanly.',
      icon: '⚙️'
    },
    {
      step: '06',
      title: 'Rigorous Quality Check',
      desc: 'Every batch undergoes thorough laboratory analysis for moisture control, heavy metals, and microbiological purity.',
      icon: '🔬'
    },
    {
      step: '07',
      title: 'Airtight Protective Packaging',
      desc: 'Automated cleanroom sealing inside triple-barrier foil pouches that shield active nutrients from moisture and light.',
      icon: '📦'
    },
    {
      step: '08',
      title: 'Customer Home & Table',
      desc: 'Delivered directly to your door, ready to bring vibrant color and whole food goodness to your family’s daily meals.',
      icon: '🏡'
    }
  ];

  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 lg:space-y-24">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700 bg-forest-100 px-3 py-1 rounded-full border border-forest-200">
            Our Brand Philosophy
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-forest-950 leading-tight">
            Farm to Home
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
            VRUKSHA was born from a simple realization: Indian farms grow some of the most vibrant, nutrient-dense fruits, roots, and botanicals in the world — but modern busy lives make preparing them from scratch difficult.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              Our Story
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              In traditional Indian kitchens, drying herbs, sun-baking spices, and preserving vegetables for seasonal longevity was an honored domestic art. Over decades of industrial food commercialization, this culinary wisdom was replaced with artificial dyes, chemical preservatives, and synthetic additives.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              In 2024, our founders traveled across Kerala, Maharashtra, and Tamil Nadu to bridge this gap. We teamed up with smallholder organic farmers who were already harvesting superior beets, moringa leaves, and wild amla. By applying modern low-temperature dehydration technology, we turned farm-fresh bounty into shelf-stable products that retain their vibrant colors and nutritional integrity.
            </p>
            <div className="pt-2">
              <blockquote className="border-l-4 border-forest-700 pl-4 italic text-sm text-forest-900 font-serif">
                "We don't create lab miracles. We simply preserve what nature perfected in the field."
              </blockquote>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-[4/3] bg-cream-200">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
                alt="Farmers harvesting organic produce in India"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission & Quality Promise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Our Mission</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              To make 100% natural, farm-sourced vegetable and fruit nutrition accessible and effortless for everyday Indian cooking, smoothies, and wholesome living.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Our Sourcing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We practice direct fair-trade procurement with growers across pesticide-free Indian agrarian belts, ensuring farmers receive equitable prices for superior crop quality.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-cream-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest-950">Our Quality Promise</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero anti-caking agents, zero maltodextrin fillers, and zero synthetic food dyes. Just 100% clean whole plant product, validated through third-party lab testing.
            </p>
          </div>
        </div>

        {/* Production Journey: Farm to Customer */}
        <div id="production-journey" className="bg-white rounded-3xl border border-cream-200 p-8 sm:p-12 shadow-soft space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-700">
              Farm-to-Pouch Integrity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-2 mb-3">
              The VRUKSHA Production Journey
            </h2>
            <p className="text-sm text-stone-600">
              Follow the journey of our produce from fertile Indian soil straight to your breakfast table.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-cream-50 rounded-2xl p-6 border border-cream-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-xs font-serif font-bold text-forest-700 bg-white px-2 py-0.5 rounded border border-cream-200">
                      Phase {step.step}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-forest-950 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-colors"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
