import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Information',
    template: '%s | Beauty Boutique By Tandra',
  },
};

export default function StaticPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-shop py-6">
      {children}
    </div>
  );
}
