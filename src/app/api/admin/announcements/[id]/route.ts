import { getAdminSession } from '@/lib/auth/admin-auth';
import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { announcementSchema } from '@/lib/validation/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.delete(announcements).where(eq(announcements.id, id));

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = announcementSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const [updated] = await db
    .update(announcements)
    .set({
      title: data.title,
      body: data.body,
      type: data.type,
      tags: data.tags,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      repeatBroadcast: data.repeatBroadcast,
      broadcastFrequency: data.broadcastFrequency ?? null,
      updatedAt: new Date(),
    })
    .where(eq(announcements.id, id))
    .returning({ id: announcements.id });

  if (!updated) {
    return NextResponse.json(
      { error: 'Announcement not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, id: updated.id });
}
