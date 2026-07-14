// src/components/auth/SignOutButton.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await (await supabase).auth.signOut();
    toast.success('Signed out successfully');
    router.push('/landing');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:block">Sign Out</span>
    </button>
  );
}
