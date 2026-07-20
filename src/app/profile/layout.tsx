import { SignOutButton } from '@/components/auth/sign-out-button';
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
import { ChevronDown, FileText, Home, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const nav = [
  { href: '/profile', label: 'My Profile', icon: User, exact: true },
  {
    href: '/profile/apply',
    label: 'My Application',
    icon: FileText,
    exact: false,
  },
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
      <div className="sticky px-6 md:px-4 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md ">
        <div className="mx-auto flex py-5 max-w-6xl items-center justify-between">
          <Shared.Brand />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:cursor-pointer">
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
              <DropdownMenuContent className="rounded-xl max-w-xl p-4 hover:bg-none bg-gray-50">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem className="hover:bg-none">
                    <div className="flex flex-col border-b  border-gray-50">
                      <p className="truncate text-lg font-bold text-gray-900">
                        {profile
                          ? `${profile.firstName} ${profile.lastName}`
                          : user.email}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {profile
                          ? `${profile.firstName} ${profile.lastName}`
                          : user.email}
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="block md:hidden" />
                  <DropdownMenuItem className="mt-6 block md:hidden">
                    <div className="w-full">
                      <SignOutButton />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl md:px-4 px-6 py-6 md:py-4 lg:flex lg:gap-8">
        <aside className="mb-6 lg:mb-0 lg:w-64 lg:shrink-0">
          <div className="mb-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col items-center text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-linear-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white">
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

          <nav className="rounded-lg border border-gray-100 bg-white p-2 shadow-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 shrink-0" />
              Back to Home
            </Link>
          </nav>
          <div className="py-6 md:block hidden">
            <SignOutButton />
          </div>
        </aside>
        {children}
      </div>
    </div>
  );
}
