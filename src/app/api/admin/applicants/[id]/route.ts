// src/app/api/admin/applicants/[id]/route.ts
// Admin actions: approve or reject an application

import { getAdminSession } from '@/lib/auth/admin-auth';
import { db } from '@/lib/db';
import {
  hiredVolunteers,
  volunteerApplications,
  volunteerProfiles,
} from '@/lib/db/schema';
import {
  sendApplicationApprovedEmail,
  sendApplicationRejectedEmail,
} from '@/lib/email/resend';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const actionSchema = z.object({
  action: z.enum(['approve', 'reject', 'under_review']),
  notes: z.string().optional(),
  role: z.string().optional(), // required when approving
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Verify admin session
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { action, notes, role } = parsed.data;
    const { id: applicationId } = await params;

    // Load application with volunteer info
    const application = await db
      .select({
        id: volunteerApplications.id,
        volunteerId: volunteerApplications.volunteerId,
        status: volunteerApplications.status,
      })
      .from(volunteerApplications)
      .where(eq(volunteerApplications.id, applicationId))
      .limit(1)
      .then((r) => r[0] ?? null);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      );
    }

    const statusMap = {
      approve: 'approved' as const,
      reject: 'rejected' as const,
      under_review: 'under_review' as const,
    };

    // Update application status
    await db
      .update(volunteerApplications)
      .set({
        status: statusMap[action],
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        reviewNotes: notes ?? null,
        updatedAt: new Date(),
      })
      .where(eq(volunteerApplications.id, applicationId));

    // If approved, create hired volunteer record
    if (action === 'approve') {
      await db
        .insert(hiredVolunteers)
        .values({
          volunteerId: application.volunteerId,
          applicationId: application.id,
          role: role ?? 'Field Responder',
          status: 'active',
          hiredBy: admin.id,
        })
        .onConflictDoNothing();
    }

    // Load volunteer profile for email
    const profile = await db
      .select({
        firstName: volunteerProfiles.firstName,
        email: volunteerProfiles.email,
      })
      .from(volunteerProfiles)
      .where(eq(volunteerProfiles.id, application.volunteerId))
      .limit(1)
      .then((r) => r[0] ?? null);

    // Send notification email
    if (profile?.email) {
      if (action === 'approve') {
        await sendApplicationApprovedEmail(
          profile.email,
          profile.firstName,
        ).catch(console.error);
      } else if (action === 'reject') {
        await sendApplicationRejectedEmail(
          profile.email,
          profile.firstName,
          notes,
        ).catch(console.error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Review application error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
