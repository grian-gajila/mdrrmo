import { ShieldDrawLoader } from '@/components/custom/loading';
import { FormLayouts } from '@/components/features/user-auth/form-layouts';
import { Forms } from '@/components/features/user-auth/forms';
import Link from 'next/link';
import { Suspense } from 'react';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-orange-50 items-center justify-center">
          <ShieldDrawLoader />
        </div>
      }
    >
      <div className="flex h-screen w-full overflow-hidden">
        <FormLayouts.SidePanel />
        <div className="flex w-full flex-col items-center h-screen justify-center overflow-y-auto bg-linear-to-b from-orange-100 to-white px-6 py-10 lg:w-1/2">
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg shadow-gray-100">
              <FormLayouts.FormHeader description=" Join the MDRRMO Volunteer Program" />

              <Forms.RegisterForm />
            </div>

            <p className="mt-5 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-semibold text-orange-500 hover:text-orange-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
