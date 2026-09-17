'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { getProductById } from '@/lib/firestore/products';
import { formatBDT, calcDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import type { Product } from '@/types';

export function WishlistClient() {
  const { ids, remove } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!ids.length) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const results = await Promise.all(ids.map((id) => getProductById(id).catch(() => null)));
      setProducts(results.filter(Boolean) as Product[]);
      setLoading(false);
    })();
  }, [ids]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-600" size={24} />
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save your favorite products for later."
        actionText="Discover Products"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => {
        const discount = calcDiscount(p.regularPrice, p.salePrice);
        const price = p.salePrice ?? p.regularPrice;
        const img = p.images?.find((i) => i.isMain)?.url || p.images?.[0]?.url;
        const oos = (p.stock ?? 0) <= 0;
        return (
          <div key={p.id} className="rounded-xl border bg-white overflow-hidden">
            <Link href={`/product/${p.slug}`} className="block relative aspect-square bg-gray-50">
              {img && (
                <Image src={img} alt={p.name} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
              )}
              {discount > 0 && (
                <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </Link>
            <div className="p-4">
              <p className="text-xs text-gray-500 truncate">{p.brandName}</p>
              <Link href={`/product/${p.slug}`} className="font-medium line-clamp-2 text-sm mt-0.5 hover:text-rose-600">
                {p.name}
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-rose-600">{formatBDT(price)}</span>
                {p.salePrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatBDT(p.regularPrice)}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={oos}
                  onClick={() => {
                    addItem(p, 1);
                    toast.success('Added to cart');
                  }}
                >
                  <ShoppingBag size={12} /> {oos ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    remove(p.id);
                    toast.success('Removed from wishlist');
                  }}
                  className="text-rose-600"
                  aria-label="Remove"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}