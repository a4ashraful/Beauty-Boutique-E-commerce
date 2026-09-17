import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
import { getAllActiveProducts } from '@/lib/firestore/products';
import { getCategories } from '@/lib/firestore/categories';
import { getBrands } from '@/lib/firestore/brands';

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categories`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/brands`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/track-order`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/pages/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pages/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pages/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/pages/delivery`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/pages/return-policy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/pages/privacy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/pages/terms`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const [products, categories, brands] = await Promise.all([
      getAllActiveProducts(1000),
      getCategories(),
      getBrands(),
    ]);

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt?.toDate?.() || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const brandPages: MetadataRoute.Sitemap = brands.map((b) => ({
      url: `${baseUrl}/brand/${b.slug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticPages, ...productPages, ...categoryPages, ...brandPages];
  } catch {
    return staticPages;
  }
}