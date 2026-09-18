'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Rating } from '@/components/ui/rating';
import { SKIN_TYPES, SKIN_CONCERNS } from '@/lib/utils';
import type { Brand, Category } from '@/types';

export function ProductFilters({
  categories,
  brands,
  maxPrice,
}: {
  categories: Category[];
  brands: Brand[];
  /** Highest product price in the current catalogue. Falls back to 5000. */
  maxPrice?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Round the ceiling up to a clean number so the slider end looks sane.
  const rawCeiling = maxPrice && maxPrice > 0 ? maxPrice : 5000;
  const ceiling = Math.max(100, Math.ceil(rawCeiling / 100) * 100);
  const step = Math.max(10, Math.round(ceiling / 100 / 10) * 10);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, ceiling]);

  useEffect(() => {
    const minParam = params.get('min');
    const maxParam = params.get('max');
    const min = minParam ? Number(minParam) : 0;
    const max = maxParam ? Math.min(Number(maxParam), ceiling) : ceiling;
    setPriceRange([Number.isFinite(min) ? min : 0, Number.isFinite(max) ? max : ceiling]);
  }, [params, ceiling]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    });
    next.delete('page');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleMulti = (key: string, value: string) => {
    const current = (params.get(key) || '').split(',').filter(Boolean);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update({ [key]: next.join(',') || null });
  };

  const selectedBrands = (params.get('brand') || '').split(',').filter(Boolean);
  const selectedSkinType = params.get('skinType') || '';
  const selectedConcern = params.get('skinConcern') || '';
  const selectedCategory = params.get('category') || '';
  const selectedRating = params.get('rating');
  const onSale = params.get('sale') === '1';
  const inStock = params.get('inStock') === '1';

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox
              checked={!selectedCategory}
              onCheckedChange={() => update({ category: null })}
            />
            All Categories
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedCategory === c.slug}
                onCheckedChange={() =>
                  update({ category: selectedCategory === c.slug ? null : c.slug })
                }
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          min={0}
          max={ceiling}
          step={step}
          minStepsBetweenThumbs={1}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          onValueCommit={(v) => {
            const [min, max] = v as [number, number];
            update({
              min: min > 0 ? String(min) : null,
              max: max < ceiling ? String(max) : null,
            });
          }}
        />
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          <span className="rounded border px-2 py-1">৳{priceRange[0]}</span>
          <span>–</span>
          <span className="rounded border px-2 py-1">
            ৳{priceRange[1]}
            {priceRange[1] >= ceiling ? '+' : ''}
          </span>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Brands</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {brands.map((b) => (
              <label key={b.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedBrands.includes(b.slug)}
                  onCheckedChange={() => toggleMulti('brand', b.slug)}
                />
                {b.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Skin Type */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Skin Type</h3>
        <div className="flex flex-wrap gap-2">
          {SKIN_TYPES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update({ skinType: selectedSkinType === s ? null : s })}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                selectedSkinType === s
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Concern */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Skin Concern</h3>
        <div className="flex flex-wrap gap-2">
          {SKIN_CONCERNS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update({ skinConcern: selectedConcern === s ? null : s })}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                selectedConcern === s
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-rose-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update({ rating: selectedRating === String(r) ? null : String(r) })}
              className={`flex items-center gap-2 text-sm w-full text-left p-1.5 rounded ${
                selectedRating === String(r) ? 'bg-rose-50' : ''
              }`}
            >
              <Rating value={r} />
              <span className="text-xs text-gray-500">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={onSale} onCheckedChange={() => update({ sale: onSale ? null : '1' })} />
          Only Discounted
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={inStock} onCheckedChange={() => update({ inStock: inStock ? null : '1' })} />
          In Stock Only
        </label>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push(pathname, { scroll: false })}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
