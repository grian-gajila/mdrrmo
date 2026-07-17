import { db } from '@/lib/db';
import { volunteerProfiles } from '@/lib/db/schema';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { registerSchema } from '@/lib/validation/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, password } = parsed.data;
    const supabase = getSupabaseBrowserClient();

    // createUser with email_confirm:false makes Supabase send the
    // confirmation email automatically via your configured SMTP (Resend).
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: { first_name: firstName, last_name: lastName },
      });

    if (authError) {
      console.error('Supabase createUser error:', authError);

      const msg = authError.message.toLowerCase();
      if (msg.includes('already') || msg.includes('registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 },
        );
      }
      if (msg.includes('password')) {
        return NextResponse.json(
          {
            error: 'Password does not meet requirements: ' + authError.message,
          },
          { status: 400 },
        );
      }
      // Surface the real Supabase message so it's visible instead of a
      // generic 400 — this is what you need to see if it happens again.
      return NextResponse.json(
        { error: authError.message || 'Registration failed.' },
        { status: 400 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Could not create user account.' },
        { status: 500 },
      );
    }

    // Mirror into our own DB (idempotent)
    const existing = await db
      .select({ id: volunteerProfiles.id })
      .from(volunteerProfiles)
      .where(eq(volunteerProfiles.id, authData.user.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(volunteerProfiles).values({
        id: authData.user.id,
        firstName,
        lastName,
        email,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Register route error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    );
  }
}
