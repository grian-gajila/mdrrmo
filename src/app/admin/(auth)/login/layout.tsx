import { Suspense } from 'react';

export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="">
      <Suspense>{children}</Suspense>
    </div>
  );
}
