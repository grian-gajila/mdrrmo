// src/app/apply/page.tsx
// Protected — requires volunteer to be logged in
import { ApplicationFormClient } from '@/components/volunteer/application-form';
import { db } from '@/lib/db';
import { volunteerApplications } from '@/lib/db/schema';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function ApplyPage() {
  const supabase = await getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/apply');

  // Check if already submitted
  const existing = await db
    .select({
      id: volunteerApplications.id,
      status: volunteerApplications.status,
      submittedAt: volunteerApplications.submittedAt,
    })
    .from(volunteerApplications)
    .where(eq(volunteerApplications.volunteerId, user.id))
    .limit(1)
    .then((r) => r[0] ?? null);

  return <ApplicationFormClient existingApplication={existing} />;
}
