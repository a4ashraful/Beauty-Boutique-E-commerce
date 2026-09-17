'use client';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { ProductVariant } from '@/types';

export function VariantEditor({
  variants,
  onChange,
  basePrice,
}: {
  variants: ProductVariant[];
  onChange: (v: ProductVariant[]) => void;
  basePrice: number;
}) {
  const add = () => {
    onChange([
      ...variants,
      {
        id: `v_${Date.now()}`,
        name: '',
        sku: '',
        price: basePrice || 0,
        stock: 0,
        image: '',
        shade: '',
      },
    ]);
  };

  const update = (idx: number, patch: Partial<ProductVariant>) => {
    onChange(variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };

  const remove = (idx: number) => {
    onChange(variants.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {variants.length === 0 && (
        <p className="text-xs text-gray-500">
          No variants — this product will use the base price and stock.
        </p>
      )}

      {variants.map((v, i) => (
        <div key={v.id} className="rounded-lg border p-3 space-y-3 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-700">Variant #{i + 1}</p>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-rose-600 hover:text-rose-700 p-1"
              aria-label="Remove variant"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Variant Name *</Label>
              <Input
                value={v.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder='e.g. "Ruby Red" or "30ml"'
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">SKU</Label>
              <Input
                value={v.sku || ''}
                onChange={(e) => update(i, { sku: e.target.value })}
                placeholder="Optional"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Price (৳) *</Label>
              <Input
                type="number"
                value={v.price}
                onChange={(e) => update(i, { price: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Stock *</Label>
              <Input
                type="number"
                value={v.stock}
                onChange={(e) => update(i, { stock: Number(e.target.value) })}
                className="mt-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">Image URL (optional)</Label>
              <Input
                value={v.image || ''}
                onChange={(e) => update(i, { image: e.target.value })}
                placeholder="https://i.ibb.co/…"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={add} size="sm">
        <Plus size={14} /> Add Variant
      </Button>
    </div>
  );
}
