import { Shared } from '@/components/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { db } from '@/lib/db';
import { volunteerApplications, volunteerProfiles } from '@/lib/db/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { eq } from 'drizzle-orm';
import { Bell, ChevronDown, FileText, Home, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const nav = [
  { href: '/profile', label: 'My Profile', icon: User, exact: true },
  { href: '/apply', label: 'My Application', icon: FileText, exact: false },
];

export default async function DisplayLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const profile = await db
    .select()
    .from(volunteerProfiles)
    .where(eq(volunteerProfiles.id, user.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  // Load application status
  const application = await db
    .select({ status: volunteerApplications.status })
    .from(volunteerApplications)
    .where(eq(volunteerApplications.volunteerId, user.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    under_review: 'bg-blue-100 text-blue-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="h-screen w-full items-center justify-center">
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md px-6">
        <div className="mx-auto flex py-5 max-w-6xl items-center justify-between">
          <Shared.Brand />

          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-gray-100">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-red-500 text-xs font-bold text-white">
                    {profile?.firstName?.charAt(0) ??
                      user.email?.charAt(0).toLocaleUpperCase()}
                  </div>
                  <span className="hidden text-sm font-semibold text-gray-700 sm:block">
                    {profile
                      ? `${profile.firstName} ${profile.lastName}`
                      : user.email}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <div className="border-b border-gray-50 px-4 py-3">
                      <p className="truncate text-xs font-bold text-gray-900">
                        {profile
                          ? `${profile.firstName} ${profile.lastName}`
                          : user.email}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:flex lg:gap-8">
        {/* Sidebar */}
        <aside className="mb-6 lg:mb-0 lg:w-64 lg:shrink-0">
          {/* Profile card */}
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col items-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white">
                {profile?.firstName?.charAt(0) ??
                  user.email?.charAt(0).toUpperCase()}
              </div>
              <p className="font-bold text-gray-900">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : user.email}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{user.email}</p>
              {application && (
                <span
                  className={`mt-2 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[application.status]}`}
                >
                  {application.status
                    .replace('_', ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              )}
              {!application && (
                <Link
                  href="/profile/apply"
                  className="mt-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 hover:bg-orange-200 transition-colors"
                >
                  Apply Now →
                </Link>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/landing"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 shrink-0" />
              Back to Home
            </Link>
          </nav>
        </aside>
        {children}
      </div>
    </div>
  );
}
