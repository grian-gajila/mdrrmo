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

  const onSubmit = async (inputData: RegisterInput) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email: inputData.email,
        password: inputData.password,
        options: {
          data: {
            first_name: inputData.firstName,
            last_name: inputData.lastName,
          },
          // emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email`,
        },
      });
      console.log(data);
      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
      setIsLoading(false);
      router.push(
        '/auth/verify-email?email=' + encodeURIComponent(inputData.email),
      );
    } catch {
      toast.error('Network error. Please check your connection and try again.');
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
    } catch {
      toast.error('Network error. Please try again.');
      setIsGoogleLoading(false);
    }
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
