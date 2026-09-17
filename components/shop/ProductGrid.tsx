import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}