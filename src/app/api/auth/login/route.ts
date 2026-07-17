import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { registerSchema } from '@/lib/validation/schema';
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

    const { email, password } = parsed.data;
    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);

      if (error.message.toLowerCase().includes('email not confirmed')) {
        return NextResponse.json(
          { error: 'EMAIL_NOT_VERIFIED', email },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 },
      );
    }

    // Only plain, serializable values leave this function.
    return NextResponse.json({
      success: true,
      user: { id: data.user.id, email: data.user.email },
    });
  } catch (err) {
    console.error('Login route error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    );
  }
}
