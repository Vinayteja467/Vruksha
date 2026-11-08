import React, { useState, useEffect } from 'react';
import { Hero } from '../components/home/Hero';
import { TrustBar } from '../components/home/TrustBar';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { BestSellers } from '../components/home/BestSellers';
import { WhyPureHarvest } from '../components/home/WhyPureHarvest';
import { ProductSpotlight } from '../components/home/ProductSpotlight';
import { BuildYourBox } from '../components/home/BuildYourBox';
import { HowItWorks } from '../components/home/HowItWorks';
import { BulkPromo } from '../components/home/BulkPromo';
import { CustomerReviewsCarousel } from '../components/home/CustomerReviewsCarousel';
import { FAQAccordion } from '../components/home/FAQAccordion';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { api } from '../api/client';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes, revRes] = await Promise.all([
          api.get('/products?limit=12'),
          api.get('/categories'),
          api.get('/reviews')
        ]);

        if (prodRes.success) setProducts(prodRes.products || []);
        if (catRes.success) setCategories(catRes.categories || []);
        if (revRes.success) setReviews(revRes.reviews || []);
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const spotlightProduct = products.find((p) => p.slug === 'beetroot-powder') || products[0];

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Shop by Category */}
      <CategoryShowcase categories={categories} />

      {/* 4. Best Sellers */}
      <BestSellers products={products} />

      {/* 5. Why PureHarvest? */}
      <WhyPureHarvest />

      {/* 6. Product Spotlight */}
      {spotlightProduct && <ProductSpotlight product={spotlightProduct} />}

      {/* 7. Build Your Box */}
      <BuildYourBox products={products} />

      {/* 8. How It Works */}
      <HowItWorks />

      {/* 9. Bulk Orders */}
      <BulkPromo />

      {/* 10. Customer Reviews */}
      <CustomerReviewsCarousel reviews={reviews} />

      {/* 11. FAQ Accordion */}
      <FAQAccordion />

      {/* 12. Newsletter */}
      <NewsletterSection />
    </div>
  );
};
