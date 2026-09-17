import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetails } from '@/components/shop/ProductDetails';
import {
  getProductBySlug,
  getRelatedProducts,
  incrementProductView,
} from '@/lib/firestore/products';
import { getProductReviews } from '@/lib/firestore/reviews';
import { SITE } from '@/lib/constants';

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product not found' };

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
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product, 8).catch(() => []),
    getProductReviews(product.id).catch(() => []),
  ]);

  // fire & forget view count
  incrementProductView(product.id).catch(() => {});

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
