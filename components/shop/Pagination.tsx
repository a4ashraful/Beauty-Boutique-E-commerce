'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  currentPage,
  hasMore,
  totalPages,
}: {
  currentPage: number;
  hasMore: boolean;
  totalPages?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const go = (page: number) => {
    const next = new URLSearchParams(params.toString());
    if (page <= 1) next.delete('page');
    else next.set('page', String(page));
    router.push(`${pathname}?${next.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-40"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm px-3">
        Page <strong>{currentPage}</strong>
      </span>
      <button
        onClick={() => go(currentPage + 1)}
        disabled={!hasMore}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-40"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}