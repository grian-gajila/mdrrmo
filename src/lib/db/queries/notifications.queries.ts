import { db } from '@/lib/db';
import { announcements, notificationReads } from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

const NOTIFICATIONS_LIMIT = 50;

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'urgent' | 'warning' | 'success';
  publishedAt: Date | null;
  isRead: boolean;
}

export async function getNotificationsForVolunteer(
  volunteerId: string,
): Promise<NotificationItem[]> {
  const rows = await db
    .select({
      id: announcements.id,
      title: announcements.title,
      body: announcements.body,
      type: announcements.type,
      tags: announcements.tags,
      status: announcements.status,
      publishedAt: announcements.publishedAt,
      readAt: notificationReads.readAt,
    })
    .from(announcements)
    .leftJoin(
      notificationReads,
      and(
        eq(notificationReads.announcementId, announcements.id),
        eq(notificationReads.volunteerId, volunteerId),
      ),
    )
    .where(eq(announcements.status, 'published'))
    .orderBy(desc(announcements.publishedAt))
    .limit(NOTIFICATIONS_LIMIT);

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    type: r.type,
    status: r.status,
    tags: r.tags,
    publishedAt: r.publishedAt,
    isRead: r.readAt !== null,
  }));
}

export async function markNotificationRead(
  volunteerId: string,
  announcementId: string,
) {
  await db
    .insert(notificationReads)
    .values({ volunteerId, announcementId })
    .onConflictDoNothing();
}
