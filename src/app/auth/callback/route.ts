import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

  if (!code) {
    console.error('[auth/callback] No code param on request:', request.url);
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error(
      '[auth/callback] exchangeCodeForSession failed:',
      error?.message,
      error,
    );
    return NextResponse.redirect(
      `${origin}/auth/login?error=auth_failed&reason=${encodeURIComponent(error?.message ?? 'no_user')}`,
    );
  }

  const user = data.user;
  const meta = user.user_metadata;

  try {
    await db
      .insert(schema.volunteerProfiles)
      .values({
        id: user.id,
        firstName: meta.first_name ?? 'Volunteer',
        lastName: meta.last_name ?? 'User',
        email: user.email!,
        emailVerified: !!user.email_confirmed_at,
        avatarUrl: meta.avatar_url ?? null,
      })
      .onConflictDoUpdate({
        target: schema.volunteerProfiles.id,
        set: { emailVerified: !!user.email_confirmed_at },
      });
  } catch (err) {
    console.error('[auth/callback] Profile upsert failed:', err);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
