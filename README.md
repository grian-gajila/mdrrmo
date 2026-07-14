# MDRRMO Full-Stack — Complete File Reference

## Paste each file exactly at the path shown

---

## COMPLETE FILE TREE

```
mdrrmo/
├── .env.local                           ← Create manually (see STEP 6 in GUIDE.md)
├── drizzle.config.ts
├── next.config.ts
├── package.json                         ← Add scripts section
├── SUPABASE_SETUP.sql                   ← Run in Supabase SQL editor
│
└── src/
    ├── middleware.ts                    ← Route protection (CRITICAL)
    │
    ├── app/
    │   ├── layout.tsx                   ← Root layout (Toaster)
    │   ├── page.tsx                     ← Redirects to /landing
    │   │
    │   ├── landing/
    │   │   └── page.tsx                 ← Public homepage
    │   │
    │   ├── auth/
    │   │   ├── layout.tsx               ← Shared auth card layout
    │   │   ├── login/page.tsx           ← Volunteer login
    │   │   ├── register/page.tsx        ← Volunteer register
    │   │   ├── verify-email/page.tsx    ← Email verification notice
    │   │   ├── forgot-password/page.tsx ← Forgot password
    │   │   ├── reset-password/page.tsx  ← Reset password
    │   │   └── callback/route.ts        ← OAuth + email confirm handler
    │   │
    │   ├── profile/
    │   │   ├── layout.tsx               ← Protected volunteer layout
    │   │   └── page.tsx                 ← Volunteer profile page
    │   │
    │   ├── apply/
    │   │   ├── layout.tsx               ← Reuses profile layout
    │   │   └── page.tsx                 ← Application form page
    │   │
    │   ├── admin/
    │   │   ├── login/page.tsx           ← Admin login (username+password)
    │   │   └── dashboard/
    │   │       ├── layout.tsx           ← Protected admin layout
    │   │       ├── page.tsx             ← Admin dashboard (stats + recent)
    │   │       ├── applicants/page.tsx  ← Applicants management
    │   │       ├── announcements/page.tsx
    │   │       ├── hired-volunteers/page.tsx
    │   │       └── settings/page.tsx
    │   │
    │   └── api/
    │       ├── admin/
    │       │   ├── login/route.ts       ← POST: admin login → sets JWT cookie
    │       │   ├── logout/route.ts      ← POST: clears admin cookie
    │       │   ├── change-password/route.ts
    │       │   ├── announcements/route.ts
    │       │   └── applicants/[id]/route.ts  ← PATCH: approve/reject
    │       ├── volunteer/
    │       │   ├── create-profile/route.ts   ← POST: after Supabase signUp
    │       │   └── application/route.ts      ← POST/GET: submit & fetch
    │       └── upload/route.ts               ← POST: file → Supabase Storage
    │
    ├── components/
    │   ├── auth/
    │   │   └── SignOutButton.tsx         ← Client component for volunteer logout
    │   ├── admin/
    │   │   ├── AdminSidebar.tsx
    │   │   ├── AdminHeader.tsx
    │   │   ├── ApplicantsTable.tsx       ← Full table + view/reject modals
    │   │   ├── AnnouncementsClient.tsx   ← List + composer modal
    │   │   ├── HiredVolunteersClient.tsx
    │   │   └── AdminSettingsClient.tsx   ← Tabbed settings UI
    │   └── volunteer/
    │       └── ApplicationFormClient.tsx ← 3-step multi-form with file upload
    │
    └── lib/
        ├── db/
        │   ├── index.ts                  ← Drizzle + pg pool
        │   ├── schema.ts                 ← All tables & enums
        │   └── seed.ts                   ← Default admin seed
        ├── supabase/
        │   ├── client.ts                 ← Browser client
        │   └── server.ts                 ← Server client + admin client
        ├── auth/
        │   └── admin-auth.ts             ← JWT sign/verify/cookie for admin
        ├── email/
        │   └── resend.ts                 ← All transactional emails
        └── validation/
            └── schemas.ts                ← All Zod schemas + type exports
```

```md
-- ============================================================
-- SUPABASE SETUP — Run these in Supabase SQL Editor
-- ============================================================
-- Go to: Supabase Dashboard → SQL Editor → New query
-- Paste and run each section

-- ============================================================
-- 1. STORAGE BUCKETS
-- Create in: Storage → New Bucket
-- Or run via SQL:
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
('volunteer-documents', 'volunteer-documents', false),
('volunteer-photos', 'volunteer-photos', false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 2. STORAGE RLS POLICIES
-- Volunteers can upload to their own folder only
-- Admins (service role) can read all
-- ============================================================

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
bucket_id IN ('volunteer-documents', 'volunteer-photos')
AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own files
CREATE POLICY "Users read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
bucket_id IN ('volunteer-documents', 'volunteer-photos')
AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to replace/update their own files
CREATE POLICY "Users update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
bucket_id IN ('volunteer-documents', 'volunteer-photos')
AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- 3. EMAIL CONFIGURATION (Optional but recommended)
-- In Supabase: Authentication → Settings → Email
-- Set SMTP host to Resend:
-- Host: smtp.resend.com
-- Port: 465
-- Username: resend
-- Password: <your Resend API key>
-- Sender email: noreply@yourdomain.com
-- ============================================================

-- ============================================================
-- 4. GOOGLE OAUTH SETUP
-- In Supabase: Authentication → Providers → Google
-- Enable and add:
-- Client ID: from Google Cloud Console
-- Client Secret: from Google Cloud Console
-- Add redirect URI in Google Console:
-- https://xxxx.supabase.co/auth/v1/callback
-- ============================================================

-- ============================================================
-- 5. EMAIL TEMPLATES (Optional)
-- In Supabase: Authentication → Email Templates
-- Customize the Confirm signup template to match your brand
-- The URL is handled by Supabase; Resend handles delivery via SMTP
-- ============================================================

-- ============================================================
-- 6. AUTH SETTINGS
-- In Supabase: Authentication → Settings
-- Set:
-- Site URL: http://localhost:3000 (or your production URL)
-- Redirect URLs:
-- http://localhost:3000/auth/callback
-- http://localhost:3000/auth/verify-email
-- http://localhost:3000/auth/reset-password
-- ============================================================
```

---

## PASTE ORDER (recommended)

1. `.env.local` — fill in your keys first
2. `drizzle.config.ts`
3. `src/lib/db/schema.ts`
4. `src/lib/db/index.ts`
5. `src/lib/db/seed.ts`
6. `src/lib/supabase/client.ts`
7. `src/lib/supabase/server.ts`
8. `src/lib/auth/admin-auth.ts`
9. `src/lib/validation/schemas.ts`
10. `src/lib/email/resend.ts`
11. `src/middleware.ts`
12. `src/app/layout.tsx`
13. `src/app/page.tsx`
14. All remaining pages and components in any order

---

## FIRST RUN CHECKLIST

```bash
# 1. Install deps
npm install @supabase/supabase-js @supabase/ssr
npm install drizzle-orm drizzle-kit pg
npm install resend zod jose bcryptjs
npm install @hookform/resolvers react-hook-form
npm install lucide-react sonner
npm install --save-dev @types/pg @types/bcryptjs tsx dotenv

# 2. Push schema to Supabase PostgreSQL
npm run db:push

# 3. Seed default admin (admin / Admin@123456)
npm run db:seed

# 4. Run dev server
npm run dev
```

---

## AUTH FLOWS SUMMARY

### Volunteer Auth (Supabase)

```
/auth/register  → supabase.auth.signUp() → email verification sent via Resend SMTP
                → /api/volunteer/create-profile  (creates DB row)
                → redirect /auth/verify-email

/auth/login     → supabase.auth.signInWithPassword()
                → redirect /profile

Google OAuth    → supabase.auth.signInWithOAuth({ provider: 'google' })
                → /auth/callback  → exchange code → create profile if new
                → redirect /profile

Forgot password → supabase.auth.resetPasswordForEmail()
                → email sent → user clicks link → /auth/reset-password
                → supabase.auth.updateUser({ password })

Logout          → supabase.auth.signOut() → redirect /landing
```

### Admin Auth (Custom JWT — no Supabase)

```
/admin/login    → POST /api/admin/login
                → bcrypt.compare(password, hash)
                → SignJWT → set httpOnly cookie 'mdrrmo_admin_session'
                → redirect /admin/dashboard

All admin routes → middleware reads cookie → jwtVerify()
                → invalid/expired → redirect /admin/login

Admin logout    → POST /api/admin/logout → cookie.delete()
                → redirect /admin/login

Change password → POST /api/admin/change-password
                → bcrypt.compare current → bcrypt.hash new → db.update
```

---

## APPLICATION STATUS FLOW

```
[Volunteer submits form]
        ↓
    status: "pending"
        ↓ (admin clicks Under Review)
    status: "under_review"
        ↓
  ┌─────┴──────┐
  ↓            ↓
"approved"  "rejected"
  ↓            ↓
hired_volunteers  email sent (rejection reason)
row created
  ↓
email sent (approval)
```

---

## ENVIRONMENT VARIABLES REFERENCE

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=         # Supabase service role key (server only)
DATABASE_URL=                       # Supabase PostgreSQL connection string
RESEND_API_KEY=                     # Resend API key
RESEND_FROM_EMAIL=                  # Verified sender email
ADMIN_JWT_SECRET=                   # Min 32 chars random string
NEXT_PUBLIC_APP_URL=                # http://localhost:3000 or production URL
```

---

## DEFAULT ADMIN CREDENTIALS

- **Username**: `admin`
- **Password**: `Admin@123456`
- **Route**: `/admin/login`
- ⚠️ Change immediately in `/admin/dashboard/settings` → Security tab
