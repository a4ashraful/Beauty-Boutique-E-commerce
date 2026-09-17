import { Header } from '@/components/shop/Header';
import { Footer } from '@/components/shop/Footer';
import { WhatsAppButton } from '@/components/shop/WhatsAppButton';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
