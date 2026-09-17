import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/section-title';
import type { Brand } from '@/types';

export function BrandStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;

  return (
    <section className="container-shop py-10">
      <SectionTitle
        title="Shop by Brand"
        subtitle="Authentic products from brands you trust"
        center
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {brands.slice(0, 12).map((b) => (
          <Link
            key={b.id}
            href={`/brand/${b.slug}`}
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white h-20 hover:border-rose-300 hover:shadow transition"
          >
            {b.logo ? (
              <div className="relative h-12 w-24">
                <Image
                  src={b.logo}
                  alt={b.name}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-sm font-semibold text-gray-700 text-center px-2">
                {b.name}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}