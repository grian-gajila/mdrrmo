// src/components/auth/SignOutButton.tsx
'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 py-2 w-full hover:cursor-pointer rounded-lg px-3 text-sm font-medium border transition-all duration-300 bg-red-50 hover:bg-red-100 border-red-500 hover:transition-all hover:duration-300"
    >
      <LogOut className="h-4 w-4 text-red-500" />
      <span className="text-red-500">Sign Out</span>
    </button>
  );
}
