'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { formatBDT } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, updateQty, removeItem, subtotal, itemCount } = useCart();
  const sub = subtotal();
  const count = itemCount();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag size={18} /> Your Cart
            {count > 0 && <span className="text-sm text-gray-500 font-normal">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add some products to get started."
            actionText="Start Shopping"
            actionHref="/shop"
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((it) => (
                <div
                  key={`${it.productId}:${it.variantId || ''}`}
                  className="flex gap-3 rounded-lg border p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden bg-gray-50">
                    {it.image && (
                      <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{it.name}</p>
                    {it.variantName && (
                      <p className="text-xs text-gray-500 mt-0.5">{it.variantName}</p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-rose-600">
                      {formatBDT(it.price)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-md border">
                        <button
                          onClick={() => updateQty(it.productId, it.variantId, it.qty - 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                          disabled={it.qty <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{it.qty}</span>
                        <button
                          onClick={() => updateQty(it.productId, it.variantId, it.qty + 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                          disabled={it.qty >= it.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(it.productId, it.variantId)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-lg font-bold">{formatBDT(sub)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Delivery charge calculated at checkout.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}