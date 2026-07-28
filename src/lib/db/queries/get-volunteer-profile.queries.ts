import { eq } from 'drizzle-orm';
import {
  hiredVolunteers,
  volunteerApplications,
  volunteerProfiles,
} from '../schema';
import { db } from './../index';

type UserProps = {
  userId: string;
};

export async function getVolunteerProfile({ userId }: UserProps) {
  const [profile, application, hiredRecord] = await Promise.all([
    db
      .select()
      .from(volunteerProfiles)
      .where(eq(volunteerProfiles.id, userId))
      .limit(1)
      .then((r) => r[0] ?? null),
    db
      .select()
      .from(volunteerApplications)
      .where(eq(volunteerApplications.volunteerId, userId))
      .limit(1)
      .then((r) => r[0] ?? null),
    db
      .select()
      .from(hiredVolunteers)
      .where(eq(hiredVolunteers.volunteerId, userId))
      .limit(1)
      .then((r) => r[0] ?? null),
  ]);

  return { profile, application, hiredRecord };
}
