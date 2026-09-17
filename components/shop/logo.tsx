import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { SITE } from '@/lib/constants';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="h-9 w-9 rounded-full bg-rose-600 text-white flex items-center justify-center">
        <Sparkles size={18} />
      </span>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display font-bold text-gray-900 text-[15px]">
            Beauty Boutique
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-rose-600 font-medium">
            By Tandra
          </p>
        </div>
      )}
    </Link>
  );
}
