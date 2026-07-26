import { ApplicantsTable } from '@/components/admin/applicants-table';
import { getAdminSession } from '@/lib/auth/admin-auth';
import { db } from '@/lib/db';
import { volunteerApplications, volunteerProfiles } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');

  const statusFilter = searchParams.status as
    | 'pending'
    | 'under_review'
    | 'approved'
    | 'rejected'
    | undefined;

  const rows = await db
    .select({
      id: volunteerApplications.id,
      firstName: volunteerApplications.firstName,
      middleName: volunteerApplications.middleName,
      lastName: volunteerApplications.lastName,
      gender: volunteerApplications.gender,
      age: volunteerApplications.age,
      dateOfBirth: volunteerApplications.dateOfBirth,
      nationality: volunteerApplications.nationality,
      nativePlace: volunteerApplications.nativePlace,
      educationLevel: volunteerApplications.educationLevel,
      politicalStatus: volunteerApplications.politicalStatus,
      healthStatus: volunteerApplications.healthStatus,
      maritalStatus: volunteerApplications.maritalStatus,
      idNumber: volunteerApplications.idNumber,
      idCardType: volunteerApplications.idCardType,
      sitio: volunteerApplications.sitio,
      barangay: volunteerApplications.barangay,
      municipality: volunteerApplications.municipality,
      province: volunteerApplications.province,
      contactNumber: volunteerApplications.contactNumber,
      homePhone: volunteerApplications.homePhone,
      email: volunteerApplications.email,
      emergencyContact: volunteerApplications.emergencyContact,
      volunteeringExperience: volunteerApplications.volunteeringExperience,
      validIdFrontUrl: volunteerApplications.validIdFrontUrl,
      validIdBackUrl: volunteerApplications.validIdBackUrl,
      trainingCertUrl: volunteerApplications.trainingCertUrl,
      barangayClearanceUrl: volunteerApplications.barangayClearanceUrl,
      medicalCertUrl: volunteerApplications.medicalCertUrl,
      photoUrl: volunteerApplications.photoUrl,
      status: volunteerApplications.status,
      submittedAt: volunteerApplications.submittedAt,
    })
    .from(volunteerApplications)
    .leftJoin(
      volunteerProfiles,
      eq(volunteerApplications.volunteerId, volunteerProfiles.id),
    )
    .where(
      statusFilter ? eq(volunteerApplications.status, statusFilter) : undefined,
    )
    .orderBy(desc(volunteerApplications.submittedAt));

  const counts = {
    all: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    under_review: rows.filter((r) => r.status === 'under_review').length,
    approved: rows.filter((r) => r.status === 'approved').length,
    rejected: rows.filter((r) => r.status === 'rejected').length,
  };

  return (
    <ApplicantsTable
      applicants={rows}
      counts={counts}
      currentStatus={statusFilter ?? 'all'}
    />
  );
}
