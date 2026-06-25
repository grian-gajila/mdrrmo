'use client';
import CustomUi from '@/components/custom/site';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CustomUi.AuthSidePanel />
      <div className="flex w-full flex-col items-center justify-center bg-linear-to-b from-orange-100 to-white px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg shadow-gray-100">
            <CustomUi.AuthHeader description=" Sign in to your volunteer account" />
            <CustomUi.LoginForm />
          </div>

          <p className="mt-5 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-orange-500 hover:text-orange-300"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
