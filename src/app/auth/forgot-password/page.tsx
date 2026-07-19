// src/app/auth/forgot-password/page.tsx
'use client';

import useVolunteersForgotPassword from '@/hooks/use-volunteers-forgot-password';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const {
    isLoading,
    sent,
    register,
    handleSubmit,
    errors,
    onSubmit,
    getValues,
  } = useVolunteersForgotPassword();

  if (sent) {
    return (
      <div className="text-center items-center px-6">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
          <Mail className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Check your email
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          If an account exists for{' '}
          <span className="font-semibold text-gray-900">
            {getValues('email')}
          </span>
          , we&apos;ve sent a password reset link.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
        <KeyRound className="h-7 w-7 text-orange-600" />
      </div>
      <h1 className="mb-1 text-xl font-bold text-gray-900">
        Forgot your password?
      </h1>
      <p className="mb-6 text-sm text-gray-500">
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
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 disabled:opacity-70"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      </form>
    </div>
  );
}
