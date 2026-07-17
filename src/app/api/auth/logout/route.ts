// src/app/api/auth/logout/route.ts
// Server-side sign out — properly clears the httpOnly session cookies
// via Set-Cookie headers. Client-side signOut() alone cannot do this
// reliably for cookies set by the SSR client.

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await getSupabaseBrowserClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout route error:', err);
    return NextResponse.json({ success: true }); // fail open — client still redirects
  }
}
