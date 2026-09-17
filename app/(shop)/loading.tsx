import { ProductGridSkeleton } from '@/components/shop/ProductCardSkeleton';

export default function ShopLoading() {
  return (
    <div className="container-shop py-10">
      <div className="h-8 w-40 bg-gray-100 rounded mb-6 animate-pulse" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}