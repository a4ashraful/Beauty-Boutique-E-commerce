'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { SectionTitle } from '@/components/ui/section-title';
import type { Product } from '@/types';

export function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' });
  };

  return (
    <section className="container-shop py-10">
      <SectionTitle
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex items-center gap-2">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="hidden sm:inline-block text-sm font-medium text-rose-600 hover:text-rose-700 mr-2"
              >
                View all →
              </Link>
            )}
            <button
              onClick={() => scrollBy(-1)}
              className="h-9 w-9 rounded-full border bg-white hover:bg-gray-50 flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="h-9 w-9 rounded-full border bg-white hover:bg-gray-50 flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        }
      />
      <div
        ref={ref}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="snap-start shrink-0 w-[46%] sm:w-[32%] md:w-[24%] lg:w-[19%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}