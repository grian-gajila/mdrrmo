// src/app/api/admin/announcements/route.ts
import { getAdminSession } from '@/lib/auth/admin-auth';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { announcementSchema } from '@/lib/validation/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET — list all announcements
export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const list = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));

    return NextResponse.json({ announcements: list });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST — create announcement
export async function POST(request: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = announcementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const [announcement] = await db
      .insert(announcements)
      .values({
        title: data.title,
        body: data.body,
        type: data.type,
        tags: data.tags,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        repeatBroadcast: data.repeatBroadcast,
        broadcastFrequency: data.broadcastFrequency ?? null,
        createdBy: admin.id,
        isActive: true,
      })
      .returning({ id: announcements.id });

    return NextResponse.json({ success: true, id: announcement.id });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
