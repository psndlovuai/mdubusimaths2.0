# Mdubusi Mathematics

Expert mathematics tutoring platform for South African students — Grades 11, 12, and university level.

Built with Next.js 14 App Router, Prisma + Neon PostgreSQL, NextAuth v5, Cal.com (scheduling + payments), and Resend (transactional email).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router (TypeScript strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Prisma ORM → Neon PostgreSQL (serverless) |
| Auth | NextAuth v5 — Credentials + Google OAuth, JWT, role-based (STUDENT / TUTOR) |
| Scheduling | Cal.com — handles booking UI, availability, and payments |
| Payments | Stripe via Cal.com (no direct Stripe integration needed) |
| Email | Resend + React Email templates |
| Deployment | Vercel |
| Analytics | Vercel Analytics |

---

## Architecture

Clean Architecture layers — dependencies only point inward:

```
src/
├── domain/        # Entities, ports (interfaces), DTOs — zero external imports
├── application/   # Use cases — depend only on domain
├── infrastructure/# Prisma repos, Resend mailer, DI container
└── app/           # Next.js routes, server actions, React components
```

---

## Local Development

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) database
- A [Cal.com](https://cal.com) account with event types created
- A [Resend](https://resend.com) account with a verified domain
- Google OAuth credentials (optional, for social login)

### Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd mdubusi-maths
npm install

# 2. Copy env file and fill in your values
cp .env.example .env.local

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed the tutor account
npx prisma db seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See [`.env.example`](.env.example) for the full list with descriptions.

Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for NextAuth (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth app credentials |
| `CAL_USERNAME` | Your Cal.com username |
| `NEXT_PUBLIC_CAL_USERNAME` | Same value — used in client-side booking embed |
| `CAL_WEBHOOK_SECRET` | Set after first deploy (see Cal.com setup below) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender address (e.g. `hello@yourdomain.com`) |
| `TUTOR_EMAIL` | Tutor login email (seeded on first deploy) |
| `TUTOR_INITIAL_PASSWORD` | Tutor initial password (change after first login) |

---

## Cal.com Setup

1. Create an account at [cal.com](https://cal.com) with username matching `CAL_USERNAME`
2. Create three event types:
   - **Once-off (60 min)** — slug: `once-off-60min` — set price R150
   - **Monthly Package** — slug: `monthly-60min` — set price R1,500
   - **Group Session (2 hrs)** — slug: `group-120min` — set price R800
3. Connect Stripe in Cal.com settings for payment collection
4. After deploying to Vercel, set up the webhook:
   - Cal.com → Settings → Developer → Webhooks → Add webhook
   - URL: `https://your-domain.vercel.app/api/webhooks/cal`
   - Events: `BOOKING_CREATED`, `BOOKING_CANCELLED`
   - Copy the webhook secret → set as `CAL_WEBHOOK_SECRET` in Vercel env vars
   - Redeploy after adding the secret

---

## Deploying to Vercel

### First deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel
```

Or connect your GitHub repo in the [Vercel dashboard](https://vercel.com/new).

### Environment variables in Vercel

Add all variables from `.env.example` in Vercel → Project → Settings → Environment Variables.

The `vercel.json` already sets:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

This runs migrations automatically on every deploy.

### Seed the tutor account

After the first successful deploy, run once:

```bash
vercel env pull .env.production.local
npx prisma db seed --env-file .env.production.local
```

Or add a one-time seed step in Vercel's build command if you prefer.

---

## Routes

| URL | Description |
|---|---|
| `/` | Public landing page |
| `/login` | Student login |
| `/signup` | Student registration |
| `/dashboard` | Student dashboard (auth-guarded) |
| `/sessions` | Student session history |
| `/book` | 3-step booking wizard with Cal.com embed |
| `/profile` | Student profile settings |
| `/tutor/login` | Tutor login |
| `/tutor/dashboard` | Tutor overview + stats |
| `/tutor/bookings` | All bookings with filters |
| `/tutor/students` | Student directory |
| `/tutor/availability` | Availability settings (links to Cal.com) |
| `/policies/[slug]` | Privacy, Terms, Refund, Cancellation policies |
| `/api/webhooks/cal` | Cal.com webhook (HMAC-verified) |

---

## Database Schema

Key models in `prisma/schema.prisma`:

- **User** — `id`, `email`, `firstName`, `lastName`, `role` (STUDENT / TUTOR), `academicLevel`, `phone`, hashed `password`
- **Session** — `id`, `studentId`, `calBookingUid` (unique — idempotency key), `subject`, `sessionType`, `scheduledAt`, `status` (pending / confirmed / cancelled / completed), `price`

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript type check
npx prisma studio    # Database GUI
npx prisma migrate dev --name <name>  # Create migration
```
