'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatBDT } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { CouponInput } from '@/components/shop/CouponInput';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, discount, total, coupon } = useCart();
  const sub = subtotal();
  const disc = discount();
  const grand = total();

  if (items.length === 0) {
    return (
      <div className="container-shop py-10">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          actionText="Start Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-shop py-6">
      <Breadcrumbs items={[{ label: 'Cart' }]} />

      <h1 className="font-display text-2xl sm:text-3xl font-bold mt-6 mb-6">
        Shopping Cart <span className="text-gray-400 font-normal">({items.length})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Items */}
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={`${it.productId}:${it.variantId || ''}`}
              className="flex gap-3 sm:gap-4 rounded-xl border bg-white p-3 sm:p-4"
            >
              <Link
                href="#"
                className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-lg overflow-hidden bg-gray-50"
              >
                {it.image && (
                  <Image src={it.image} alt={it.name} fill sizes="96px" className="object-cover" />
                )}
              </Link>

              <div className="flex-1 min-w-0 flex flex-col">
                <Link
                  href={`/product/${it.productId}`}
                  className="font-medium text-sm line-clamp-2 hover:text-rose-600"
                >
                  {it.name}
                </Link>
                {it.variantName && (
                  <p className="text-xs text-gray-500 mt-0.5">{it.variantName}</p>
                )}
                {it.sku && (
                  <p className="text-[11px] text-gray-400 mt-0.5">SKU: {it.sku}</p>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-lg border">
                    <button
                      onClick={() => updateQty(it.productId, it.variantId, it.qty - 1)}
                      disabled={it.qty <= 1}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-9 text-center text-sm font-medium">{it.qty}</span>
                    <button
                      onClick={() => updateQty(it.productId, it.variantId, it.qty + 1)}
                      disabled={it.qty >= it.stock}
                      className="h-8 w-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-rose-600">
                      {formatBDT(it.price * it.qty)}
                    </p>
                    {it.qty > 1 && (
                      <p className="text-[11px] text-gray-400">
                        {formatBDT(it.price)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(it.productId, it.variantId)}
                className="self-start text-gray-400 hover:text-rose-600 p-1"
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-rose-600 font-medium mt-2"
          >
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-32 h-fit">
          <div className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>

            <CouponInput subtotal={sub} />

            <div className="space-y-2 text-sm pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatBDT(sub)}</span>
              </div>
              {disc > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">−{formatBDT(disc)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t text-lg font-bold">
              <span>Total</span>
              <span className="text-rose-600">{formatBDT(grand)}</span>
            </div>

            <Button asChild className="w-full h-11" size="lg">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </Button>

            <p className="text-[11px] text-gray-500 text-center">
              Cash on Delivery · bKash · Nagad accepted
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
