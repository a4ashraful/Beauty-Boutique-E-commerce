import type { Metadata } from 'next';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ordering, shipping, payment and returns.',
  alternates: { canonical: '/pages/faq' },
};

const FAQS = [
  {
    q: 'Are your products 100% authentic?',
    a: 'Yes. Every product is sourced from authorized distributors or verified suppliers. We never sell replicas.',
  },
  {
    q: 'How do I place an order?',
    a: 'Browse our shop, add items to cart, and click Checkout. You can order as a guest — no account required.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Cash on Delivery, bKash (manual), Nagad (manual) and Bank Transfer. For bKash/Nagad, you send money and submit the Transaction ID — our team verifies manually.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Inside Dhaka: 1–2 days. Outside Dhaka: 2–4 days. Same-day delivery may be available in select Dhaka areas.',
  },
  {
    q: 'What is the delivery charge?',
    a: 'Inside Dhaka: ৳60. Outside Dhaka: ৳120. Free delivery on orders above ৳1500 inside Dhaka.',
  },
  {
    q: 'Can I return a product?',
    a: 'Yes — within 7 days of delivery, if unopened and in original packaging. See our Return & Refund Policy for details.',
  },
  {
    q: 'How do I track my order?',
    a: 'Go to Track Order and enter your Order Number and phone number. You can also track from your Account → Orders page.',
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes — COD is available across Bangladesh.',
  },
  {
    q: 'Is there a minimum order value?',
    a: 'No minimum. Order any amount.',
  },
  {
    q: 'What if I receive a damaged or wrong item?',
    a: `Contact us within 24 hours via ${SITE.supportPhone} or WhatsApp with photos. We'll resolve it.`,
  },
];

export default function FAQPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'FAQ' }]} />
      <div className="max-w-3xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-rose-500 mx-auto" />
        </div>

        <div className="rounded-xl border bg-white p-5">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="last:border-b-0">
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
