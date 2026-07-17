// src/app/auth/verify-email/page.tsx
'use client';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Mail, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [resending, setResending] = useState(false);

  const resendEmail = async () => {
    setResending(true);
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await (
        await supabase
      ).auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });
      if (error) throw error;
      toast.success('Verification email resent! Check your inbox.');
    } catch {
      toast.error('Failed to resend. Please try again in a few minutes.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="text-center items-center px-6">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
        <Mail className="h-8 w-8 text-orange-600" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Check your email
      </h1>
      <p className="mb-1 text-sm text-gray-500">
        We sent a verification link to
      </p>
      <p className="mb-6 font-semibold text-gray-900">
        {email || 'your email address'}
      </p>
      <p className="mb-8 text-sm leading-relaxed text-gray-500">
        Click the link in the email to verify your account. After verification,
        you can log in and start your volunteer application.
      </p>
      <div className="rounded-lg border border-orange-100 bg-orange-50 p-4 text-left text-sm text-orange-800">
        <p className="font-semibold">Didn&apos;t receive the email?</p>
        <ul className="mt-2 space-y-1 text-orange-700">
          <li>• Check your spam or junk folder</li>
          <li>• Make sure you used the right email</li>
          <li>• The link expires in 24 hours</li>
        </ul>
      </div>
      <button
        onClick={resendEmail}
        disabled={resending || !email}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
        {resending ? 'Resending...' : 'Resend verification email'}
      </button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-sm text-gray-500">Loading...</div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
