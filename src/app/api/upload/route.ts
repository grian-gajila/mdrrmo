// src/app/api/upload/route.ts
// Handles document uploads to Supabase Storage
// Volunteers must be authenticated to upload

import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const BUCKET_MAP: Record<string, string> = {
  photo: 'volunteer-photos',
  validId: 'volunteer-documents',
  trainingCert: 'volunteer-documents',
  barangayClearance: 'volunteer-documents',
  medicalCert: 'volunteer-documents',
};

export async function POST(request: Request) {
  try {
    // Check auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // e.g. "validId", "photo"

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' },
        { status: 400 },
      );
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Use JPG, PNG, or PDF.' },
        { status: 400 },
      );
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB.' },
        { status: 400 },
      );
    }

    const bucket = BUCKET_MAP[type];
    if (!bucket) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Build storage path: userId/type/timestamp.ext
    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `${user.id}/${type}/${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, bytes, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get signed URL (valid 1 year — for admin viewing)
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * 24 * 365);

    if (signedError) throw signedError;

    return NextResponse.json({
      success: true,
      url: signedData.signedUrl,
      path,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 },
    );
  }
}
