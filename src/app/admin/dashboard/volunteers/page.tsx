import { VerifiedVolunteersClient } from '@/components/admin/verified-volunteers-client';
import { getAdminSession } from '@/lib/auth/admin-auth';
import { db } from '@/lib/db';
import {
  hiredVolunteers,
  volunteerApplications,
  volunteerProfiles,
} from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function HiredVolunteersPage() {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');

  const rows = await db
    .select({
      id: hiredVolunteers.id,
      avatar: volunteerApplications.photoUrl,
      role: hiredVolunteers.role,
      status: hiredVolunteers.status,
      hiredAt: hiredVolunteers.hiredAt,
      deploymentCount: hiredVolunteers.deploymentCount,
      trainings: hiredVolunteers.trainings,
      firstName: volunteerProfiles.firstName,
      middleName: volunteerApplications.middleName,
      lastName: volunteerProfiles.lastName,
      email: volunteerProfiles.email,
      contactNumber: volunteerApplications.contactNumber,
      sitio: volunteerApplications.sitio,
      barangay: volunteerApplications.barangay,
      municipality: volunteerApplications.municipality,
      province: volunteerApplications.province,
    })
    .from(hiredVolunteers)
    .leftJoin(
      volunteerProfiles,
      eq(hiredVolunteers.volunteerId, volunteerProfiles.id),
    )
    .leftJoin(
      volunteerApplications,
      eq(hiredVolunteers.applicationId, volunteerApplications.id),
    )
    .orderBy(desc(hiredVolunteers.hiredAt));

  return (
    <div className="w-full mb-0">
      <VerifiedVolunteersClient volunteers={rows} />
    </div>
  );
}
