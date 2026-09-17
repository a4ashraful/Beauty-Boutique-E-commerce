'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  resetPassword,
} from '@/hooks/useAuthActions';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/account';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgotMode) {
        await resetPassword(email);
        toast.success('Password reset link sent. Check your email.');
        setForgotMode(false);
        setLoading(false);
        return;
      }
      if (mode === 'register') {
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, name);
        toast.success('Welcome!');
      } else {
        await loginWithEmail(email, password);
        toast.success('Welcome back!');
      }
      router.push(redirect);
    } catch (e: any) {
      const msg = mapErr(e.code) || e.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google');
      router.push(redirect);
    } catch (e: any) {
      const msg = mapErr(e.code) || e.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            {forgotMode
              ? 'Reset Password'
              : mode === 'register'
              ? 'Create Account'
              : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {forgotMode
              ? 'Enter your email and we’ll send you a reset link.'
              : mode === 'register'
              ? 'Join our beauty community today.'
              : 'Sign in to continue shopping.'}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && !forgotMode && (
              <div>
                <Label>Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                  required
                />
              </div>
            )}

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
                required
              />
            </div>

            {!forgotMode && (
              <div>
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Toggle password"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Please wait…
                </>
              ) : forgotMode ? (
                'Send Reset Link'
              ) : mode === 'register' ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {!forgotMode && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={google}
                disabled={loading}
                className="w-full h-11 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </>
          )}

          {forgotMode && (
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="mt-4 w-full text-xs text-gray-500 hover:text-rose-600"
            >
              ← Back to Sign In
            </button>
          )}
        </div>

        {!forgotMode && (
          <p className="mt-6 text-center text-sm text-gray-600">
            {mode === 'register' ? (
              <>
                Already have an account?{' '}
                <Link href="/login" className="text-rose-600 font-medium">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New customer?{' '}
                <Link href="/register" className="text-rose-600 font-medium">
                  Create an account
                </Link>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function mapErr(code: string): string | null {
  const map: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-not-found': 'No account with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/weak-password': 'Password too weak (min 6 characters).',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'auth/invalid-email': 'Invalid email address.',
  };
  return map[code] || null;
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.4 29.6 35 24 35c-6 0-11-5-11-11s5-11 11-11c2.8 0 5.4 1 7.4 2.8l5.7-5.7C33.9 6.9 29.2 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19c0-1.3-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c2.8 0 5.4 1 7.4 2.8l5.7-5.7C33.9 6.9 29.2 5 24 5 16.3 5 9.7 9.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43c5 0 9.6-1.9 13-5.1l-6-5c-2 1.4-4.5 2.1-7 2.1-5.5 0-10.2-3.7-11.8-8.7l-6.5 5C9.2 38 16 43 24 43z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6 5c4-3.6 6.8-9.1 6.8-15.3 0-1.3-.1-2.3-.4-3.5z"/>
    </svg>
  );
}