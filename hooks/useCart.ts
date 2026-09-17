'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Coupon } from '@/types';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (p: any, qty?: number, variant?: any) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clear: () => void;
  setCoupon: (c: Coupon | null) => void;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (p, qty = 1, variant) => {
        const stock = variant?.stock ?? p.stock ?? 0;
        if (stock <= 0) return;
        const price = Number(variant?.price ?? p.salePrice ?? p.regularPrice);
        const image = variant?.image || p.images?.[0]?.url;

        const existing = get().items.find(
          (i) => i.productId === p.id && (i.variantId || '') === (variant?.id || '')
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === p.id && (i.variantId || '') === (variant?.id || '')
                ? { ...i, qty: Math.min(i.qty + qty, stock) }
                : i
            ),
          });
        } else {
          const item: CartItem = {
            productId: p.id,
            variantId: variant?.id,
            variantName: variant?.name,
            name: p.name,
            image,
            price,
            qty: Math.min(qty, stock),
            stock,
            sku: variant?.sku || p.sku,
          };
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (pid, vid) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === pid && (i.variantId || '') === (vid || ''))
          ),
        }),

      updateQty: (pid, vid, qty) =>
        set({
          items: get().items.map((i) =>
            i.productId === pid && (i.variantId || '') === (vid || '')
              ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        }),

      clear: () => set({ items: [], coupon: null }),
      setCoupon: (c) => set({ coupon: c }),

      subtotal: () =>
        get().items.reduce((s, i) => s + i.price * i.qty, 0),

      discount: () => {
        const sub = get().subtotal();
        const c = get().coupon;
        if (!c) return 0;
        const raw = c.type === 'percent' ? (sub * c.value) / 100 : c.value;
        const cap = c.maxDiscount ? Math.min(raw, c.maxDiscount) : raw;
        return Math.min(cap, sub);
      },

      total: () => Math.max(0, get().subtotal() - get().discount()),
      itemCount: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    {
      name: 'bbt-cart-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);