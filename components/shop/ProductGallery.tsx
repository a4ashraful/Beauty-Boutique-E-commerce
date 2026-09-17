'use client';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types';

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const sorted = [...(images || [])].sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return (a.order ?? 0) - (b.order ?? 0);
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const active = sorted[activeIdx];

  if (!sorted.length) {
    return (
      <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border">
        <Image
          src={active.url}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                'relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-lg overflow-hidden border-2 transition',
                i === activeIdx ? 'border-rose-500' : 'border-transparent hover:border-gray-300'
              )}
            >
              <Image src={img.url} alt={`${name} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}