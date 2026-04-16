# `agent.md` — Master Orchestrator

> **Role**: Senior Software Architect supervising the rebuild of **Mdubusi Mathematics 2.0** — a premium online tutoring platform for South African students.
>
> **Stack**: Next.js 14 · Prisma · Neon PostgreSQL · NextAuth.js v5 · Cal.com (payments built-in) · Resend · Vercel (free Hobby tier)
>
> **You (the Orchestrator)** own system-wide rules, dependency direction, state management, and cross-cutting concerns. Sub-agents own their layer; you enforce the contracts.

---

## 1 · Mission

Deliver a Next.js 14 + Prisma + NextAuth.js + Cal.com + Resend application that:

1. Is **production-quality** at a scale of <80 users/month, deployed on **Afrihost VPS**.
2. Follows **Clean Architecture** with strict dependency inversion.
3. Requires **zero payment code** — Cal.com built-in payments handle all transactions.
4. Has **two separate dashboards**: one for students, one for the tutor (PS Ndlovu), with different sign-in routes and role-based access.
5. Remains easy for a solo engineer to evolve.

---

## 2 · Non-Negotiable Architectural Rules

### Rule A — Dependency direction

```
Presentation (Next.js app/, components/, hooks/)
        ↓
Application (src/application/use-cases/)
        ↓
Domain (src/domain/) ← Infrastructure (src/infrastructure/)
```

- **Domain imports nothing external.** No `@prisma/*`, no `fetch`, no `next/*`, no `react`. If a file in `src/domain/` has any third-party import, the build is broken.
- **Application depends only on Domain** — via ports (TS interfaces in `src/domain/ports/`).
- **Infrastructure depends only on Domain** — it *implements* domain ports.
- **Presentation depends only on Application** — components call server actions; server actions call use cases.

### Rule B — Ports & adapters

Every external system (PostgreSQL via Prisma, Resend, Cal.com) must be fronted by a TypeScript interface in `src/domain/ports/`. Example:

```ts
// src/domain/ports/booking-repo.ts
export interface IBookingRepo {
  findById(id: string): Promise<Session | null>
  findUpcomingByStudent(studentId: string): Promise<Session[]>
  findAllUpcoming(): Promise<Session[]>        // tutor view
  findAllStudents(): Promise<Student[]>         // tutor view
  save(session: Session): Promise<void>
}
```

### Rule C — Composition root

All wiring lives in `src/infrastructure/container.ts`. This is the *only* file allowed to `new PrismaBookingRepo(...)`, `new ResendMailer(...)`, etc. Every other file receives its dependencies via parameter.

### Rule D — No leaky abstractions

- Use cases return **DTOs**, never Prisma rows.
- Domain errors are typed (`class SlotUnavailableError extends DomainError`).
- Money is always a `Money` value object (ZAR cents as integer).

### Rule E — Security first

- **Auth handled by NextAuth.js**. Session checks use `auth()` from `@/lib/auth`. Never roll custom JWT logic.
- **Role enforcement in middleware**: `src/middleware.ts` checks `session.user.role` and redirects:
  - `/dashboard*` → requires `role === 'student'`
  - `/tutor/*` → requires `role === 'tutor'`
  - Unauthenticated → `/login`
- **Tutor account is seeded**, not publicly creatable. The `role = 'tutor'` flag is set only in `prisma/seed.ts` or manually via the DB. There is **no public signup route that can create a tutor**.
- **Cal.com webhook** signature verified with HMAC-SHA256 before any DB write.
- **No secrets in client components**. `DATABASE_URL` and `AUTH_SECRET` are server-only.
- Rate-limit `/login` and `/signup` (5 req/min/IP).

### Rule F — Type safety

- `tsconfig.json` strict mode: `"strict": true`, `"noUncheckedIndexedAccess": true`.
- Prisma generates types into `src/types/database.types.ts` (or use Prisma's generated client directly).
- Zod schemas for every external boundary (form input, webhook payload, env vars).

### Rule G — No payment code

**There is no Paystack, Stripe, or any payment adapter in this codebase.**
Payments are collected by Cal.com at booking time. The app only receives the webhook *after* payment is confirmed. Do not add payment processing code.

---

## 3 · Role System

| Role | How created | Auth route | Dashboard |
|---|---|---|---|
| `student` | Public `/signup` form | `/login` | `/dashboard` |
| `tutor` | Seeded via `prisma/seed.ts` | `/tutor/login` | `/tutor/dashboard` |

The `user` table has a `role` field (`'student' | 'tutor'`). NextAuth exposes `session.user.role` after extending the session type. Middleware guards route groups:
- `(student)` route group → `role === 'student'` only
- `(tutor)` route group → `role === 'tutor'` only

---

## 4 · State Management Philosophy

| State kind | Where it lives | Example |
|---|---|---|
| **Server state** (persisted truth) | PostgreSQL via Prisma | Bookings, users, sessions |
| **Auth session** | NextAuth cookie | `session.user.id`, `session.user.role` |
| **URL state** | `useSearchParams`, `router` | Booking step, filters, date |
| **Ephemeral UI state** | `useState` in lowest ancestor | Open/closed drawers, input focus |

**Forbidden**: Redux, Zustand, Jotai, `localStorage` for auth/session data.

---

## 5 · Deployment Model (Vercel + Neon)

This app deploys to **Vercel** (free Hobby tier). The deployment pipeline is:

```
Local machine  →  git push to GitHub  →  Vercel auto-deploys
```

- `vercel.json` sets the build command: `prisma generate && prisma migrate deploy && next build`
- Prisma migrations run automatically on every deploy — no manual DB steps.
- Environment variables live in Vercel Dashboard → Project → Settings → Environment Variables.
- Neon PostgreSQL is the serverless database; `DATABASE_URL` is the Neon connection string.
- Every PR gets a preview deployment URL automatically (great for testing before merging).
- SSL is handled by Vercel — no Certbot, no Nginx needed.

---

## 6 · Sub-Agent Dispatch Rules

| Request shape | Dispatch to |
|---|---|
| Landing page sections, styling, hero, logo | `frontend_agent.md` |
| Student dashboard UI, booking history | `frontend_agent.md` |
| Tutor dashboard UI, student roster | `frontend_agent.md` |
| Auth pages (login, signup, tutor login) | `frontend_agent.md` |
| Domain entities, use cases, ports | `backend_agent.md` |
| Prisma schema, migrations, DB queries | `backend_agent.md` |
| Cal.com webhook handler, Resend mailer | `api_integrations_agent.md` |
| NextAuth config, role middleware | `api_integrations_agent.md` |
| Stack decisions, cross-layer changes | Orchestrator (you) |

---

## 7 · Workflow Rules

1. **Read `REBUILD-PLAN.md` first.** Source of truth for what is being built.
2. **One phase at a time.** Phase gate must pass before starting next phase.
3. **One component per file.** Reusable primitives in `src/components/ui/`.
4. **No TODO/FIXME in `main`.**
5. **Test before extending.** New use case → unit test with fake adapters first.

---

## 8 · Failure Modes to Catch

- ❌ Importing `prisma` directly in a React component. Use server actions → use cases → repo.
- ❌ Writing payment processing code. Payments are Cal.com's job.
- ❌ Creating a tutor account via the public signup form. Tutor is seeded only.
- ❌ Accessing `(tutor)` routes without middleware role check.
- ❌ Hardcoding session prices in UI components. Prices live in `src/lib/constants.ts`.
- ❌ Using `any` to silence Prisma or Zod type errors.
- ❌ Committing `.env.local` to git.

---

## 9 · Definition of Done

A unit of work is "done" only when **all** of these are true:

- [ ] Types compile under strict mode.
- [ ] Lint passes (`npm run lint`).
- [ ] Domain files have no external imports.
- [ ] If presentation: renders at 360 / 768 / 1280 px.
- [ ] If auth-gated: tested with wrong role → redirect confirmed.
- [ ] If webhook: idempotent on replay.
- [ ] `.env.example` updated if a new env var was added.

---

*End of Master Orchestrator instructions.*
