# `api_integrations_agent.md` — API Integrations Agent

> **Role**: Senior integration engineer responsible for connecting the Mdubusi Mathematics platform to Cal.com (scheduling + payments), Resend (transactional email), and NextAuth.js (authentication). There is **no payment gateway** in this codebase — Cal.com handles all payments.
>
> **Supervised by**: `agent.md` (Master Orchestrator)

---

## 1 · Scope

You own:
- `src/infrastructure/**` — all adapters (Prisma repo, Resend mailer, Cal.com webhook)
- `src/app/api/webhooks/**` — webhook ingest routes
- `src/infrastructure/container.ts` — composition root
- `src/lib/auth.ts` — NextAuth.js v5 configuration
- `src/middleware.ts` — role-based route protection
- `.env.example` — documenting new env vars

You are **forbidden** from editing:
- `src/domain/**` — domain interfaces are `backend_agent.md`'s territory
- `src/application/**` — use cases are the backend agent's territory
- `src/app/(auth|student|tutor)/**` — UI routes belong to `frontend_agent.md`
- React components or styling
- Adding any payment gateway (Paystack, Stripe, etc.) — payments go through Cal.com

---

## 2 · Environment Variables

```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Neon PostgreSQL (serverless — get from neon.tech dashboard)
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# NextAuth v5
AUTH_SECRET=                          # openssl rand -base64 32
AUTH_URL=http://localhost:3000        # your domain in production

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Cal.com
CAL_USERNAME=ps-ndlovu
CAL_EVENT_TYPE_ONCE_OFF=once-off-60min
CAL_EVENT_TYPE_MONTHLY=monthly-60min
CAL_EVENT_TYPE_GROUP=group-120min
CAL_WEBHOOK_SECRET=                   # from Cal.com → Developer → Webhooks

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@mdubusimaths.com
RESEND_REPLY_TO=support@mdubusimaths.com

# Tutor (for seeding + email alerting)
TUTOR_EMAIL=psndlovu@mdubusimaths.com
TUTOR_INITIAL_PASSWORD=               # change after first login

# Observability (optional)
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
```

Validate at startup in `src/infrastructure/env.ts`:

```ts
import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(20),
  AUTH_SECRET: z.string().min(20),
  AUTH_URL: z.string().url(),
  CAL_USERNAME: z.string().min(1),
  CAL_EVENT_TYPE_ONCE_OFF: z.string().min(1),
  CAL_EVENT_TYPE_MONTHLY: z.string().min(1),
  CAL_EVENT_TYPE_GROUP: z.string().min(1),
  CAL_WEBHOOK_SECRET: z.string().min(16),
  RESEND_API_KEY: z.string().startsWith('re_'),
  RESEND_FROM_EMAIL: z.string().email(),
  RESEND_REPLY_TO: z.string().email(),
  TUTOR_EMAIL: z.string().email(),
})

export const env = schema.parse(process.env)
```

---

## 3 · NextAuth.js v5 Configuration

### 3.1 Auth config (`src/lib/auth.ts`)

```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/infrastructure/prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // Google OAuth only available for student login, not tutor
    }),

    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user?.password) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, persist role into JWT
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      // Expose role + id to client via session
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'STUDENT' | 'TUTOR'
      }
      return session
    },
  },

  pages: {
    signIn: '/login',          // default student sign-in
    error: '/auth/error',
  },
})
```

### 3.2 Type augmentation

```ts
// src/types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'STUDENT' | 'TUTOR'
    }
  }
}
```

### 3.3 Route handler (`src/app/auth/[...nextauth]/route.ts`)

```ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

---

## 4 · Middleware — Role-Based Route Protection

```ts
// src/middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  // Tutor routes
  if (nextUrl.pathname.startsWith('/tutor')) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/tutor/login', req.url))
    if (session?.user.role !== 'TUTOR') return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.next()
  }

  // Student dashboard routes
  if (nextUrl.pathname.startsWith('/dashboard') ||
      nextUrl.pathname.startsWith('/sessions') ||
      nextUrl.pathname.startsWith('/profile') ||
      nextUrl.pathname.startsWith('/book')) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))
    if (session?.user.role !== 'STUDENT') return NextResponse.redirect(new URL('/tutor/dashboard', req.url))
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sessions/:path*',
    '/profile/:path*',
    '/book/:path*',
    '/tutor/:path*',
  ],
}
```

---

## 5 · Prisma Client (Infrastructure)

```ts
// src/infrastructure/prisma/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['query'] : [] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Booking Repo Adapter

```ts
// src/infrastructure/prisma/booking-repo.ts
import type { IBookingRepo } from '@/domain/ports/booking-repo'
import { Session } from '@/domain/entities/session'
import { Student } from '@/domain/entities/student'
import { Money } from '@/domain/value-objects/money'
import { SessionType } from '@/domain/value-objects/session-type'
import { TimeSlot } from '@/domain/value-objects/time-slot'
import { prisma } from './client'
import type { Session as PrismaSession, User as PrismaUser } from '@prisma/client'

export class PrismaBookingRepo implements IBookingRepo {
  async save(session: Session): Promise<void> {
    await prisma.session.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        studentId: session.studentId,
        sessionType: session.type.value.toUpperCase() as any,
        subject: session.subject,
        topic: session.topic,
        scheduledAt: session.slot.start,
        durationMin: session.slot.durationMinutes,
        amountCents: session.price.cents,
        status: session.status.toUpperCase() as any,
        calBookingUid: session.calBookingUid,
      },
      update: {
        status: session.status.toUpperCase() as any,
      },
    })
  }

  async findById(id: string): Promise<Session | null> {
    const row = await prisma.session.findUnique({ where: { id } })
    return row ? mapRow(row) : null
  }

  async findUpcomingByStudent(studentId: string): Promise<Session[]> {
    const rows = await prisma.session.findMany({
      where: {
        studentId,
        scheduledAt: { gte: new Date() },
        status: 'CONFIRMED',
      },
      orderBy: { scheduledAt: 'asc' },
      take: 10,
    })
    return rows.map(mapRow)
  }

  async findAllUpcoming(): Promise<Session[]> {
    const rows = await prisma.session.findMany({
      where: { scheduledAt: { gte: new Date() }, status: 'CONFIRMED' },
      orderBy: { scheduledAt: 'asc' },
      include: { student: true },
    })
    return rows.map(mapRow)
  }

  async findTodaysSessions(): Promise<Session[]> {
    const start = new Date(); start.setHours(0, 0, 0, 0)
    const end = new Date(); end.setHours(23, 59, 59, 999)
    const rows = await prisma.session.findMany({
      where: { scheduledAt: { gte: start, lte: end }, status: 'CONFIRMED' },
      orderBy: { scheduledAt: 'asc' },
    })
    return rows.map(mapRow)
  }

  async findAllStudents(): Promise<Student[]> {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
    })
    return users.map(mapUser)
  }

  async updateStatus(id: string, status: Session['status']): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: { status: status.toUpperCase() as any },
    })
  }

  async findHistoryByStudent(studentId: string): Promise<Session[]> {
    const rows = await prisma.session.findMany({
      where: { studentId },
      orderBy: { scheduledAt: 'desc' },
    })
    return rows.map(mapRow)
  }

  async findSessionsByStudent(studentId: string): Promise<Session[]> {
    return this.findHistoryByStudent(studentId)
  }
}

function mapRow(row: PrismaSession): Session {
  return new Session(
    row.id,
    row.studentId,
    new SessionType(row.sessionType.toLowerCase() as any),
    row.subject,
    row.topic,
    new TimeSlot(row.scheduledAt, new Date(row.scheduledAt.getTime() + row.durationMin * 60000)),
    Money.fromCents(row.amountCents),
    row.status.toLowerCase() as any,
    row.calBookingUid,
    row.createdAt,
  )
}

function mapUser(user: PrismaUser): Student {
  return new Student(
    user.id,
    user.email,
    user.firstName,
    user.lastName,
    user.academicLevel,
    user.phone,
    user.createdAt,
  )
}
```

---

## 6 · Cal.com Integration

### 6.1 Payment model

**Cal.com handles all payments.** Set up in Cal.com dashboard:

1. Go to **Cal.com → Settings → Payments**
2. Connect your **Stripe** account (Cal.com uses Stripe under the hood)
3. For each event type, enable **"Require payment"** and set the price in ZAR:
   - Once-off 60 min: R150
   - Monthly package: R1500
   - Group session 2 hrs: R800
4. Cal.com will collect payment before confirming the booking.
5. Once paid, Cal.com fires a `BOOKING_CREATED` webhook to your app.

**Your app never handles payment data.**

### 6.2 Cal.com Embed (reference for frontend agent)

```tsx
// Used in src/app/(student)/book/page.tsx
import Cal from '@calcom/embed-react'
import { env } from '@/infrastructure/env'

<Cal
  calLink={`${CAL_USERNAME}/${eventTypeSlug}`}
  config={{
    layout: 'month_view',
    theme: 'light',
    prefill: {
      name: session.user.name,
      email: session.user.email,
    },
  }}
/>
```

### 6.3 Cal.com Webhook Route

```ts
// src/app/api/webhooks/cal/route.ts
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { container } from '@/infrastructure/container'
import { env } from '@/infrastructure/env'
import { prisma } from '@/infrastructure/prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const signature = req.headers.get('x-cal-signature-256') ?? ''
  const rawBody = await req.text()

  // Verify HMAC-SHA256 signature
  const expected = crypto
    .createHmac('sha256', env.CAL_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  if (!timingSafeEq(signature, expected)) {
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)

  // Only handle BOOKING_CREATED (payment confirmed by Cal.com)
  if (payload.triggerEvent !== 'BOOKING_CREATED') {
    return NextResponse.json({ ok: true, handled: false })
  }

  // Idempotency check
  const calUid = payload.payload.uid
  const existing = await prisma.session.findUnique({ where: { calBookingUid: calUid } })
  if (existing) {
    return NextResponse.json({ ok: true, idempotent: true })
  }

  // Look up student by attendee email
  const attendeeEmail = payload.payload.attendees[0]?.email
  const attendeeName = payload.payload.attendees[0]?.name
  const student = await prisma.user.findUnique({ where: { email: attendeeEmail } })

  if (!student) {
    // Student not registered — create a basic account (they'll be prompted to set password later)
    const created = await prisma.user.create({
      data: {
        email: attendeeEmail,
        firstName: attendeeName?.split(' ')[0] ?? attendeeName ?? 'Student',
        lastName: attendeeName?.split(' ').slice(1).join(' ') ?? '',
        role: 'STUDENT',
      },
    })
    // Fall through with created student
  }

  const resolvedStudent = student ?? await prisma.user.findUnique({ where: { email: attendeeEmail } })

  const { syncCalBooking } = container()
  await syncCalBooking.execute({
    calUid,
    start: new Date(payload.payload.startTime),
    end: new Date(payload.payload.endTime),
    attendeeEmail,
    attendeeName: attendeeName ?? 'Student',
    eventTypeSlug: payload.payload.eventType?.slug ?? 'once-off-60min',
    studentId: resolvedStudent!.id,
    subject: extractSubject(payload.payload),
    topic: extractTopic(payload.payload),
  })

  return NextResponse.json({ ok: true })
}

function timingSafeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

function extractSubject(payload: any): string {
  // Cal.com custom field named "subject" (configure in event type questions)
  return payload.responses?.subject?.value ?? payload.title ?? 'Mathematics'
}

function extractTopic(payload: any): string | null {
  return payload.responses?.topic?.value ?? null
}
```

> **Configure in Cal.com**: For each event type, add custom booking questions:
> - "What subject would you like to focus on?" → field name: `subject` (required)
> - "What specific topic or concept?" → field name: `topic` (optional)

### 6.4 BOOKING_CANCELLED handling

```ts
// Add to the webhook route after BOOKING_CREATED block:
if (payload.triggerEvent === 'BOOKING_CANCELLED') {
  const calUid = payload.payload.uid
  const session = await prisma.session.findUnique({ where: { calBookingUid: calUid } })
  if (session) {
    await prisma.session.update({
      where: { id: session.id },
      data: { status: 'CANCELLED' },
    })
  }
  return NextResponse.json({ ok: true })
}
```

---

## 7 · Resend Adapter (Email)

```ts
// src/infrastructure/resend/mailer.ts
import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { IMailer } from '@/domain/ports/mailer'
import { env } from '../env'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { BookingConfirmation } from '@/emails/BookingConfirmation'
import { TutorNewBookingAlert } from '@/emails/TutorNewBookingAlert'
import { prisma } from '../prisma/client'

const templates = {
  'welcome': WelcomeEmail,
  'booking-confirmation': BookingConfirmation,
  'tutor-new-booking-alert': TutorNewBookingAlert,
} as const

export class ResendMailer implements IMailer {
  private readonly client = new Resend(env.RESEND_API_KEY)

  async send({ to, templateId, props }: Parameters<IMailer['send']>[0]) {
    const Template = templates[templateId]
    const html = await render(Template(props as any))

    let resendId: string | undefined
    let error: string | undefined

    try {
      const res = await this.client.emails.send({
        from: `Mdubusi Mathematics <${env.RESEND_FROM_EMAIL}>`,
        to,
        replyTo: env.RESEND_REPLY_TO,
        subject: subjectFor(templateId, props),
        html,
      })
      resendId = res.data?.id
    } catch (err: any) {
      error = err.message
      console.error(JSON.stringify({ level: 'error', scope: 'resend', templateId, to, error }))
      // Don't throw — email failure shouldn't crash the booking
    }

    // Log to DB for traceability
    await prisma.emailLog.create({
      data: {
        recipient: to,
        template: templateId,
        resendId,
        status: error ? 'failed' : 'sent',
        error,
      },
    })
  }
}

function subjectFor(id: string, props: any): string {
  switch (id) {
    case 'welcome':                    return 'Welcome to Mdubusi Mathematics'
    case 'booking-confirmation':       return `Booking Confirmed: ${props.subject}`
    case 'tutor-new-booking-alert':    return `New Booking: ${props.studentName} — ${props.subject}`
    default:                           return 'Mdubusi Mathematics'
  }
}
```

### Email templates

Three templates are needed:

**`WelcomeEmail.tsx`** — Sent when student creates account. Includes: welcome message, link to book first session.

**`BookingConfirmation.tsx`** — Sent to student after Cal.com confirms booking. Includes: session details (subject, topic, type, date/time), tutor name, ICS calendar attachment, link to dashboard.

**`TutorNewBookingAlert.tsx`** — Sent to PS Ndlovu when a new booking is created. Includes: student name + email, subject, topic, session type, date/time, link to tutor dashboard.

---

## 8 · Composition Root

```ts
// src/infrastructure/container.ts
import { cache } from 'react'
import { PrismaBookingRepo } from './prisma/booking-repo'
import { ResendMailer } from './resend/mailer'
import { SyncCalBooking } from '@/application/use-cases/sync-cal-booking'
import { CancelBooking } from '@/application/use-cases/cancel-booking'
import { ListUpcomingSessions } from '@/application/use-cases/list-upcoming-sessions'
import { ListAllBookings } from '@/application/use-cases/list-all-bookings'
import { ListStudents } from '@/application/use-cases/list-students'
import { GetDashboardStats } from '@/application/use-cases/get-dashboard-stats'

export const container = cache(() => {
  const bookings = new PrismaBookingRepo()
  const mailer = new ResendMailer()

  return {
    bookings,
    mailer,
    syncCalBooking: new SyncCalBooking(bookings, mailer),
    cancelBooking: new CancelBooking(bookings),
    listUpcomingSessions: new ListUpcomingSessions(bookings),
    listAllBookings: new ListAllBookings(bookings),
    listStudents: new ListStudents(bookings),
    getDashboardStats: new GetDashboardStats(bookings),
  }
})
```

---

## 9 · Reliability

- **Webhook idempotency**: `calBookingUid` unique constraint prevents duplicate session records.
- **Email failure isolation**: `ResendMailer` catches errors and logs them — email failure does not block the booking sync.
- **Timeouts**: all `fetch` calls use `AbortController` with 10s timeout.
- **HMAC verification**: constant-time comparison via `crypto.timingSafeEqual`.
- **Cal.com webhook retry**: Cal.com retries failed webhooks — idempotency ensures no duplicate sessions.

---

## 10 · Cal.com Webhook Setup Instructions

After deploying to Afrihost:

1. Go to **Cal.com → Settings → Developer → Webhooks**
2. Add a new webhook:
   - **Subscriber URL**: `https://yourdomain.com/api/webhooks/cal`
   - **Events**: `BOOKING_CREATED`, `BOOKING_CANCELLED`
   - **Secret**: generate a strong random string → copy to `CAL_WEBHOOK_SECRET` env var on VPS
3. Test with a real booking in Cal.com test mode.
4. Verify the session appears in your Afrihost PostgreSQL database.

---

## 11 · Definition of Done (integration-specific)

- [ ] Env var added to `.env.example` with a comment.
- [ ] Cal.com webhook: idempotent on replay (same `calBookingUid` → no duplicate session).
- [ ] HMAC verification is constant-time.
- [ ] Email failure does not throw or crash the webhook handler.
- [ ] Middleware redirects correctly for both student and tutor routes.
- [ ] NextAuth role persisted in JWT and available as `session.user.role`.
- [ ] Google OAuth only available for student login (not tutor login page).
- [ ] Tutor cannot access student routes; student cannot access tutor routes.

---

*End of API Integrations Agent instructions.*
