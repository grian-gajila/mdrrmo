import { LoginInput, loginSchema } from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useVolunteersHandleLogin = () => {
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Please verify your email first. Check your inbox.');
          router.push(
            '/auth/verify-email?email=' +
              encodeURIComponent(json.email ?? data.email),
          );
          return;
        }
        toast.error(json.error ?? 'Invalid email or password.');
        return;
      }

      toast.success('Welcome back!');
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await fetch('/api/auth/google');
      const json = await res.json();
      if (res.ok && json.url) {
        window.location.href = json.url;
      } else {
        toast.error(json.error ?? 'Could not start Google sign-in.');
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error('Network error. Please try again.');
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

export default useVolunteersHandleLogin;
