// src/app/auth/forgot-password/page.tsx
'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      // Supabase sends the reset email; we configured Resend as SMTP in dashboard
      // or handle the token in /api/auth/reset-email using Supabase's hook
      const { error } = await (
        await supabase
      ).auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error) throw error;

      setSentEmail(data.email);
      setSent(true);
    } catch {
      // Don't reveal if email exists — always show success for security
      setSentEmail(data.email);
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Check your inbox
        </h1>
        <p className="mb-4 text-sm text-gray-500">
          If an account exists for <strong>{sentEmail}</strong>, you will
          receive a password reset link shortly.
        </p>
        <p className="text-sm text-gray-400">
          Check your spam folder if you don&apos;t see it.
        </p>
        <Link
          href="/auth/login"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        Forgot password?
      </h1>
      <p className="mb-7 text-sm text-gray-500">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:opacity-70 transition-colors"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Sending reset link...' : 'Send Reset Link'}
        </button>
      </form>

      <Link
        href="/auth/login"
        className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </>
  );
}
