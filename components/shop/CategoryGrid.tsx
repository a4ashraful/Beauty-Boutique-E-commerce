import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/section-title';
import type { Category } from '@/types';

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <section className="container-shop py-10">
      <SectionTitle
        title="Shop by Category"
        subtitle="Find exactly what your skin needs"
        center
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="group flex flex-col items-center text-center"
          >
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full overflow-hidden bg-rose-50 ring-1 ring-rose-100 group-hover:ring-rose-300 transition">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="120px"
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-rose-400 font-display font-bold text-xl">
                  {c.name[0]}
                </div>
              )}
            </div>
            <p className="mt-3 text-xs sm:text-sm font-medium text-gray-800 group-hover:text-rose-600">
              {c.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}