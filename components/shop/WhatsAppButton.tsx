'use client';
import { MessageCircle } from 'lucide-react';
import { SITE } from '@/lib/constants';

export function WhatsAppButton() {
  if (!SITE.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition"
    >
      <MessageCircle size={22} />
    </a>
  );
}