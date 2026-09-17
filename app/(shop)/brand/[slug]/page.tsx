import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getBrandBySlug } from '@/lib/firestore/brands';
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
  const b = await getBrandBySlug(params.slug);
  if (!b) return { title: 'Brand not found' };
  return {
    title: `${b.name} — Shop Online in Bangladesh`,
    description: b.description || `Shop authentic ${b.name} products.`,
    alternates: { canonical: `/brand/${b.slug}` },
  };
}

export default async function BrandPage({ params, searchParams }: Params) {
  const brand = await getBrandBySlug(params.slug);
  if (!brand) return notFound();

  const { products } = await getProducts({
    brandId: brand.id,
    sortBy: (searchParams.sort as any) || 'newest',
    pageSize: 48,
  }).catch(() => ({ products: [] }));

  return (
    <div className="container-shop py-6">
      <Breadcrumbs items={[{ label: 'Brands', href: '/brands' }, { label: brand.name }]} />

      <div className="mt-6 mb-8 flex items-center gap-4">
        {brand.logo && (
          <div className="relative h-20 w-20 rounded-xl border bg-white overflow-hidden">
            <Image src={brand.logo} alt={brand.name} fill sizes="80px" className="object-contain p-2" />
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">{brand.name}</h1>
          {brand.description && (
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">{brand.description}</p>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No products yet"
          description={`${brand.name} products will appear here soon.`}
          actionText="Browse All Products"
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
