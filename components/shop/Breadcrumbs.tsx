import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-500 flex-wrap">
      <Link href="/" className="hover:text-rose-600">Home</Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} />
          {c.href ? (
            <Link href={c.href} className="hover:text-rose-600">{c.label}</Link>
          ) : (
            <span className="text-gray-700 font-medium truncate max-w-[180px]">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}