'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Banner } from '@/types';

export function HeroBanner({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const n = banners.length;

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);

  if (!n) {
    // fallback hero
    return (
      <section className="relative h-[60vh] min-h-[420px] max-h-[640px] bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 flex items-center">
        <div className="container-shop text-center md:text-left">
          <p className="text-rose-600 font-medium tracking-widest uppercase text-xs mb-3">
            Beauty Boutique By Tandra
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 max-w-2xl leading-tight">
            Glow With <span className="text-rose-600">Confidence</span> — Authentic Beauty, Delivered.
          </h1>
          <p className="mt-4 text-gray-600 max-w-xl">
            Bangladesh's trusted destination for skincare, makeup, and haircare essentials.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-rose-600 px-6 py-3 text-white text-sm font-medium hover:bg-rose-700"
            >
              Shop Now
            </Link>
            <Link
              href="/category/skincare"
              className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium hover:bg-gray-50"
            >
              Explore Skincare
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[60vh] min-h-[420px] max-h-[640px] overflow-hidden bg-gray-100">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          )}
        >
          <Image
            src={b.image}
            alt={b.title || 'Banner'}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="relative container-shop h-full flex items-center">
            <div className="max-w-2xl text-white">
              {b.title && (
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {b.title}
                </h1>
              )}
              {b.subtitle && (
                <p className="mt-4 text-white/90 text-sm md:text-base max-w-lg">{b.subtitle}</p>
              )}
              {b.buttonText && b.buttonLink && (
                <Link
                  href={b.buttonLink}
                  className="mt-6 inline-flex rounded-full bg-rose-600 px-6 py-3 text-sm font-medium hover:bg-rose-700"
                >
                  {b.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {n > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + n) % n)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % n)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === idx ? 'w-8 bg-white' : 'w-2 bg-white/60'
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}