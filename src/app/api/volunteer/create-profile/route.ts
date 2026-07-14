// src/app/api/volunteer/create-profile/route.ts
import { db } from '@/lib/db';
import { volunteerProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { id, firstName, lastName, email } = parsed.data;

    // Check if already exists (idempotent)
    const existing = await db
      .select({ id: volunteerProfiles.id })
      .from(volunteerProfiles)
      .where(eq(volunteerProfiles.id, id))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ success: true, existing: true });
    }

    await db.insert(volunteerProfiles).values({
      id,
      firstName,
      lastName,
      email,
      emailVerified: false,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Create profile error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
