'use client';
import { SlidersHorizontal } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { ProductFilters } from './ProductFilters';
import type { Brand, Category } from '@/types';

export function MobileFilterSheet({
  categories,
  brands,
  maxPrice,
}: {
  categories: Category[];
  brands: Brand[];
  maxPrice?: number;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-lg border px-3 h-9 text-sm lg:hidden">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:max-w-sm overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <ProductFilters categories={categories} brands={brands} maxPrice={maxPrice} />
      </SheetContent>
    </Sheet>
  );
}
