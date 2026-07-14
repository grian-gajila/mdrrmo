'use client';

import { Shared } from '@/components/shared';
import { Building2, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import navigation from '@/data/admin/navigation';
import { AdminPayload } from '@/lib/auth/admin-auth';

const Aside = ({ admin }: { admin: AdminPayload }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="absolute z-50 top-3 left-4 p-0">
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden "
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white shadow-xl transition-transform duration-300  md:static md:translate-x-0 lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Shared.Brand
          menuButton={
            <button
              className="rounded-lg p-2 text-gray-500 md:hidden hover:bg-gray-100 "
              onClick={() => setSidebarOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </button>
          }
          parentStyle="h-16 border-b border-gray-200 px-6"
        />

        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-300 to-orange-500 text-sm font-bold text-white">
              {admin.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-gray-800">
                {admin.displayName}
              </div>
              <div className="text-xs font-medium text-orange-500">
                {admin.role}
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
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
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

        <div className="absolute right-0 bottom-0 left-0 border-t border-gray-200 p-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Building2 className="h-3 w-3" />
            <span>MDRRMO Mansalay © 2026</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Aside;
