import { ApplicationFormClient } from '@/components/volunteer/forms/application-form';
import { db } from '@/lib/db';
import { volunteerApplications, volunteerProfiles } from '@/lib/db/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function ApplyPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/apply');

  const profile = await db
    .select()
    .from(volunteerProfiles)
    .where(eq(volunteerProfiles.id, user.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

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

  const userData = profile
    ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      }
    : null;

  return (
    <ApplicationFormClient existingApplication={existing} userData={userData} />
  );
}
