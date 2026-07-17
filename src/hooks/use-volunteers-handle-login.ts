import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { LoginInput, loginSchema } from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const UseHandleLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/profile';
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

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
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });
      setIsGoogleLoading(false);
    } catch (error) {
      toast.error(`Error: ${error}`);
      setIsGoogleLoading(false);
    }
  };

  return {
    showPass,
    setShowPass,
    isLoading,
    isGoogleLoading,
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleGoogleSignIn,
  };
};

export default UseHandleLogin;
