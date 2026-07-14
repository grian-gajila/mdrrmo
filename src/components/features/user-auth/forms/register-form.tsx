'use client';

import { Icons } from '@/constant/icons';
import { createClient } from '@/lib/supabase/client';
import { RegisterInput, registerSchema } from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const RegisterForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const supabase = await createClient();

      // 1. Sign up with Supabase — triggers confirmation email via Supabase settings
      //    We override the email template in Supabase to call our /api/auth/send-verification
      //    OR configure Supabase to use Resend as SMTP (recommended — see GUIDE.md)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`,
        },
      });

      if (authError) throw authError;

      // 2. Create volunteer profile row in our DB
      if (authData.user) {
        await fetch('/api/volunteer/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: authData.user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          }),
        });
      }

      // 3. Redirect to verify notice
      router.push('/auth/verify-email?email=' + encodeURIComponent(data.email));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const supabase = await createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    setIsGoogleLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">
            First Name <span className="text-red-400">*</span>
          </label>
          <input
            {...register('firstName')}
            placeholder="Juan"
            className={fieldCls}
          />
          {errors.firstName && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" /> {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">
            Last Name <span className="text-red-400">*</span>
          </label>
          <input
            {...register('lastName')}
            placeholder="dela Cruz"
            className={fieldCls}
          />
          {errors.lastName && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" /> {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          {...register('email')}
          placeholder="you@email.com"
          className={fieldCls}
        />
        {errors.email && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3 w-3" /> {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            {...register('password')}
            placeholder="Min. 8 characters"
            className={`${fieldCls} pr-10`}
          />
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" /> {errors.password.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:cursor-pointer hover:text-gray-600"
            aria-label="Toggle password visibility"
          >
            {showPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          Confirm Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder="Re-enter password"
            className={`${fieldCls} pr-10`}
          />
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />{' '}
              {errors.confirmPassword.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:cursor-pointer hover:text-gray-600"
            aria-label="Toggle password visibility"
          >
            {showConfirm ? (
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
        className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-200 transition-all duration-300 hover:cursor-pointer hover:bg-orange-400 disabled:bg-orange-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          'Create Account & Apply'
        )}
      </button>

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs font-medium text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <button
        type="button"
        disabled={isGoogleLoading}
        onClick={handleGoogleSignIn}
        className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 transition-colors hover:cursor-pointer hover:bg-gray-50"
      >
        <Icons.GoogleIcon />
        Sign up with Google
      </button>

      <p className="text-center text-xs leading-relaxed text-gray-400">
        By registering you agree to our{' '}
        <Link href="/terms" className="text-orange-500 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-orange-500 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
};

const fieldCls =
  'w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition';

export default RegisterForm;
