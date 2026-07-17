// src/app/api/volunteer/application/route.ts
import { db } from '@/lib/db';
import { volunteerApplications, volunteerProfiles } from '@/lib/db/schema';
import { sendApplicationReceivedEmail } from '@/lib/email/resend';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { fullApplicationSchema } from '@/lib/validation/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// POST — submit a new application
export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for existing application
    const existing = await db
      .select({ id: volunteerApplications.id })
      .from(volunteerApplications)
      .where(eq(volunteerApplications.volunteerId, user.id))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'You have already submitted an application' },
        { status: 409 },
      );
    }

    const body = await request.json();
    const parsed = fullApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Insert application
    const [application] = await db
      .insert(volunteerApplications)
      .values({
        volunteerId: user.id,
        gender: data.gender,
        age: data.age,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        nativePlace: data.nativePlace,
        educationLevel: data.educationLevel,
        politicalStatus: data.politicalStatus,
        healthStatus: data.healthStatus,
        maritalStatus: data.maritalStatus,
        idNumber: data.idNumber,
        idCardType: data.idCardType,
        currentAddress: data.currentAddress,
        contactNumber: data.contactNumber,
        homePhone: data.homePhone,
        emergencyContact: {
          name: data.emergencyName,
          relation: data.emergencyRelation,
          contactNumber: data.emergencyContact,
          address: data.emergencyAddress,
        },
        validIdUrl: data.validIdUrl,
        trainingCertUrl: data.trainingCertUrl,
        barangayClearanceUrl: data.barangayClearanceUrl,
        medicalCertUrl: data.medicalCertUrl,
        photoUrl: data.photoUrl,
        status: 'pending',
      })
      .returning({ id: volunteerApplications.id });

    // Load profile for email
    const profile = await db
      .select({ firstName: volunteerProfiles.firstName })
      .from(volunteerProfiles)
      .where(eq(volunteerProfiles.id, user.id))
      .limit(1)
      .then((r) => r[0] ?? null);

    // Send confirmation email via Resend
    if (user.email) {
      await sendApplicationReceivedEmail(
        user.email,
        profile?.firstName ?? 'Volunteer',
        application.id,
      ).catch((err) => {
        // Don't fail the request if email fails
        console.error('Email send error:', err);
      });
    }

    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (err) {
    console.error('Application submit error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// GET — fetch current user's application
export async function GET() {
  try {
    const supabase = await getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await db
      .select()
      .from(volunteerApplications)
      .where(eq(volunteerApplications.volunteerId, user.id))
      .limit(1)
      .then((r) => r[0] ?? null);

    return NextResponse.json({ application });
  } catch (err) {
    console.error('Get application error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
