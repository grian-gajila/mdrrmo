// src/app/api/auth/google/route.ts
// Returns the Supabase Google OAuth URL as a plain string. The browser then
// navigates to it directly (window.location.href = url).
//
// FIX: Supabase's API gateway (Kong) requires an `apikey` on every request,
// including this authorize redirect. The previous version omitted it,
// which produced: {"message":"No API key found in request"}.

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!supabaseUrl || !publishableKey || !appUrl) {
      return NextResponse.json(
        {
          error:
            'Server misconfiguration: missing Supabase environment variables.',
        },
        { status: 500 },
      );
    }

    const redirectTo = encodeURIComponent(`${appUrl}/auth/callback`);
    const apikey = encodeURIComponent(publishableKey);

    const url =
      `${supabaseUrl}/auth/v1/authorize` +
      `?provider=google` +
      `&redirect_to=${redirectTo}` +
      `&apikey=${apikey}`;

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Google OAuth route error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}
