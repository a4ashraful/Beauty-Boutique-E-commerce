import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getCategories } from '@/lib/firestore/categories';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { EmptyState } from '@/components/ui/empty-state';
import { Sparkles } from 'lucide-react';

// Firestore data is read at request time. Without this, Next.js statically
// prerendered this page at build time and froze whatever the build saw —
// so newly added brands/categories/products never appeared until the next
// deploy (and appeared as empty if the build hit a Firestore error).
export const revalidate = 60;


export const metadata: Metadata = {
  title: 'All Categories',
  description: 'Explore our full range of beauty categories.',
  alternates: { canonical: '/categories' },
};

export default async function CategoriesPage() {
  const cats = await getCategories().catch(() => []);
  const roots = cats.filter((c) => !c.parentId);

  return (
    <div className="container-shop py-6">
      <Breadcrumbs items={[{ label: 'Categories' }]} />
      <h1 className="font-display text-3xl font-bold mt-6 mb-2">All Categories</h1>
      <p className="text-sm text-gray-500 mb-8">Browse our curated collections</p>

      {roots.length === 0 ? (
        <EmptyState icon={Sparkles} title="No categories yet" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {roots.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group rounded-xl border bg-white overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative aspect-[4/3] bg-rose-50">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-rose-400 font-display font-bold text-3xl">
                    {c.name[0]}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold group-hover:text-rose-600">{c.name}</h3>
                {c.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
