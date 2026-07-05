'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { images } from '@/constant/images';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type MouseEvent } from 'react';

const NavBar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Image src={images.logo} alt="LOGO" className="h-10 w-10" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-orange-500">MDRRMO</p>
            <p className="mt-px text-[10px] text-gray-400">Volunteer Portal</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {['How It Works', 'Requirements', 'Contact'].map((label) => {
            const href = `#${label.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <a
                key={label}
                href={href}
                onClick={(event) => handleNavigate(event, href)}
                className="text-sm text-gray-500 transition-colors hover:text-orange-500"
              >
                {label}
              </a>
            );
          })}
        </nav>

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
              <div className="flex items-center gap-2.5 border-b border-gray-300 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  <Image src={images.logo} alt="LOGO" className="h-10 w-10" />
                </div>
                <div className="leading-none">
                  <p className="text-sm font-bold text-orange-500">MDRRMO</p>
                  <p className="mt-px text-[10px] text-gray-400">
                    Volunteer Portal
                  </p>
                </div>
              </div>
            </SheetHeader>
            <SheetDescription asChild>
              <div className="flex flex-col items-start gap-4 ">
                <div className="w-full px-4">
                  <nav className="flex flex-col items-start gap-4">
                    {['How It Works', 'Requirements', 'Contact'].map(
                      (label) => {
                        const href = `#${label.toLowerCase().replace(/\s+/g, '-')}`;
                        return (
                          <a
                            key={label}
                            href={href}
                            onClick={(event) => handleNavigate(event, href)}
                            className="text-sm text-gray-500 transition-colors hover:text-orange-500"
                          >
                            {label}
                          </a>
                        );
                      },
                    )}
                  </nav>
                </div>
                <div className="flex flex-col w-full items-center gap-2 pt-6 px-4 border-t border-gray-100">
                  <Link
                    href="/login"
                    className="round`ed-lg border rounded-lg text-center px-4 w-full py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg text-center bg-orange-500 w-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </SheetDescription>
            <SheetFooter>
              <div className="mt-10 border-t border-gray-300 pt-6 text-center text-xs text-gray-600">
                © {new Date().getFullYear()} MDRRMO. All rights reserved.
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex lg:flex items-center gap-2">
          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            className="round`ed-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push('/register')}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
