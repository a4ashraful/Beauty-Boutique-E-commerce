'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PackageOpen } from 'lucide-react';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ProductGridSkeleton } from '@/components/shop/ProductCardSkeleton';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { MobileFilterSheet } from '@/components/shop/MobileFilterSheet';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { ActiveFilters } from '@/components/shop/ActiveFilters';
import { Pagination } from '@/components/shop/Pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { getAllActiveProducts } from '@/lib/firestore/products';
import { getCategories } from '@/lib/firestore/categories';
import { getBrands } from '@/lib/firestore/brands';
import { PAGE_SIZE } from '@/lib/constants';
import type { Product, Category, Brand } from '@/types';

const slugify = (s?: string) =>
  (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function ShopClient() {
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, c, b] = await Promise.all([
        getAllActiveProducts(500).catch((e) => {
          console.error('products load failed', e);
          return [] as Product[];
        }),
        getCategories().catch((e) => {
          console.error('categories load failed', e);
          return [] as Category[];
        }),
        getBrands().catch((e) => {
          console.error('brands load failed', e);
          return [] as Brand[];
        }),
      ]);
      setAllProducts(p);
      setCategories(c);
      setBrands(b);
      setLoading(false);
    })();
  }, []);

  // Highest price in the catalogue — drives the price slider ceiling so it
  // is no longer hardcoded to ৳5000 (products above that were unreachable).
  const maxCatalogPrice = useMemo(() => {
    if (!allProducts.length) return 0;
    return allProducts.reduce((max, p) => {
      const price = Number(p.salePrice ?? p.regularPrice) || 0;
      return price > max ? price : max;
    }, 0);
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = [...allProducts];

    const q = params.get('q');
    if (q) {
      const t = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.brandName?.toLowerCase().includes(t) ||
          p.sku?.toLowerCase().includes(t)
      );
    }

    const category = params.get('category');
    if (category) {
      const cat = categories.find((c) => c.slug === category || c.id === category);
      list = list.filter(
        (p) =>
          p.categoryId === category ||
          slugify(p.categoryName) === category ||
          (cat &&
            (p.categoryId === cat.id ||
              p.subcategoryId === cat.id ||
              slugify(p.categoryName) === cat.slug))
      );
    }

    // Brand filter: match by brandId, brand slug, or slugified brand name so
    // it works no matter how the product was saved in the admin panel.
    const brandParam = params.get('brand');
    if (brandParam) {
      const slugs = brandParam.split(',').filter(Boolean);
      const idsForSlugs = new Set(
        brands.filter((b) => slugs.includes(b.slug)).map((b) => b.id)
      );
      list = list.filter(
        (p) =>
          (p.brandId && idsForSlugs.has(p.brandId)) ||
          slugs.includes(slugify(p.brandName))
      );
    }

    const skinType = params.get('skinType');
    if (skinType) list = list.filter((p) => p.skinTypes?.includes(skinType));

    const concern = params.get('skinConcern');
    if (concern) list = list.filter((p) => p.skinConcerns?.includes(concern));

    const minParam = params.get('min');
    const maxParam = params.get('max');
    const min = minParam ? Number(minParam) : 0;
    const max = maxParam ? Number(maxParam) : Infinity;
    if (min > 0 || max < Infinity) {
      list = list.filter((p) => {
        const price = Number(p.salePrice ?? p.regularPrice) || 0;
        return price >= min && price <= max;
      });
    }

    if (params.get('sale') === '1') {
      list = list.filter((p) => p.salePrice && p.salePrice < p.regularPrice);
    }

    if (params.get('inStock') === '1') {
      list = list.filter((p) => (p.stock ?? 0) > 0);
    }

    const rating = Number(params.get('rating') || 0);
    if (rating) list = list.filter((p) => (p.rating ?? 0) >= rating);

    // Sort
    const sort = params.get('sort') || 'newest';
    list.sort((a, b) => {
      const pa = Number(a.salePrice ?? a.regularPrice) || 0;
      const pb = Number(b.salePrice ?? b.regularPrice) || 0;
      switch (sort) {
        case 'price-asc': return pa - pb;
        case 'price-desc': return pb - pa;
        case 'best-selling': return (b.soldCount || 0) - (a.soldCount || 0);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        default:
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      }
    });

    return list;
  }, [allProducts, params, brands, categories]);

  const page = Math.max(1, Number(params.get('page') || 1));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < filtered.length;

  return (
    <div className="container-shop py-6 lg:py-10">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            {params.get('q') ? `Search: "${params.get('q')}"` : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${filtered.length} products found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MobileFilterSheet
            categories={categories}
            brands={brands}
            maxPrice={maxCatalogPrice}
          />
          <SortDropdown />
        </div>
      </div>

      <ActiveFilters />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <ProductFilters
              categories={categories}
              brands={brands}
              maxPrice={maxCatalogPrice}
            />
          </div>
        </aside>

        <div>
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : paginated.length === 0 ? (
            <EmptyState
              icon={PackageOpen}
              title="No products found"
              description="Try removing some filters or search for something else."
              actionText="Clear Filters"
              actionHref="/shop"
            />
          ) : (
            <>
              <ProductGrid products={paginated} />
              <Pagination currentPage={page} hasMore={hasMore} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
