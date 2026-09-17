'use client';
import { X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const remove = (key: string, value?: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && key === 'brand') {
      const list = (next.get('brand') || '').split(',').filter(Boolean);
      next.set('brand', list.filter((v) => v !== value).join(','));
      if (!next.get('brand')) next.delete('brand');
    } else {
      next.delete(key);
    }
    next.delete('page');
    router.push(`${pathname}?${next.toString()}`);
  };

  const chips: { key: string; label: string; value?: string }[] = [];

  const q = params.get('q');
  if (q) chips.push({ key: 'q', label: `"${q}"` });

  ['category', 'brand', 'skinType', 'skinConcern', 'shade', 'rating'].forEach((k) => {
    const v = params.get(k);
    if (!v) return;
    if (k === 'brand') {
      v.split(',').forEach((b) =>
        chips.push({ key: k, value: b, label: `Brand: ${b}` })
      );
    } else {
      chips.push({ key: k, label: v });
    }
  });

  const min = params.get('min');
  const max = params.get('max');
  if (min || max) {
    chips.push({ key: 'price', label: `৳${min || 0}–৳${max || '∞'}` });
  }

  if (params.get('sale')) chips.push({ key: 'sale', label: 'On Sale' });
  if (params.get('inStock')) chips.push({ key: 'inStock', label: 'In Stock' });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-gray-500">Active:</span>
      {chips.map((c, i) => (
        <button
          key={i}
          onClick={() => {
            if (c.key === 'price') {
              remove('min');
              remove('max');
            } else {
              remove(c.key, c.value);
            }
          }}
          className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 text-xs px-3 py-1 hover:bg-rose-100"
        >
          {c.label}
          <X size={12} />
        </button>
      ))}
      <button
        onClick={() => router.push(pathname)}
        className="text-xs text-gray-500 underline hover:text-rose-600"
      >
        Clear all
      </button>
    </div>
  );
}