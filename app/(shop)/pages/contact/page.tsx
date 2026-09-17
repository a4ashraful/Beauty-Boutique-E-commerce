import type { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle, Facebook } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our team for any questions or support.',
  alternates: { canonical: '/pages/contact' },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-gray-500 text-sm">
            We're here to help — 7 days a week
          </p>
          <div className="mt-3 h-1 w-16 rounded-full bg-rose-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`tel:${SITE.supportPhone}`}
            className="rounded-xl border bg-white p-6 hover:border-rose-300 transition"
          >
            <span className="h-11 w-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Phone size={18} />
            </span>
            <p className="mt-3 font-semibold text-sm">Call Us</p>
            <p className="text-xs text-gray-500 mt-0.5">{SITE.supportPhone}</p>
            <p className="text-xs text-gray-400 mt-1">Sat–Thu, 10 AM – 8 PM</p>
          </a>

          <a
            href={`mailto:${SITE.supportEmail}`}
            className="rounded-xl border bg-white p-6 hover:border-rose-300 transition"
          >
            <span className="h-11 w-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mail size={18} />
            </span>
            <p className="mt-3 font-semibold text-sm">Email Us</p>
            <p className="text-xs text-gray-500 mt-0.5 break-all">{SITE.supportEmail}</p>
            <p className="text-xs text-gray-400 mt-1">Replies within 24h</p>
          </a>

          {SITE.whatsapp && (
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border bg-white p-6 hover:border-rose-300 transition"
            >
              <span className="h-11 w-11 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <MessageCircle size={18} />
              </span>
              <p className="mt-3 font-semibold text-sm">WhatsApp</p>
              <p className="text-xs text-gray-500 mt-0.5">{SITE.whatsapp}</p>
              <p className="text-xs text-gray-400 mt-1">Fastest reply</p>
            </a>
          )}

          {SITE.facebook && (
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border bg-white p-6 hover:border-rose-300 transition"
            >
              <span className="h-11 w-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Facebook size={18} />
              </span>
              <p className="mt-3 font-semibold text-sm">Facebook</p>
              <p className="text-xs text-gray-500 mt-0.5">Message us on Facebook</p>
              <p className="text-xs text-gray-400 mt-1">Also see latest updates</p>
            </a>
          )}
        </div>

        <div className="mt-6 rounded-xl border bg-rose-50/40 p-6 text-center">
          <MapPin className="mx-auto text-rose-600" size={22} />
          <p className="mt-2 font-semibold text-sm">Visit Our Office</p>
          <p className="text-xs text-gray-600 mt-1">
            Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </>
  );
}
