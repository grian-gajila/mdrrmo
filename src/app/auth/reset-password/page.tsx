// src/app/auth/reset-password/page.tsx
// Supabase redirects here after the user clicks the email link
// The URL contains #access_token and #type=recovery fragments
'use client';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    let isMounted = true;

    async function validateSession() {
      const supabase = await createSupabaseServerClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && isMounted) setValidSession(true);

      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY' && isMounted) setValidSession(true);
      });

      subscription = data.subscription;
    }

    validateSession();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await (
        await supabase
      ).auth.updateUser({
        password: data.password,
      });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to reset password.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Password updated!</h1>
        <p className="mt-3 text-sm text-gray-500">
          Redirecting you to sign in...
        </p>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-500">Validating your reset link...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        Create new password
      </h1>
      <p className="mb-7 text-sm text-gray-500">
        Choose a strong password for your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPass ? 'text' : 'password'}
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />{' '}
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:opacity-70 transition-colors"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Updating password...' : 'Update Password'}
        </button>
      </form>
    </>
  );
}
