import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetails } from '@/components/shop/ProductDetails';
import {
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/firestore/products';
import { getProductReviews } from '@/lib/firestore/reviews';
import { SITE } from '@/lib/constants';

// This page reads live Firestore data — never let Next serve a stale or
// build-time-empty prerender of it.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Params {
  params: { slug: string };
}

/**
 * A *failed* fetch and a *missing* product are different things. The old
 * code treated both as 404, so any Firestore hiccup (bad env var, missing
 * index, network) rendered "not found" instead of the product. Now a
 * thrown error is logged and re-thrown into error.tsx, and only a genuine
 * null result 404s.
 */
async function loadProduct(slug: string) {
  try {
    return await getProductBySlug(decodeURIComponent(slug));
  } catch (e) {
    console.error('[product page] failed to load', slug, e);
    throw e;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  let product = null;
  try {
    product = await getProductBySlug(decodeURIComponent(params.slug));
  } catch {
    // Metadata must never break the page render
  }
  if (!product) return { title: 'Product' };

  const title = product.seoTitle || product.name;
  const description =
    product.metaDescription || product.shortDescription || product.description?.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title,
      description,
      images: product.ogImage
        ? [product.ogImage]
        : product.images?.[0]?.url
        ? [product.images[0].url]
        : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = await loadProduct(params.slug);
  if (!product) return notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product, 8).catch(() => []),
    getProductReviews(product.id).catch(() => []),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((i) => i.url) || [],
    description: product.shortDescription || product.description,
    sku: product.sku,
    brand: product.brandName
      ? { '@type': 'Brand', name: product.brandName }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price: product.salePrice ?? product.regularPrice,
      availability:
        (product.stock ?? 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${SITE.url}/product/${product.slug}`,
    },
    aggregateRating:
      product.reviewCount && product.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails product={product} related={related} reviews={reviews} />
    </>
  );
}
