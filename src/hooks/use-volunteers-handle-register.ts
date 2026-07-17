import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { RegisterInput, registerSchema } from '@/lib/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const useVolunteersHandleRegister = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();

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
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
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
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    setIsGoogleLoading(false);
  };

  return {
    showConfirm,
    setShowConfirm,
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

export default useVolunteersHandleRegister;
