import { ApplicantsTable } from '@/components/admin/applicants-table';
import { getAdminSession } from '@/lib/auth/admin-auth';
import { db } from '@/lib/db';
import { volunteerApplications } from '@/lib/db/schema';
import { desc, eq, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');

  const statusFilter = searchParams.status as
    'pending' | 'under_review' | 'rejected' | undefined;

  const rows = await db
    .select()
    .from(volunteerApplications)
    .where(
      statusFilter
        ? eq(volunteerApplications.status, statusFilter)
        : ne(volunteerApplications.status, 'approved'),
    )
    .orderBy(desc(volunteerApplications.submittedAt));

  const counts = {
    all: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    under_review: rows.filter((r) => r.status === 'under_review').length,
    rejected: rows.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="w-full mb-10">
      <ApplicantsTable
        applicants={rows}
        counts={counts}
        currentStatus={statusFilter ?? 'all'}
      />
    </div>
  );
}
