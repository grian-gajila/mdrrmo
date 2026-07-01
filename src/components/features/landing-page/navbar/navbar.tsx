import { images } from '@/constant/images';
import Image from 'next/image';
import Link from 'next/link';

const NavBar = () => {
  return (
    <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Image src={images.logo} alt="LOGO" className="h-10 w-10" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-orange-500">MDRRMO</p>
            <p className="mt-px text-[10px] text-gray-400">Volunteer Portal</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 sm:flex">
          {['How It Works', 'Requirements', 'Contact'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-gray-500 transition-colors hover:text-orange-500"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-orange-500"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
