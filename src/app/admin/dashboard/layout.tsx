import Aside from '@/components/features/admin/layouts/aside';
import Header from '@/components/features/admin/layouts/header';
import { getAdminSession } from '@/lib/auth/admin-auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Aside admin={admin} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header admin={admin} />

        <main className="flex w-full h-screen overflow-auto">{children}</main>
      </div>
    </div>
  );
}
