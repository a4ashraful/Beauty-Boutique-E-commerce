'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'rating', label: 'Highest Rated' },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get('sort') || 'newest';

  const handleChange = (v: string) => {
    const next = new URLSearchParams(params.toString());
    next.set('sort', v);
    next.delete('page');
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-sm text-gray-500">Sort:</span>
      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORTS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}