'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatBDT, calcDiscount } from '@/lib/utils';
import { Rating } from '@/components/ui/rating';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();

  const inWishlist = has(product.id);
  const discount = calcDiscount(product.regularPrice, product.salePrice);
  const displayPrice = product.salePrice ?? product.regularPrice;
  const mainImg = product.images?.find((i) => i.isMain)?.url || product.images?.[0]?.url;
  const outOfStock = (product.stock ?? 0) <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(product, 1);
    toast.success('Added to cart');
  };

  return (
    <div className="group relative rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-shadow">
      {/* badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded bg-rose-600 text-white text-[10px] font-bold px-2 py-1">
            -{discount}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="rounded bg-gray-900 text-white text-[10px] font-bold px-2 py-1">
            NEW
          </span>
        )}
        {outOfStock && (
          <span className="rounded bg-gray-700 text-white text-[10px] font-bold px-2 py-1">
            STOCK OUT
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={() => toggle(product.id)}
        aria-label="Toggle wishlist"
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
      >
        <Heart
          size={16}
          className={cn(inWishlist ? 'fill-rose-500 text-rose-500' : 'text-gray-600')}
        />
      </button>

      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50">
          {mainImg ? (
            <Image
              src={mainImg}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-300">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        {product.brandName && (
          <p className="text-[11px] uppercase tracking-wide text-gray-500 truncate">
            {product.brandName}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {product.rating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 && (
          <div className="mt-1">
            <Rating value={product.rating} showValue count={product.reviewCount} size={12} />
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-rose-600">{formatBDT(displayPrice)}</span>
          {product.salePrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatBDT(product.regularPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 py-2 text-xs font-medium text-white hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          <ShoppingBag size={14} />
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}