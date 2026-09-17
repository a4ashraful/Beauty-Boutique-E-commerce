import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthForm } from '@/components/shop/AuthForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Beauty Boutique By Tandra account.',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
