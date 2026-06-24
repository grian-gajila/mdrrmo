## Project Structure

```
my-app/
├── app/ ← App Router — ALL routes live here
│ ├── (auth)/ ← Route group: auth pages, no URL segment added
│ │ ├── login/
│ │ │ └── page.tsx
│ │ ├── register/
│ │ │ └── page.tsx
│ │ └── layout.tsx ← Auth-specific layout (minimal, no nav)
│ ├── (dashboard)/ ← Route group: authenticated app
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ ├── settings/
│ │ │ └── page.tsx
│ │ └── layout.tsx ← Dashboard layout (sidebar, nav)
│ ├── api/ ← API Route Handlers (use sparingly)
│ │ ├── webhooks/
│ │ │ └── stripe/
│ │ │ └── route.ts
│ │ └── ai/
│ │ └── stream/
│ │ └── route.ts ← Streaming AI responses
│ ├── globals.css
│ ├── layout.tsx ← Root layout (replaces \_app.tsx)
│ ├── page.tsx ← Homepage
│ ├── loading.tsx ← Global loading UI
│ ├── error.tsx ← Global error boundary
│ └── not-found.tsx ← 404 page
│
├── components/
│ ├── ui/ ← Primitive/headless components
│ │ ├── Button.tsx
│ │ ├── Input.tsx
│ │ ├── Modal.tsx
│ │ └── index.ts ← Barrel export
│ ├── features/ ← Feature-specific components
│ │ ├── auth/
│ │ │ ├── LoginForm.tsx ← "use client" — has state
│ │ │ └── UserAvatar.tsx ← Server Component — just renders data
│ │ └── billing/
│ │ ├── PlanCard.tsx
│ │ └── UsageChart.tsx ← "use client" — needs Chart.js
│ └── layouts/
│ ├── DashboardLayout.tsx
│ └── MarketingLayout.tsx
│
├── lib/
│ ├── actions/ ← Server Actions (all "use server" files)
│ │ ├── auth.ts
│ │ ├── billing.ts
│ │ └── user.ts
│ ├── api/ ← API client functions (called from client components)
│ │ ├── client.ts ← Axios/fetch wrapper
│ │ └── endpoints.ts
│ ├── db/ ← Database layer
│ │ ├── prisma.ts ← Prisma client singleton
│ │ ├── queries/ ← Reusable query functions
│ │ │ ├── users.ts
│ │ │ └── billing.ts
│ │ └── schema/ ← Drizzle schema (if using Drizzle)
│ ├── auth/ ← Auth helpers (next-auth config)
│ │ └── options.ts
│ ├── validations/ ← Zod schemas
│ │ ├── auth.ts
│ │ └── user.ts
│ └── utils/ ← Pure utility functions (no side effects)
│ ├── cn.ts ← className merge (clsx + tailwind-merge)
│ ├── format.ts
│ └── date.ts
│
├── hooks/ ← Client-side custom hooks ("use client" context)
│ ├── useAuth.ts
│ ├── useDebounce.ts
│ └── useLocalStorage.ts
│
├── stores/ ← Client state (Zustand or Jotai)
│ ├── useAuthStore.ts
│ └── useUIStore.ts
│
├── types/ ← Global TypeScript type definitions
│ ├── index.ts ← Re-exports all types
│ ├── api.ts ← API response types
│ ├── db.ts ← DB model types (if not using Prisma generated)
│ └── next.d.ts ← Next.js augmentations
│
├── agents/ ← AI agent integrations ← NEW IN AI ERA
│ ├── prompts/ ← System prompts and prompt templates
│ │ ├── base.ts ← Shared system prompt components
│ │ ├── summariser.ts
│ │ └── classifier.ts
│ ├── tools/ ← Agent tool definitions (function calling)
│ │ ├── search.ts
│ │ ├── database.ts
│ │ └── email.ts
│ └── workflows/ ← Multi-step agent workflows
│ ├── onboarding.ts ← Multi-step user onboarding agent
│ └── support.ts ← Support ticket triage workflow
│
├── public/ ← Static assets
│ ├── images/
│ └── fonts/
│
├── middleware.ts ← Edge middleware (auth, redirects, A/B)
├── next.config.ts ← Next.js config (TypeScript, not .js)
├── tailwind.config.ts
├── tsconfig.json
└── prisma/
├── schema.prisma
└── migrations/

```
