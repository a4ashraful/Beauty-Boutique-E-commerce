import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AuthForm } from '@/components/shop/AuthForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
