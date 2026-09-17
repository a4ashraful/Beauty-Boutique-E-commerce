'use client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatBDT } from '@/lib/utils';
import type { ProductVariant } from '@/types';

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (v: ProductVariant) => void;
}) {
  if (!variants?.length) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-2">Available Options</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = selectedId === v.id;
          const oos = v.stock <= 0;
          return (
            <button
              key={v.id}
              onClick={() => !oos && onSelect(v)}
              disabled={oos}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
                isSelected ? 'border-rose-600 bg-rose-50' : 'border-gray-300 hover:border-rose-400',
                oos && 'opacity-40 cursor-not-allowed'
              )}
            >
              {v.image && (
                <span className="relative h-8 w-8 rounded overflow-hidden shrink-0">
                  <Image src={v.image} alt={v.name} fill sizes="32px" className="object-cover" />
                </span>
              )}
              <span className="font-medium">{v.name}</span>
              <span className="text-xs text-gray-500">{formatBDT(v.price)}</span>
              {oos && <span className="text-[10px] text-rose-600 font-medium">OOS</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}