'use client';

import { AdminPayload } from '@/lib/auth/admin-auth';
import { Bell, ChevronDown, LogOut, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const Header = ({ admin }: { admin: AdminPayload }) => {
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
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
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
            }}
            className="relative rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500"></span>
          </button>
          {notifOpen && (
            <div className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <span className="text-sm font-semibold text-gray-900">
                  Notifications
                </span>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-500">
                  3 new
                </span>
              </div>
              {[
                {
                  title: 'New volunteer application',
                  time: '2 min ago',
                  desc: 'Juan dela Cruz submitted an application',
                  dot: 'bg-blue-500',
                },
                {
                  title: 'Accreditation request',
                  time: '1 hour ago',
                  desc: 'Red Cross submitted for accreditation review',
                  dot: 'bg-orange-500',
                },
                {
                  title: 'Training scheduled',
                  time: '3 hours ago',
                  desc: 'Basic Life Support training on June 25',
                  dot: 'bg-green-500',
                },
              ].map((n, i) => (
                <div
                  key={i}
                  className="cursor-pointer border-b border-gray-50 px-4 py-3 last:border-0 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {n.title}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-gray-500">
                        {n.desc}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
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
            <div className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="p-1">
                <Link
                  href="/admin/dashboard/settings"
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
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
