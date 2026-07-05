'use client';

import { Shared } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type MouseEvent } from 'react';

const mockUser = {
  name: 'Juan dela Cruz',
  email: 'juan@email.com',
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathName = usePathname();
  const isAuthenticated = pathName === '/profile';

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    setIsOpen(false);

    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);

    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      window.location.hash = href;
    }

    window.history.pushState(null, '', href);
  };

  return (
    <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md px-6">
      <div className="mx-auto flex py-5 max-w-6xl items-center justify-between">
        <Shared.Brand />

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-gray-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-red-500 text-xs font-bold text-white">
                  {mockUser.name.charAt(0)}
                </div>
                <span className="hidden text-sm font-semibold text-gray-700 sm:block">
                  {mockUser.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {menuOpen && (
                <div className="absolute top-11 right-0 z-50 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  <div className="border-b border-gray-50 px-4 py-3">
                    <p className="truncate text-xs font-bold text-gray-900">
                      {mockUser.name}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {mockUser.email}
                    </p>
                  </div>
                  <button className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <NavItems
              onClick={(event, href) => handleNavigate(event, href)}
              navStyle="hidden items-center gap-8 md:flex"
            />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="lg:hidden md:hidden"
                >
                  <Menu className="h-5 w-5 text-gray-500" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <Shared.Brand />
                </SheetHeader>
                <SheetDescription asChild>
                  <div className="flex flex-col items-start gap-4 ">
                    <div className="w-full px-4">
                      <NavItems
                        onClick={(event, href) => handleNavigate(event, href)}
                        navStyle="flex flex-col items-start gap-4"
                      />
                    </div>
                    <AuthButton
                      parentStyle="flex flex-col w-full pt-6 px-4 border-t border-gray-100"
                      link1="border w-full rounded-lg text-center"
                      link2="w-full text-center"
                    />
                  </div>
                </SheetDescription>
                <SheetFooter>
                  <Shared.CopyRight />
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <AuthButton parentStyle="hidden md:flex lg:flex" />
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;

interface Props {
  parentStyle?: string;
  link1?: string;
  link2?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  navStyle?: string;
}

const AuthButton = ({ parentStyle, link1, link2 }: Props) => {
  return (
    <div className={` items-center gap-2 ${parentStyle}`}>
      <Link
        href="/login"
        className={` px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500 ${link1}`}
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className={`rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 ${link2}`}
      >
        Apply Now
      </Link>
    </div>
  );
};

const NavItems = ({ onClick, navStyle }: Props) => {
  return (
    <nav className={navStyle}>
      {['How It Works', 'Requirements', 'Contact'].map((label) => {
        const href = `#${label.toLowerCase().replace(/\s+/g, '-')}`;
        return (
          <a
            key={label}
            href={href}
            onClick={(event) => onClick?.(event, href)}
            className="text-sm text-gray-500 transition-colors hover:text-orange-500"
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
};
