# `backend_agent.md` — Backend (Domain + Data) Agent

> **Role**: Senior backend engineer responsible for domain modelling, use cases, database schema, and security. You own the business rules and the persistence layer's *shape* — not how to call third-party APIs.
>
> **Stack**: Prisma ORM + Neon PostgreSQL (serverless) + NextAuth.js v5 (roles). No Supabase. No Paystack. Deployed on Vercel.
>
> **Supervised by**: `agent.md` (Master Orchestrator)

---

## 1 · Scope

You own:
- `src/domain/**` — entities, value objects, domain errors, ports (interfaces)
- `src/application/**` — use cases, application-level DTOs
- `prisma/schema.prisma` — DB schema and migrations
- `prisma/seed.ts` — initial data (tutor account seed)
- `src/types/` — shared type definitions
- `tests/domain/**`, `tests/application/**` — unit tests with fake adapters

You are **forbidden** from editing:
- `src/app/**` — presentation
- `src/infrastructure/**` — adapters (owned by `api_integrations_agent.md`)
- `tailwind.config.ts`, `globals.css` — styling
- Direct Resend / Cal.com SDK calls

---

## 2 · Domain Model

### 2.1 Entities

All entity classes are plain TypeScript — no decorators, no Prisma imports, no `fetch`.

```ts
// src/domain/entities/session.ts
import { Money } from '../value-objects/money'
import { SessionType } from '../value-objects/session-type'
import { TimeSlot } from '../value-objects/time-slot'

export type SessionStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export class Session {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly type: SessionType,
    public readonly subject: string,
    public readonly topic: string | null,
    public readonly slot: TimeSlot,
    public readonly price: Money,
    public status: SessionStatus,
    public readonly calBookingUid: string | null,  // Cal.com booking UID
    public readonly createdAt: Date,
  ) {}

  canBeCancelledBy(userId: string, role: 'student' | 'tutor', now: Date): boolean {
    if (role === 'tutor') return this.status !== 'completed'  // tutor can cancel anything non-completed
    if (this.studentId !== userId) return false
    if (this.status !== 'confirmed') return false
    const hoursUntilStart = (this.slot.start.getTime() - now.getTime()) / 36e5
    return hoursUntilStart >= 12   // 12-hour cancellation window for students
  }

  markConfirmed(): void {
    if (this.status !== 'pending') throw new Error(`Cannot confirm session in status ${this.status}`)
    this.status = 'confirmed'
  }

  markCompleted(): void {
    if (this.status !== 'confirmed') throw new Error(`Cannot complete session in status ${this.status}`)
    this.status = 'completed'
  }
}
```

```ts
// src/domain/entities/student.ts
export class Student {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly academicLevel: string | null,
    public readonly phone: string | null,
    public readonly createdAt: Date,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
```

### 2.2 Value objects

```ts
// src/domain/value-objects/money.ts
export class Money {
  private constructor(
    public readonly cents: number,
    public readonly currency: 'ZAR',
  ) {}

  static zar(rands: number): Money {
    if (!Number.isFinite(rands) || rands < 0) throw new Error('Invalid amount')
    return new Money(Math.round(rands * 100), 'ZAR')
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0) throw new Error('Invalid cents')
    return new Money(cents, 'ZAR')
  }

  format(): string {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' })
      .format(this.cents / 100)
  }
}
```

### 2.3 Ports (interfaces)

```ts
// src/domain/ports/booking-repo.ts
import type { Session } from '../entities/session'
import type { Student } from '../entities/student'
import type { TimeSlot } from '../value-objects/time-slot'

export interface IBookingRepo {
  // Student-scoped
  findById(id: string): Promise<Session | null>
  findUpcomingByStudent(studentId: string): Promise<Session[]>
  findHistoryByStudent(studentId: string): Promise<Session[]>

  // Tutor-scoped (all data)
  findAllUpcoming(): Promise<Session[]>
  findAllStudents(): Promise<Student[]>
  findSessionsByStudent(studentId: string): Promise<Session[]>
  findTodaysSessions(): Promise<Session[]>

  // Writes (called from Cal.com webhook handler)
  save(session: Session): Promise<void>
  updateStatus(id: string, status: Session['status']): Promise<void>
}
```

```ts
// src/domain/ports/mailer.ts
export interface IMailer {
  send(input: {
    to: string
    templateId: 'welcome' | 'booking-confirmation' | 'tutor-new-booking-alert'
    props: Record<string, unknown>
  }): Promise<void>
}
```

### 2.4 Domain errors

```ts
// src/domain/errors/domain-error.ts
export abstract class DomainError extends Error {
  abstract readonly code: string
}

export class BookingNotCancellableError extends DomainError {
  readonly code = 'BOOKING_NOT_CANCELLABLE'
}

export class SessionNotFoundError extends DomainError {
  readonly code = 'SESSION_NOT_FOUND'
}

export class UnauthenticatedError extends DomainError {
  readonly code = 'UNAUTHENTICATED'
}

export class UnauthorisedError extends DomainError {
  readonly code = 'UNAUTHORISED'
}
```

---

## 3 · Use Cases (Application Layer)

### 3.1 SyncCalBooking

Called from the Cal.com webhook route when a booking is **BOOKING_CREATED** (confirmed + paid via Cal.com).

```ts
// src/application/use-cases/sync-cal-booking.ts
import type { IBookingRepo } from '@/domain/ports/booking-repo'
import type { IMailer } from '@/domain/ports/mailer'
import { Session } from '@/domain/entities/session'
import { Money } from '@/domain/value-objects/money'
import { SessionType } from '@/domain/value-objects/session-type'
import { TimeSlot } from '@/domain/value-objects/time-slot'
import { randomUUID } from 'crypto'
import { PRICES } from '@/lib/constants'

export interface SyncCalBookingInput {
  calUid: string                  // Cal.com booking UID
  start: Date
  end: Date
  attendeeEmail: string
  attendeeName: string
  eventTypeSlug: string           // maps to SessionType
  studentId: string               // looked up from attendeeEmail
  subject: string
  topic: string | null
}

export interface SyncCalBookingOutput {
  sessionId: string
}

export class SyncCalBooking {
  constructor(
    private readonly bookings: IBookingRepo,
    private readonly mailer: IMailer,
  ) {}

  async execute(input: SyncCalBookingInput): Promise<SyncCalBookingOutput> {
    const type = SessionType.fromSlug(input.eventTypeSlug)
    const slot = new TimeSlot(input.start, input.end)
    const price = Money.fromCents(PRICES[type.value])

    const session = new Session(
      randomUUID(),
      input.studentId,
      type,
      input.subject,
      input.topic,
      slot,
      price,
      'confirmed',               // Cal.com only fires webhook after payment confirmed
      input.calUid,
      new Date(),
    )
    await this.bookings.save(session)

    // Send emails (both student and tutor notified)
    await Promise.allSettled([
      this.mailer.send({
        to: input.attendeeEmail,
        templateId: 'booking-confirmation',
        props: {
          studentName: input.attendeeName,
          subject: input.subject,
          topic: input.topic,
          sessionType: type.label,
          startTime: input.start.toISOString(),
          price: price.format(),
        },
      }),
      this.mailer.send({
        to: process.env.TUTOR_EMAIL!,
        templateId: 'tutor-new-booking-alert',
        props: {
          studentName: input.attendeeName,
          studentEmail: input.attendeeEmail,
          subject: input.subject,
          topic: input.topic,
          sessionType: type.label,
          startTime: input.start.toISOString(),
        },
      }),
    ])

    return { sessionId: session.id }
  }
}
```

### 3.2 Use case list (MVP)

| Use case | Invoked by |
|---|---|
| `SyncCalBooking` | Cal.com webhook (BOOKING_CREATED) |
| `CancelBooking` | Student/tutor dashboard cancel action |
| `ListUpcomingSessions` | Student dashboard loader |
| `ListAllBookings` | Tutor dashboard loader |
| `ListStudents` | Tutor students page loader |
| `UpdateProfile` | Student profile form server action |
| `GetDashboardStats` | Tutor overview page (today's sessions, revenue) |

---

## 4 · Database Schema (Prisma)

### 4.1 `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── User (covers both students and the tutor) ───────────────────────────────
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  password      String?   // bcrypt hash; null for OAuth-only users
  firstName     String
  lastName      String
  role          Role      @default(STUDENT)
  academicLevel String?   // grade_11, grade_12, undergraduate, etc. (students only)
  phone         String?
  avatarUrl     String?
  marketingOptin Boolean  @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  accounts      Account[]  // NextAuth OAuth accounts
  sessions_auth Session_Auth[] // NextAuth sessions

  @@map("users")
}

enum Role {
  STUDENT
  TUTOR
}

// NextAuth Account (OAuth providers)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

// NextAuth Session
model Session_Auth {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("auth_sessions")
}

// NextAuth Verification Token (email magic link / verify)
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ─── Session (tutoring session) ───────────────────────────────────────────────
model Session {
  id            String        @id @default(cuid())
  studentId     String
  sessionType   SessionType
  subject       String
  topic         String?
  scheduledAt   DateTime
  durationMin   Int           @default(60)
  amountCents   Int           // ZAR cents
  currency      String        @default("ZAR")
  status        SessionStatus @default(CONFIRMED)
  calBookingUid String?       @unique  // Cal.com booking UID
  notes         String?       // tutor can add notes
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  student       User          @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@index([studentId])
  @@index([status])
  @@index([scheduledAt])
  @@map("sessions")
}

enum SessionType {
  ONCE_OFF
  MONTHLY
  GROUP
}

enum SessionStatus {
  CONFIRMED    // Cal.com confirms after payment — directly confirmed, no pending
  CANCELLED
  COMPLETED
}

// ─── Email Log ───────────────────────────────────────────────────────────────
model EmailLog {
  id        String   @id @default(cuid())
  recipient String
  template  String
  resendId  String?
  status    String   @default("sent")  // sent | failed
  error     String?
  sentAt    DateTime @default(now())

  @@map("email_log")
}
```

### 4.2 Key design decisions

**No `payments` table.** Cal.com handles payment state. When the Cal.com webhook fires `BOOKING_CREATED`, payment is already confirmed. We record the session directly as `CONFIRMED`.

**No `availability` table.** Availability is managed entirely in Cal.com. The DB only holds confirmed bookings.

**Single `User` model** for both students and the tutor. The `role` field distinguishes them. This simplifies auth.

**`calBookingUid`** is unique — used as idempotency key for Cal.com webhook replays.

### 4.3 Pricing constants

```ts
// src/lib/constants.ts
export const PRICES: Record<string, number> = {
  once_off: 15000,   // R150 in cents
  monthly: 150000,   // R1500 in cents
  group: 80000,      // R800 in cents
}

export const SESSION_LABELS: Record<string, string> = {
  once_off: 'Once-off (60 min)',
  monthly: 'Monthly Package (24 hrs)',
  group: 'Group Session (2 hrs)',
}

export const TUTOR_NAME = 'PS Ndlovu'
export const BRAND_NAME = 'Mdubusi Mathematics'
```

### 4.4 Seed file (tutor account)

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const tutorEmail = process.env.TUTOR_EMAIL ?? 'tutor@mdubusimaths.com'
  const tutorPassword = process.env.TUTOR_INITIAL_PASSWORD ?? 'ChangeMe123!'

  const existing = await prisma.user.findUnique({ where: { email: tutorEmail } })
  if (!existing) {
    await prisma.user.create({
      data: {
        email: tutorEmail,
        password: await bcrypt.hash(tutorPassword, 12),
        firstName: 'PS',
        lastName: 'Ndlovu',
        role: 'TUTOR',
      },
    })
    console.log(`✅ Tutor account created: ${tutorEmail}`)
  } else {
    console.log(`ℹ️  Tutor account already exists: ${tutorEmail}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run with: `npx prisma db seed`

---

## 5 · Server-Side Security Rules

- **No direct Prisma calls from React components.** Components call server actions; server actions call use cases; use cases call the Prisma repo adapter.
- **Auth in every server action**: `const session = await auth(); if (!session) throw new UnauthenticatedError()`.
- **Role check in tutor actions**: `if (session.user.role !== 'TUTOR') throw new UnauthorisedError()`.
- **Idempotency**: Cal.com webhook handlers check `calBookingUid` exists before inserting. If the UID already exists in the DB → short-circuit (webhook replay-safe).
- **Input validation**: Zod parse at every server action boundary. Same schema used by the frontend form and the server action.
- **Password hashing**: `bcryptjs` with cost 12. Never store plaintext.
- **`DATABASE_URL` is server-only**. Never expose to the browser.

---

## 6 · Testing Strategy

```ts
// tests/application/sync-cal-booking.test.ts
import { SyncCalBooking } from '@/application/use-cases/sync-cal-booking'
import { FakeBookingRepo } from '../fakes/fake-booking-repo'
import { FakeMailer } from '../fakes/fake-mailer'

it('creates confirmed session and sends two emails', async () => {
  const repo = new FakeBookingRepo()
  const mailer = new FakeMailer()
  const useCase = new SyncCalBooking(repo, mailer)

  const out = await useCase.execute({
    calUid: 'cal-uid-123',
    start: new Date('2026-05-01T09:00:00Z'),
    end: new Date('2026-05-01T10:00:00Z'),
    attendeeEmail: 'student@example.com',
    attendeeName: 'Thabo M',
    eventTypeSlug: 'once-off-60min',
    studentId: 'student-1',
    subject: 'Calculus',
    topic: 'Limits',
  })

  expect(out.sessionId).toBeTruthy()
  expect(repo.saved).toHaveLength(1)
  expect(repo.saved[0].status).toBe('confirmed')
  expect(mailer.sent).toHaveLength(2)  // student + tutor
})
```

---

## 7 · Vercel Deployment Config

```json
// vercel.json (tracked in git — place in project root)
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

The `buildCommand` ensures Prisma migrations run automatically on every Vercel deploy before the Next.js build. No server management, no SSH, no Nginx required.

**To deploy**: push to GitHub → Vercel auto-builds and deploys. Set all env vars in Vercel Dashboard → Project → Settings → Environment Variables.

**Neon DB note**: The `DATABASE_URL` from Neon includes `?sslmode=require`. Prisma handles this automatically. For local dev, use a local Postgres instance or a separate Neon branch.

---

## 8 · Definition of Done (backend-specific)

- [ ] Domain file imports audit: `grep -r "prisma\|resend\|react\|next" src/domain/` → zero matches.
- [ ] `npx prisma generate` runs without errors.
- [ ] `npx prisma migrate dev` produces clean migration files.
- [ ] All new use cases have unit tests (happy path + error case).
- [ ] Tutor seed creates account correctly with `role = 'TUTOR'`.
- [ ] Webhook idempotency tested: same `calBookingUid` sent twice → only one DB record.

---

*End of Backend Agent instructions.*
