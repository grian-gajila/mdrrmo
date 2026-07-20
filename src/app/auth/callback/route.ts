import { db } from '@/lib/db';
import { volunteerProfiles } from '@/lib/db/schema';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const meta = user.user_metadata;

      await db
        .insert(volunteerProfiles)
        .values({
          id: user.id,
          firstName: meta.first_name ?? meta.given_name ?? 'User',
          lastName: meta.last_name ?? meta.family_name ?? '',
          email: user.email!,
          emailVerified: !!user.email_confirmed_at,
          avatarUrl: meta.avatar_url ?? null,
        })
        .onConflictDoNothing({ target: volunteerProfiles.id });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
