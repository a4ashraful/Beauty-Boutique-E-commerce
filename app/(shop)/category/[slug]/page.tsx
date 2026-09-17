import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryBySlug, getSubcategories } from '@/lib/firestore/categories';
import { getProducts } from '@/lib/firestore/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { EmptyState } from '@/components/ui/empty-state';
import { PackageOpen } from 'lucide-react';

interface Params {
  params: { slug: string };
  searchParams: { sort?: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) return { title: 'Category not found' };
  return {
    title: cat.seoTitle || `${cat.name} — Shop Online`,
    description: cat.metaDescription || `Browse our ${cat.name} collection.`,
    alternates: { canonical: `/category/${cat.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) return notFound();

  const [subs, { products }] = await Promise.all([
    getSubcategories(cat.id).catch(() => []),
    getProducts({
      categoryId: cat.id,
      sortBy: (searchParams.sort as any) || 'newest',
      pageSize: 48,
    }).catch(() => ({ products: [] })),
  ]);

  return (
    <div className="container-shop py-6">
      <Breadcrumbs items={[{ label: 'Categories', href: '/categories' }, { label: cat.name }]} />

      <div className="mt-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">{cat.name}</h1>
        {cat.description && (
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">{cat.description}</p>
        )}
      </div>

      {subs.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subs.map((s) => (
            <Link
              key={s.id}
              href={`/category/${s.slug}`}
              className="rounded-full border px-4 py-1.5 text-sm hover:border-rose-400 hover:text-rose-600"
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No products yet"
          description="Products will appear here soon."
          actionText="Back to Shop"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
