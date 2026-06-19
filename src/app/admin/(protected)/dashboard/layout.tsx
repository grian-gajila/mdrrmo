'use client';
import { images } from '@/constant/images';
import {
  Bell,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  UserCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Applicants', href: '/admin/dashboard/applicants', icon: Users },
  {
    name: 'Announcements',
    href: '/admin/dashboard/announcements',
    icon: Megaphone,
  },
  {
    name: 'Hired Volunteers',
    href: '/admin/dashboard/volunteers',
    icon: UserCheck,
  },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
          <div className="flex shrink-0 items-center justify-center">
            <Image src={images.logo} alt="LOGO" className="h-10 w-10" />
          </div>
          <div className="min-w-0">
            <div className="text-sm leading-tight font-bold text-orange-500">
              MDRRMO
            </div>
            <div className="truncate text-xs text-gray-500">
              Volunteer Management
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-orange-300 to-orange-500 text-sm font-bold text-white">
              A
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-gray-800">
                Admin User
              </div>
              <div className="text-xs font-medium text-orange-500">
                Administrator
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-0.5 px-3 pt-2">
          <p className="px-3 py-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Main Menu
          </p>
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}
                  style={{ width: '18px', height: '18px' }}
                />
                <span>{item.name}</span>
                {item.name === 'Applicants' && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${active ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-500'}`}
                  >
                    11
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 p-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Building2 className="h-3 w-3" />
            <span>MDRRMO Mansalay © 2026</span>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-4 lg:px-6">
          <button
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
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
                          <div className="mt-1 text-xs text-gray-400">
                            {n.time}
                          </div>
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
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-gray-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-400 to-orange-500 text-xs font-bold text-white">
                  A
                </div>
                <span className="hidden text-sm font-medium text-gray-700 sm:block">
                  Admin
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
                    <Link
                      href="/admin/login"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
