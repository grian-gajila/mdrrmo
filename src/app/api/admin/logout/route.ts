// src/app/api/admin/logout/route.ts
import { clearAdminSession } from '@/lib/auth/admin-auth';
import { NextResponse } from 'next/server';

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
