'use client';

import { AdminPayload } from '@/types';
import { ChevronDown, LogOut, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const Header = ({ admin }: { admin: AdminPayload }) => {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    toast.success('Logged out');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-4 lg:px-6">
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search volunteers, applicants..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
            }}
            className="flex items-center gap-2 hover:cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-500 text-xs font-bold text-white">
              {admin.displayName.charAt(0)}
            </div>
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {admin.displayName}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
          </button>
          {userMenuOpen && (
            <div className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl">
              <div className="p-1">
                <Link
                  href="/admin/dashboard/settings"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
