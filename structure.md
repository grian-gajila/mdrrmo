## Project Structure

```
volunteer-app/
├── .env.local
├── drizzle.config.ts
├── proxy.ts                     # route protection (was middleware.ts pre-Next 16)
├── auth.ts                      # full Auth.js config (providers, adapter, callbacks)
├── auth.config.ts               # lean, edge-safe config used by proxy.ts
├── types/next-auth.d.ts         # TS augmentation (role, etc. on session)
├── scripts/seed-admin.ts        # creates the one admin account
├── db/
│   ├── schema.ts
│   └── index.ts
├── lib/
│   ├── validations.ts           # zod schemas
│   ├── tokens.ts                # verification/reset tokens
│   ├── resend.ts
│   └── email.ts                 # email templates + senders
├── actions/                     # server actions
│   ├── register.ts
│   ├── login.ts
│   ├── forgot-password.ts
│   ├── reset-password.ts
│   ├── application.ts
│   └── admin/
│       ├── announcements.ts
│       ├── applicants.ts
│       └── settings.ts
├── components/
│   ├── navbar.tsx
│   ├── logout-button.tsx
│   ├── application-form.tsx
│   ├── auth/
│   │   ├── google-button.tsx
│   │   ├── register-form.tsx
│   │   ├── login-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── reset-password-form.tsx
│   └── admin/
│       ├── sidebar.tsx
│       ├── status-select.tsx
│       └── settings-form.tsx
└── app/
    ├── layout.tsx
    ├── globals.css
    ├── page.tsx                          # landing page
    ├── (auth)/
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── verify-email/page.tsx
    │   ├── forgot-password/page.tsx
    │   └── reset-password/page.tsx
    ├── profile/page.tsx                  # protected: any logged-in user
    ├── admin/
    │   ├── layout.tsx                    # protected: admin only
    │   ├── page.tsx                      # dashboard
    │   ├── announcements/page.tsx
    │   ├── applicants/page.tsx
    │   ├── hired/page.tsx
    │   └── settings/page.tsx
    └── api/auth/[...nextauth]/route.ts
```
