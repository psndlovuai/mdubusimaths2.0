# Mdubusi Mathematics 2.0 — Rebuild Plan & Audit

*Updated: 15 April 2026 · Target stack: Next.js 14 · Prisma · Neon PostgreSQL · NextAuth.js v5 · Cal.com (payments) · Resend · Vercel (free)*

---

## 0 · Executive Summary

This rebuild delivers a production-quality online tutoring platform for Mdubusi Mathematics. The stack is optimised for **zero infrastructure cost** at your current scale.

1. **Hosting → Vercel (free Hobby tier)**. Perfect fit for Next.js; edge CDN globally; automatic preview deployments on every git push.
2. **Database → Neon (free tier)**. Serverless PostgreSQL; 0.5 GB storage; more than enough for 80 students. Works perfectly with Prisma.
3. **Auth → NextAuth.js v5**. Email/password + Google OAuth; role-based (student / tutor).
4. **Payments → Cal.com built-in**. Students pay when booking via Cal.com. Zero payment code in the app.
5. **Dual Dashboard** — Separate experiences for students and the tutor (PS Ndlovu) with different sign-in routes.

**Projected monthly cost: R0.** Domain/DNS is your only expense. Cal.com takes a small cut of each transaction via Stripe.

---

## 1 · What You Need to Set Up (Accounts & Credentials)

No server to provision. Just create free accounts:

### 1.1 Vercel (Hosting — Free)
- Sign up at https://vercel.com using your GitHub account
- Import your GitHub repo and Vercel auto-deploys on every `git push`
- Set environment variables in: Vercel Dashboard → Project → Settings → Environment Variables

### 1.2 Neon (Database — Free)
- Sign up at https://neon.tech
- Create a new project → name it `mdubusi-maths`
- Copy the **Connection string** — it looks like:
  `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- That is your `DATABASE_URL`

### 1.3 Google OAuth (Social Login — Free)
- Go to https://console.cloud.google.com → APIs & Services → Credentials
- Create OAuth 2.0 Client ID (Web application)
- Authorised redirect URI: `https://yourdomain.vercel.app/api/auth/callback/google`
- Copy Client ID → `AUTH_GOOGLE_ID` and Client Secret → `AUTH_GOOGLE_SECRET`

### 1.4 Cal.com (Scheduling + Payments — Free plan)
- Sign up at https://cal.com
- Note your username (e.g. `ps-ndlovu`)
- Create 3 event types: Once-off 60min, Monthly Package, Group Session 2hrs
- Connect Stripe: Cal.com → Settings → Payments → Connect Stripe
- Set price on each event type, enable "Require payment"
- Add booking questions: "Subject" (required), "Topic" (optional)
- Add webhook: Cal.com → Settings → Developer → Webhooks → Add (after first deploy)

### 1.5 Resend (Email — Free: 3,000 emails/month)
- Sign up at https://resend.com
- Add your domain → follow DNS instructions (SPF + DKIM records)
- Create API key → copy to `RESEND_API_KEY`

### 1.6 Summary of credentials you need

| Env var | Where to get |
|---|---|
| `DATABASE_URL` | Neon dashboard → Connection string |
| `AUTH_SECRET` | Run `openssl rand -base64 32` in any terminal |
| `AUTH_URL` | Your Vercel domain e.g. `https://mdubusimaths.vercel.app` |
| `AUTH_GOOGLE_ID` | Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Google Cloud Console |
| `CAL_WEBHOOK_SECRET` | Cal.com → Developer → Webhooks (set after first deploy) |
| `RESEND_API_KEY` | Resend dashboard |
| `RESEND_FROM_EMAIL` | e.g. `hello@mdubusimaths.com` |
| `TUTOR_EMAIL` | Your email, e.g. `ps@mdubusimaths.com` |
| `TUTOR_INITIAL_PASSWORD` | Strong password — you'll change after first login |

---

## 2 · Recommended Stack (Final)

| Concern | Choice | Cost |
|---|---|---|
| Framework | **Next.js 14 App Router** | $0 |
| Language | **TypeScript strict** | $0 |
| Styling | **Tailwind v4 + shadcn/ui** | $0 |
| Animation | **Framer Motion** | $0 |
| Auth | **NextAuth.js v5** (email/password + Google, roles) | $0 |
| ORM | **Prisma** | $0 |
| Database | **Neon (serverless PostgreSQL)** | $0 free tier |
| Payments | **Cal.com built-in (Stripe)** | Per-txn only |
| Scheduling | **Cal.com cloud** | $0 free plan |
| Email | **Resend + React Email** | $0 (3k/mo free) |
| Hosting | **Vercel Hobby** | $0 |
| Monitoring | **Sentry free tier** | $0 (optional) |

**Total monthly cost: R0** (+ domain + Stripe/Cal.com per-transaction fees)

---

## 3 · File Structure

```
mdubusi-maths/
├── .env.local                          # local only, never committed
├── .env.example                        # template (tracked)
├── agent.md
├── frontend_agent.md
├── backend_agent.md
├── api_integrations_agent.md
├── REBUILD-PLAN.md
├── README.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json  (strict: true)
├── package.json
├── vercel.json                         # build command includes prisma migrate
│
├── public/
│   ├── logo.svg
│   ├── logo-monochrome.svg
│   ├── og-image.png
│   └── favicon.ico
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                         # seeds tutor account
│
└── src/
    ├── domain/
    │   ├── entities/
    │   │   ├── session.ts
    │   │   └── student.ts
    │   ├── value-objects/
    │   │   ├── money.ts
    │   │   ├── time-slot.ts
    │   │   └── session-type.ts
    │   ├── errors/domain-error.ts
    │   └── ports/
    │       ├── booking-repo.ts
    │       └── mailer.ts
    │
    ├── application/
    │   ├── use-cases/
    │   │   ├── sync-cal-booking.ts
    │   │   ├── cancel-booking.ts
    │   │   ├── list-upcoming-sessions.ts
    │   │   ├── list-all-bookings.ts
    │   │   ├── list-students.ts
    │   │   ├── get-dashboard-stats.ts
    │   │   └── update-profile.ts
    │   └── dto/booking-dto.ts
    │
    ├── infrastructure/
    │   ├── prisma/
    │   │   ├── client.ts
    │   │   └── booking-repo.ts
    │   ├── resend/
    │   │   ├── client.ts
    │   │   └── mailer.ts
    │   ├── env.ts
    │   └── container.ts
    │
    ├── emails/
    │   ├── BookingConfirmation.tsx
    │   ├── WelcomeEmail.tsx
    │   └── TutorNewBookingAlert.tsx
    │
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── (auth)/
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   └── tutor/login/page.tsx
    │   ├── (student)/
    │   │   ├── layout.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── sessions/page.tsx
    │   │   ├── profile/page.tsx
    │   │   └── book/page.tsx
    │   ├── (tutor)/
    │   │   ├── layout.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── bookings/page.tsx
    │   │   ├── students/page.tsx
    │   │   └── availability/page.tsx
    │   ├── auth/[...nextauth]/route.ts
    │   ├── actions/
    │   │   ├── booking.ts
    │   │   └── profile.ts
    │   └── api/
    │       └── webhooks/cal/route.ts
    │
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   ├── landing/
    │   ├── student/
    │   ├── tutor/
    │   └── auth/
    │
    ├── hooks/
    │   ├── use-user.ts
    │   └── use-theme-contrast.ts
    │
    ├── lib/
    │   ├── auth.ts
    │   ├── utils.ts
    │   └── constants.ts
    │
    └── types/
        ├── next-auth.d.ts
        └── index.ts
```

---

## 4 · Vercel Deploy Config

```json
// vercel.json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

This tells Vercel to run Prisma migrations automatically on every deploy before building.

---

## 5 · Environment Variables (.env.example)

```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# NextAuth v5
AUTH_SECRET=                          # openssl rand -base64 32
AUTH_URL=http://localhost:3000        # your Vercel URL in production

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Cal.com
CAL_USERNAME=ps-ndlovu
CAL_EVENT_TYPE_ONCE_OFF=once-off-60min
CAL_EVENT_TYPE_MONTHLY=monthly-60min
CAL_EVENT_TYPE_GROUP=group-120min
CAL_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@mdubusimaths.com
RESEND_REPLY_TO=support@mdubusimaths.com

# Tutor (seeded on first deploy)
TUTOR_EMAIL=ps@mdubusimaths.com
TUTOR_INITIAL_PASSWORD=

# Observability (optional)
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## 6 · Phase Plan

| Phase | Scope | Gate |
|---|---|---|
| 0 | Create Neon + Vercel accounts; connect GitHub repo | Vercel preview URL live |
| 1 | Init project; Prisma schema + NextAuth; seed tutor | Login works locally |
| 2 | Domain + application layers; use cases | `npx tsc --noEmit` passes |
| 3 | Infrastructure adapters (Prisma repo, Resend, container) | Cal.com webhook creates DB record |
| 4 | Student auth + dashboard | Student can book via Cal.com embed |
| 5 | Tutor dashboard | Tutor sees all bookings + students |
| 6 | Landing page | Lighthouse ≥ 90 mobile |
| 7 | Deploy to Vercel; set env vars; Cal.com webhook | Live HTTPS URL; end-to-end booking works |

---

## 7 · Success Criteria

- ✅ Student signs up, books via Cal.com (pays through Cal.com), receives email.
- ✅ Tutor logs in at `/tutor/login`, sees all bookings and students.
- ✅ Cal.com webhook creates session in Neon DB within seconds.
- ✅ Emails sent via Resend within 10 seconds of booking.
- ✅ Site live on Vercel with HTTPS, auto-deploys on git push.
- ✅ Monthly infrastructure cost: R0.

---

*End of Rebuild Plan.*
