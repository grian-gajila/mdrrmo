// src/app/auth/callback/route.ts
// Handles Supabase OAuth callback (Google) and email confirmation

import { db } from '@/lib/db';
import { volunteerProfiles } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/client';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;

      // Ensure a volunteer profile row exists (important for Google OAuth users)
      const existing = await db
        .select()
        .from(volunteerProfiles)
        .where(eq(volunteerProfiles.id, user.id))
        .limit(1);

      if (existing.length === 0) {
        const meta = user.user_metadata;
        await db.insert(volunteerProfiles).values({
          id: user.id,
          firstName: meta.first_name ?? meta.given_name ?? 'User',
          lastName: meta.last_name ?? meta.family_name ?? '',
          email: user.email!,
          emailVerified: !!user.email_confirmed_at,
          avatarUrl: meta.avatar_url ?? null,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
