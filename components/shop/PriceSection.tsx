import Link from 'next/link';
import { ProductCard } from './ProductCard';
import { SectionTitle } from '@/components/ui/section-title';
import { formatBDT } from '@/lib/utils';
import type { Product } from '@/types';

export function PriceSection({
  maxPrice,
  products,
}: {
  maxPrice: number;
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <section className="container-shop py-10">
      <SectionTitle
        title={`Under ${formatBDT(maxPrice)}`}
        subtitle={`Great beauty finds that won't break the bank`}
        action={
          <Link
            href={`/shop?max=${maxPrice}`}
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            See more →
          </Link>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}