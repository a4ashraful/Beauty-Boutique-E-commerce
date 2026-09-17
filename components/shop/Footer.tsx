import Link from 'next/link';
import {
  Facebook, Instagram, Phone, Mail, MapPin, Send, MessageCircle,
} from 'lucide-react';
import { Logo } from './Logo';
import { SITE } from '@/lib/constants';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Skincare', href: '/category/skincare' },
    { label: 'Makeup', href: '/category/makeup' },
    { label: 'Hair Care', href: '/category/hair-care' },
    { label: 'Brands', href: '/brands' },
  ],
  help: [
    { label: 'Track Order', href: '/track-order' },
    { label: 'Delivery Info', href: '/pages/delivery' },
    { label: 'Returns & Refunds', href: '/pages/return-policy' },
    { label: 'FAQ', href: '/pages/faq' },
    { label: 'Contact Us', href: '/pages/contact' },
  ],
  company: [
    { label: 'About Us', href: '/pages/about' },
    { label: 'Privacy Policy', href: '/pages/privacy' },
    { label: 'Terms & Conditions', href: '/pages/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-gray-300">
      <div className="container-shop py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="[&_p]:text-white [&_p:last-child]:text-rose-400">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Bangladesh's trusted destination for authentic beauty products.
            Curated with love, delivered to your door.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SITE.facebook && (
              <a href={SITE.facebook} target="_blank" rel="noopener"
                className="h-9 w-9 rounded-full bg-gray-800 hover:bg-rose-600 flex items-center justify-center">
                <Facebook size={16} />
              </a>
            )}
            {SITE.instagram && (
              <a href={SITE.instagram} target="_blank" rel="noopener"
                className="h-9 w-9 rounded-full bg-gray-800 hover:bg-rose-600 flex items-center justify-center">
                <Instagram size={16} />
              </a>
            )}
            {SITE.whatsapp && (
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener"
                className="h-9 w-9 rounded-full bg-gray-800 hover:bg-rose-600 flex items-center justify-center">
                <MessageCircle size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Shop</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-rose-400">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Help</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.help.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-rose-400">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={14} className="mt-1 shrink-0 text-rose-400" />
              <a href={`tel:${SITE.supportPhone}`} className="hover:text-rose-400">
                {SITE.supportPhone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="mt-1 shrink-0 text-rose-400" />
              <a href={`mailto:${SITE.supportEmail}`} className="hover:text-rose-400 break-all">
                {SITE.supportEmail}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-1 shrink-0 text-rose-400" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800">
        <div className="container-shop py-8">
          <form className="max-w-xl mx-auto text-center">
            <h4 className="text-white font-semibold mb-2">Get exclusive offers</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for new arrivals and beauty tips. No spam.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 h-11 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium flex items-center gap-2"
              >
                <Send size={14} /> Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="container-shop py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Payment:</span>
            <span className="text-gray-400">Cash on Delivery · bKash · Nagad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}