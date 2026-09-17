import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { SITE } from '@/lib/constants';

export function SocialSection() {
  if (!SITE.facebook && !SITE.instagram) return null;

  return (
    <section className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-12">
      <div className="container-shop text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold">
          Join Our Beauty Community
        </h2>
        <p className="mt-2 text-sm text-white/90 max-w-lg mx-auto">
          Follow us for exclusive offers, beauty tips, and new arrivals.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {SITE.facebook && (
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white text-rose-600 px-5 py-3 text-sm font-medium hover:bg-white/90"
            >
              <Facebook size={18} /> Like on Facebook
            </a>
          )}
          {SITE.instagram && (
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/40 px-5 py-3 text-sm font-medium hover:bg-white/20"
            >
              <Instagram size={18} /> Follow on Instagram
            </a>
          )}
          {SITE.whatsapp && (
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/40 px-5 py-3 text-sm font-medium hover:bg-white/20"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}