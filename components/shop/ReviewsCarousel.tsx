'use client';
import { useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Rating } from '@/components/ui/rating';
import { SectionTitle } from '@/components/ui/section-title';
import type { Review } from '@/types';

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLDivElement>(null);

  if (!reviews.length) return null;

  const scrollBy = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <section className="container-shop py-12">
      <SectionTitle
        title="What Our Customers Say"
        subtitle="Real reviews from real beauty lovers"
        center
        action={
          <div className="hidden md:flex gap-2 mt-4">
            <button
              onClick={() => scrollBy(-1)}
              className="h-9 w-9 rounded-full border bg-white flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="h-9 w-9 rounded-full border bg-white flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        }
      />
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
      >
        {reviews.map((r) => (
          <div
            key={r.id}
            className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[31%] rounded-xl border bg-white p-5"
          >
            <Quote size={24} className="text-rose-300" />
            <Rating value={r.rating} />
            <p className="mt-3 text-sm text-gray-700 leading-relaxed line-clamp-5">
              "{r.comment}"
            </p>
            <div className="mt-4 pt-4 border-t flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-semibold text-sm">
                {r.customerName?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-sm font-medium">{r.customerName || 'Anonymous'}</p>
                <p className="text-xs text-gray-400">Verified Customer</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}