import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBrands } from '@/lib/firestore/brands';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { EmptyState } from '@/components/ui/empty-state';
import { Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shop by Brand',
  description: 'Explore authentic beauty brands available in Bangladesh.',
  alternates: { canonical: '/brands' },
};

export default async function BrandsPage() {
  const brands = await getBrands().catch(() => []);

  return (
    <div className="container-shop py-6">
      <Breadcrumbs items={[{ label: 'Brands' }]} />
      <h1 className="font-display text-3xl font-bold mt-6 mb-2">Our Brands</h1>
      <p className="text-sm text-gray-500 mb-8">Authentic products from trusted brands</p>

      {brands.length === 0 ? (
        <EmptyState icon={Award} title="No brands available" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/brand/${b.slug}`}
              className="group rounded-xl border bg-white p-6 flex flex-col items-center justify-center h-32 hover:border-rose-300 hover:shadow transition"
            >
              {b.logo ? (
                <div className="relative h-14 w-24">
                  <Image src={b.logo} alt={b.name} fill sizes="100px" className="object-contain" />
                </div>
              ) : (
                <span className="font-semibold text-gray-700 group-hover:text-rose-600 text-center">
                  {b.name}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
