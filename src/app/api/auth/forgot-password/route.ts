// src/app/api/auth/forgot-password/route.ts
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    // Always return success — never reveal whether the email exists.
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Forgot password route error:', err);
    // Still return success to avoid leaking account existence via errors.
    return NextResponse.json({ success: true });
  }
}
