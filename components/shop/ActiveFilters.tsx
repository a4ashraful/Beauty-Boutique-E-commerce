'use client';
import { X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function ActiveFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /**
   * Removing the price chip used to call remove('min') then remove('max').
   * Both calls built their URL from the same stale `params`, so the second
   * push overwrote the first and `min` silently came back. Now every
   * removal is a single push that can drop several keys at once.
   */
  const removeKeys = (keys: string[], brandValue?: string) => {
    const next = new URLSearchParams(params.toString());

    keys.forEach((key) => {
      if (key === 'brand' && brandValue) {
        const list = (next.get('brand') || '').split(',').filter(Boolean);
        const rest = list.filter((v) => v !== brandValue);
        if (rest.length) next.set('brand', rest.join(','));
        else next.delete('brand');
      } else {
        next.delete(key);
      }
    });

    next.delete('page');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const chips: { keys: string[]; label: string; value?: string }[] = [];

  const q = params.get('q');
  if (q) chips.push({ keys: ['q'], label: `"${q}"` });

  ['category', 'brand', 'skinType', 'skinConcern', 'shade', 'rating'].forEach((k) => {
    const v = params.get(k);
    if (!v) return;
    if (k === 'brand') {
      v.split(',')
        .filter(Boolean)
        .forEach((b) => chips.push({ keys: ['brand'], value: b, label: `Brand: ${b}` }));
    } else if (k === 'rating') {
      chips.push({ keys: ['rating'], label: `${v}★ & up` });
    } else {
      chips.push({ keys: [k], label: v });
    }
  });

  const min = params.get('min');
  const max = params.get('max');
  if (min || max) {
    chips.push({ keys: ['min', 'max'], label: `৳${min || 0}–৳${max || '∞'}` });
  }

  if (params.get('sale')) chips.push({ keys: ['sale'], label: 'On Sale' });
  if (params.get('inStock')) chips.push({ keys: ['inStock'], label: 'In Stock' });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-gray-500">Active:</span>
      {chips.map((c, i) => (
        <button
          key={`${c.keys.join('-')}-${c.value || i}`}
          type="button"
          onClick={() => removeKeys(c.keys, c.value)}
          className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 text-xs px-3 py-1 hover:bg-rose-100"
        >
          {c.label}
          <X size={12} />
        </button>
      ))}
      <button
        type="button"
        onClick={() => router.push(pathname, { scroll: false })}
        className="text-xs text-gray-500 underline hover:text-rose-600"
      >
        Clear all
      </button>
    </div>
  );
}
