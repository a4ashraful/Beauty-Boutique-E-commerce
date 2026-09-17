import Image from 'next/image';
import Link from 'next/link';
import type { Banner } from '@/types';

export function PromoBanners({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;

  return (
    <section className="container-shop py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {banners.slice(0, 2).map((b) => (
          <Link
            key={b.id}
            href={b.buttonLink || '/shop'}
            className="group relative overflow-hidden rounded-2xl aspect-[16/7] md:aspect-[16/6]"
          >
            <Image
              src={b.image}
              alt={b.title || 'Promo'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center text-white max-w-[65%]">
              {b.title && (
                <h3 className="font-display text-xl md:text-3xl font-bold leading-snug">
                  {b.title}
                </h3>
              )}
              {b.subtitle && (
                <p className="mt-1.5 text-xs md:text-sm text-white/90">{b.subtitle}</p>
              )}
              {b.buttonText && (
                <span className="mt-3 inline-flex w-fit rounded-full bg-rose-600 px-4 py-2 text-xs font-medium">
                  {b.buttonText}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}