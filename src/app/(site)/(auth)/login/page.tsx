'use client';
import { images } from '@/constant/images';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    router.push('/profile');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-linear-to-b from-orange-200 to-white px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-5 flex flex-col items-center">
          <div className="flex-2 items-center justify-center rounded-2xl">
            <Image src={images.logo} alt="LOGO" className="h-24 w-24" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-xs text-gray-400">
            Sign in to your MDRRMO Volunteer account
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-100">
          <div className="flex border-b border-gray-100">
            <span className="flex-1 border-b-2 border-orange-500 py-3 text-center text-sm font-bold text-orange-500">
              Sign In
            </span>
            <Link
              href="/register"
              className="flex-1 py-3 text-center text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600"
            >
              Create Account
            </Link>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 p-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm placeholder-gray-300 transition focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-orange-500 hover:text-orange-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 pr-10 text-sm placeholder-gray-300 transition focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label="Toggle password"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 accent-orange-500"
              />
              <span className="text-sm text-gray-500">Remember me</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-300 hover:cursor-pointer hover:bg-orange-300 hover:transition-all hover:duration-300 disabled:bg-orange-300"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs font-medium text-gray-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 transition-colors hover:cursor-pointer hover:bg-gray-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-orange-500 hover:text-orange-300"
          >
            Register here
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 transition-colors hover:text-gray-600"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
