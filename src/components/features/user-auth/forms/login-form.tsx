'use client';

import { Icons } from '@/constant/icons';
import { createClient } from '@/lib/supabase/client';
import { LoginInput, loginSchema } from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/profile';
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await (
        await supabase
      ).auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email first. Check your inbox.');
          router.push(
            '/auth/verify-email?email=' + encodeURIComponent(data.email),
          );
          return;
        }
        throw error;
      }

      toast.success('Welcome back!');
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const supabase = createClient();
    await (
      await supabase
    ).auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          {...register('email')}
          className={fieldCls}
        />
        {errors.email && (
          <p className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" /> {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700">
            Password
          </label>
          <Link
            href="/auth/forgot-password"
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
            {...register('password')}
            className={fieldCls}
          />
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" /> {errors.password.message}
            </p>
          )}
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

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-300 hover:cursor-pointer hover:bg-orange-400 disabled:bg-orange-300"
      >
        {isLoading ? (
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
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 transition-colors hover:cursor-pointer hover:bg-gray-50"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.GoogleIcon />
        )}
        Continue with Google
      </button>
    </form>
  );
};

const fieldCls =
  'w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition';

export default LoginForm;
