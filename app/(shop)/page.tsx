import { HeroBanner } from '@/components/shop/HeroBanner';
import { PromoBanners } from '@/components/shop/PromoBanners';
import { ServiceBadges } from '@/components/shop/ServiceBadges';
import { TrustStrip } from '@/components/shop/TrustStrip';
import { CategoryGrid } from '@/components/shop/CategoryGrid';
import { BrandStrip } from '@/components/shop/BrandStrip';
import { ProductCarousel } from '@/components/shop/ProductCarousel';
import { PriceSection } from '@/components/shop/PriceSection';
import { WhyChooseUs } from '@/components/shop/WhyChooseUs';
import { ReviewsCarousel } from '@/components/shop/ReviewsCarousel';
import { SocialSection } from '@/components/shop/SocialSection';

import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getDiscountedProducts,
  getUnderPrice,
} from '@/lib/firestore/products';
import { getTopCategories } from '@/lib/firestore/categories';
import { getBrands } from '@/lib/firestore/brands';
import { getBanners } from '@/lib/firestore/banners';
import { getFeaturedReviews, getRecentReviews } from '@/lib/firestore/reviews';

export const revalidate = 60; // ISR every 60s

export default async function HomePage() {
  const [
    heroBanners,
    promoBanners,
    categories,
    brands,
    featured,
    newArrivals,
    bestSellers,
    discounted,
    under299,
    under499,
    under999,
    featuredReviews,
    recentReviews,
  ] = await Promise.all([
    getBanners('hero').catch(() => []),
    getBanners('promo').catch(() => []),
    getTopCategories(12).catch(() => []),
    getBrands().catch(() => []),
    getFeaturedProducts(10).catch(() => []),
    getNewArrivals(10).catch(() => []),
    getBestSellers(10).catch(() => []),
    getDiscountedProducts(10).catch(() => []),
    getUnderPrice(299, 8).catch(() => []),
    getUnderPrice(499, 8).catch(() => []),
    getUnderPrice(999, 8).catch(() => []),
    getFeaturedReviews(6).catch(() => []),
    getRecentReviews(8).catch(() => []),
  ]);

  const reviews = featuredReviews.length ? featuredReviews : recentReviews;

  return (
    <>
      <HeroBanner banners={heroBanners} />
      <TrustStrip />
      <ServiceBadges />

      {promoBanners.length > 0 && <PromoBanners banners={promoBanners} />}

      {categories.length > 0 && <CategoryGrid categories={categories} />}

      {featured.length > 0 && (
        <ProductCarousel
          title="Featured Products"
          subtitle="Handpicked by our beauty experts"
          products={featured}
          viewAllHref="/shop"
        />
      )}

      {discounted.length > 0 && (
        <ProductCarousel
          title="On Sale — Limited Time"
          subtitle="Grab your favorites before they're gone"
          products={discounted}
          viewAllHref="/shop?sale=1"
        />
      )}

      {newArrivals.length > 0 && (
        <ProductCarousel
          title="New Arrivals"
          subtitle="Fresh picks just landed"
          products={newArrivals}
          viewAllHref="/shop?sort=newest"
        />
      )}

      {bestSellers.length > 0 && (
        <ProductCarousel
          title="Best Sellers"
          subtitle="Most loved by our customers"
          products={bestSellers}
          viewAllHref="/shop?sort=best-selling"
        />
      )}

      {brands.length > 0 && <BrandStrip brands={brands} />}

      {under299.length > 0 && <PriceSection maxPrice={299} products={under299} />}
      {under499.length > 0 && <PriceSection maxPrice={499} products={under499} />}
      {under999.length > 0 && <PriceSection maxPrice={999} products={under999} />}

      <WhyChooseUs />

      {reviews.length > 0 && <ReviewsCarousel reviews={reviews} />}

      <SocialSection />
    </>
  );
}