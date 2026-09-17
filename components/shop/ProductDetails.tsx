'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Heart, ShoppingBag, Zap, Truck, ShieldCheck, RotateCcw,
  Minus, Plus, Check,
} from 'lucide-react';
import { ProductGallery } from './ProductGallery';
import { VariantSelector } from './VariantSelector';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductInfoTabs } from './ProductInfoTabs';
import { ReviewsSection } from './ReviewsSection';
import { ProductCarousel } from './ProductCarousel';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatBDT, calcDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product, ProductVariant, Review } from '@/types';

export function ProductDetails({
  product,
  related,
  reviews,
}: {
  product: Product;
  related: Product[];
  reviews: Review[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find((v) => v.stock > 0) || null
  );
  const [qty, setQty] = useState(1);

  const inWishlist = has(product.id);
  const mainImg = product.images?.find((i) => i.isMain)?.url || product.images?.[0]?.url;
  const basePrice = selectedVariant?.price ?? product.salePrice ?? product.regularPrice;
  const originalPrice = product.salePrice ? product.regularPrice : undefined;
  const discount = calcDiscount(product.regularPrice, product.salePrice);
  const stock = selectedVariant?.stock ?? product.stock ?? 0;
  const outOfStock = stock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    if (product.variants?.length && !selectedVariant) {
      toast.error('Please select a shade/option');
      return;
    }
    addItem(product, qty, selectedVariant || undefined);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push('/checkout');
  };

  return (
    <div className="container-shop py-6">
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          ...(product.categoryName && product.categoryId
            ? [{ label: product.categoryName, href: `/category/${product.categoryId}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images || []} name={product.name} />
        </div>

        {/* Info */}
        <div>
          {product.brandName && (
            <Link
              href={`/brand/${product.brandId}`}
              className="text-xs uppercase tracking-widest text-rose-600 font-medium"
            >
              {product.brandName}
            </Link>
          )}

          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating || 0} showValue count={product.reviewCount || 0} size={16} />
            {product.sku && (
              <span className="text-xs text-gray-400">SKU: {product.sku}</span>
            )}
          </div>

          {/* Price */}
          <div className="mt-4 flex items-end gap-3 flex-wrap">
            <span className="text-3xl font-bold text-rose-600">{formatBDT(basePrice)}</span>
            {originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatBDT(originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="danger">Save {discount}%</Badge>
            )}
          </div>

          {/* Status badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            {product.isBestSeller && <Badge variant="warning">Best Seller</Badge>}
            {product.isNewArrival && <Badge variant="info">New</Badge>}
            {outOfStock ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : (
              <Badge variant="success">In Stock ({stock})</Badge>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-5">
              <VariantSelector
                variants={product.variants}
                selectedId={selectedVariant?.id || null}
                onSelect={(v) => setSelectedVariant(v)}
              />
            </div>
          )}

          {/* Qty + Actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-11 w-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                disabled={qty <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                className="h-11 w-10 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
                disabled={qty >= stock}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:bg-gray-300"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>

            <button
              onClick={() => toggle(product.id)}
              className="h-11 w-11 rounded-lg border flex items-center justify-center hover:bg-rose-50"
              aria-label="Wishlist"
            >
              <Heart size={18} className={cn(inWishlist && 'fill-rose-500 text-rose-500')} />
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="mt-3 w-full h-11 rounded-lg border-2 border-rose-600 text-rose-600 text-sm font-semibold hover:bg-rose-50 disabled:opacity-40"
          >
            <Zap size={16} className="inline mr-1" /> Buy Now
          </button>

          {/* Trust */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-600">
            <div className="flex flex-col items-center text-center gap-1 p-2">
              <Truck size={16} className="text-rose-500" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 p-2">
              <ShieldCheck size={16} className="text-rose-500" />
              <span>100% Authentic</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 p-2">
              <RotateCcw size={16} className="text-rose-500" />
              <span>7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <ProductInfoTabs product={product} />
      </div>

      {/* Reviews */}
      <ReviewsSection productId={product.id} initialReviews={reviews} />

      {/* Related */}
      {related.length > 0 && (
        <ProductCarousel
          title="You may also like"
          products={related}
          viewAllHref={product.categoryId ? `/category/${product.categoryId}` : '/shop'}
        />
      )}
    </div>
  );
}