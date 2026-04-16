# Mdubusi Mathematics 2.0 — Claude Code Build Prompts

*Stack: Next.js 14 · Prisma · Neon PostgreSQL · NextAuth.js v5 · Cal.com (payments) · Resend · Vercel (free)*

---

## PART A — Before You Start: Free Account Setup (30 minutes)

Do these steps once before running Claude Code. All are free.

### A1. Neon (Database)
1. Go to https://neon.tech → Sign up free
2. Create new project → name it `mdubusi-maths`
3. On the dashboard, click **"Connection string"** and copy it
4. Looks like: `postgresql://user:pass@ep-abc-123.us-east-2.aws.neon.tech/neondb?sslmode=require`
5. Save this — it is your `DATABASE_URL`

### A2. Vercel (Hosting)
1. Go to https://vercel.com → Sign up with your GitHub account
2. Do NOT create a project yet — you'll import it after Claude Code builds it
3. Note: your free URL will be `your-project-name.vercel.app`

### A3. Resend (Email)
1. Go to https://resend.com → Sign up free
2. Go to **Domains** → Add your domain (e.g. `mdubusimaths.com`)
3. Add the DNS records it gives you to your domain registrar
4. Go to **API Keys** → Create key → copy it (`re_...`)

### A4. Cal.com
1. Go to https://cal.com → Sign up free
2. Note your username
3. Create 3 event types:
   - "Once-off Session (60 min)" — set price R150 when you connect Stripe
   - "Monthly Package" — set price R1,500
   - "Group Session (2 hrs)" — set price R800
4. Note the URL slugs of each event type (shown in the event type URL)
5. Connect Stripe: Cal.com → Settings → Payments *(do this after Stripe account setup)*
6. Enable "Require payment" on each event type

### A5. Google OAuth (for student "Sign in with Google")
1. Go to https://console.cloud.google.com
2. Create a project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web application
4. For now, add `http://localhost:3000` as authorised redirect URI
5. You'll add your Vercel URL after deploy
6. Copy Client ID and Client Secret

### A6. Generate AUTH_SECRET
Run this in your terminal (Mac/Linux) or use https://generate-secret.vercel.app:
```bash
openssl rand -base64 32
```
Copy the output — this is your `AUTH_SECRET`.

---

## PART B — Step-by-Step Build Prompts for Claude Code

Open Claude Code in an empty folder (or your existing repo folder). Run each prompt in order. **Wait for each one to finish before pasting the next.**

---

### PROMPT 1 — Project Scaffold

```
Read these files in order before writing any code:
1. agent.md
2. REBUILD-PLAN.md
3. backend_agent.md
4. api_integrations_agent.md
5. frontend_agent.md

Then scaffold the project:

1. Initialise a Next.js 14 project with:
   - App Router
   - TypeScript (strict mode)
   - Tailwind CSS
   - ESLint
   Use: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

2. Install all required packages:
   npm install @prisma/client prisma next-auth@beta @auth/prisma-adapter bcryptjs @types/bcryptjs @calcom/embed-react resend @react-email/render @react-email/components react-hook-form @hookform/resolvers zod framer-motion lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge ics

3. Initialise Prisma:
   npx prisma init

4. Initialise shadcn/ui:
   npx shadcn@latest init
   (Choose: Default style, Neutral base colour, CSS variables yes)
   Then add components: npx shadcn@latest add button input label card badge dialog table select separator

5. Create the complete folder structure from REBUILD-PLAN.md Section 3. Create empty placeholder files (just the folders and index files) for:
   src/domain/, src/application/, src/infrastructure/, src/emails/, src/lib/, src/types/

6. Create .env.example with all variables from REBUILD-PLAN.md Section 5.

7. Create .env.local with placeholder values (user fills in real ones). Include a comment at the top: "# Fill in all values before running dev server"

8. Create vercel.json from REBUILD-PLAN.md Section 4.

9. Update tsconfig.json to add:
   "strict": true,
   "noUncheckedIndexedAccess": true

10. Create src/lib/constants.ts:
    export const PRICES = { once_off: 15000, monthly: 150000, group: 80000 }
    export const SESSION_LABELS = { once_off: 'Once-off (60 min)', monthly: 'Monthly Package (24 hrs)', group: 'Group Session (2 hrs)' }
    export const TUTOR_NAME = 'PS Ndlovu'
    export const BRAND_NAME = 'Mdubusi Mathematics'
    export const CAL_USERNAME = process.env.CAL_USERNAME ?? 'ps-ndlovu'

Verify the scaffold: npx tsc --noEmit should pass (may warn about empty files — that is fine at this stage).
```

---

### PROMPT 2 — Prisma Schema + Seed

```
Read backend_agent.md Section 4 carefully.

1. Replace prisma/schema.prisma with the complete schema from backend_agent.md Section 4.1. Include all models: User (with Role enum), Account, Session_Auth, VerificationToken, Session (tutoring session, with SessionType and SessionStatus enums), and EmailLog.

2. Create prisma/seed.ts exactly as in backend_agent.md Section 4.4.

3. Add to package.json scripts:
   "db:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
   And add the prisma block:
   "prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }

4. Install ts-node if not present: npm install -D ts-node

5. Run: npx prisma generate
   This must succeed without errors.

6. Run: npx prisma validate
   This must pass with no schema errors.

After this step show me the full generated prisma/schema.prisma content so I can confirm it looks right.
```

---

### PROMPT 3 — NextAuth + Middleware

```
Read api_integrations_agent.md Sections 2, 3, and 4.

1. Create src/infrastructure/env.ts with the Zod env validation schema from api_integrations_agent.md Section 2.

2. Create src/infrastructure/prisma/client.ts (singleton PrismaClient) from api_integrations_agent.md Section 5.

3. Create src/lib/auth.ts (NextAuth v5 config) exactly as in api_integrations_agent.md Section 3.1.
   - Credentials provider with bcrypt password check
   - Google OAuth provider
   - JWT strategy
   - role + id added to token in jwt callback
   - role + id exposed on session in session callback
   - Default signIn page: '/login'

4. Create src/types/next-auth.d.ts type augmentation from api_integrations_agent.md Section 3.2.

5. Create src/app/auth/[...nextauth]/route.ts:
   import { handlers } from '@/lib/auth'
   export const { GET, POST } = handlers

6. Create src/middleware.ts exactly as in api_integrations_agent.md Section 4.
   - /tutor/* → requires role TUTOR, else redirect /tutor/login
   - /dashboard*, /sessions*, /profile*, /book* → requires role STUDENT, else redirect /login
   - Unauthenticated → redirect to correct login

7. Create src/app/auth/error/page.tsx — simple error page showing the auth error message.

Verify: npx tsc --noEmit should pass.
```

---

### PROMPT 4 — Domain Layer

```
Read backend_agent.md Section 2 carefully.

Create the complete domain layer. Every file in src/domain/ must have ZERO external imports.

1. src/domain/value-objects/time-slot.ts
   - Constructor: (start: Date, end: Date)
   - Getter: durationMinutes (number)
   - Validation: end must be after start

2. src/domain/value-objects/session-type.ts
   - Constructor: (value: 'once_off' | 'monthly' | 'group')
   - Static: fromSlug(slug: string): SessionType — maps Cal.com event slugs to session types
     (e.g. 'once-off-60min' → 'once_off', 'monthly-60min' → 'monthly', 'group-120min' → 'group')
   - Getter: label — returns human-readable label from PRICES/SESSION_LABELS constants
   - Getter: value

3. src/domain/value-objects/money.ts — exactly as in backend_agent.md Section 2.2

4. src/domain/entities/session.ts — exactly as in backend_agent.md Section 2.1
   - canBeCancelledBy(userId, role, now) — tutor can cancel any non-completed; student needs 12h window
   - markConfirmed(), markCompleted()

5. src/domain/entities/student.ts — exactly as in backend_agent.md Section 2.1
   - fullName getter

6. src/domain/errors/domain-error.ts — all error classes from backend_agent.md Section 2.4:
   BookingNotCancellableError, SessionNotFoundError, UnauthenticatedError, UnauthorisedError

7. src/domain/ports/booking-repo.ts — IBookingRepo interface with all methods from backend_agent.md Section 2.3

8. src/domain/ports/mailer.ts — IMailer interface from backend_agent.md Section 2.3

After creating all files, run this check:
grep -r "@prisma\|resend\|react\|next\|fetch\|axios" src/domain/
This MUST return zero results. If it returns anything, fix it before proceeding.
```

---

### PROMPT 5 — Use Cases

```
Read backend_agent.md Section 3 and src/lib/constants.ts.

Create all use cases under src/application/use-cases/:

1. sync-cal-booking.ts — Full implementation from backend_agent.md Section 3.1.
   - Accepts calUid, start, end, attendeeEmail, attendeeName, eventTypeSlug, studentId, subject, topic
   - Creates Session entity with status 'confirmed' (Cal.com only fires after payment)
   - Calls bookings.save(session)
   - Sends two emails via mailer: 'booking-confirmation' to student, 'tutor-new-booking-alert' to TUTOR_EMAIL
   - Returns { sessionId }

2. cancel-booking.ts
   - Accepts: sessionId, userId, userRole ('STUDENT' | 'TUTOR')
   - Loads session via bookings.findById(sessionId) — throws SessionNotFoundError if null
   - Calls session.canBeCancelledBy(userId, userRole, new Date()) — throws BookingNotCancellableError if false
   - Calls bookings.updateStatus(sessionId, 'cancelled')

3. list-upcoming-sessions.ts
   - Accepts: studentId
   - Returns: Session[] from bookings.findUpcomingByStudent(studentId)

4. list-all-bookings.ts
   - No args (tutor sees everything)
   - Returns: Session[] from bookings.findAllUpcoming()

5. list-students.ts
   - No args
   - Returns: Student[] from bookings.findAllStudents()

6. get-dashboard-stats.ts
   - Returns: { todayCount, weekCount, totalRevenueCents, studentCount }
   - todayCount: sessions today (from bookings.findTodaysSessions())
   - weekCount: sessions this week
   - totalRevenueCents: sum of all confirmed session amountCents
   - studentCount: number of unique students

7. update-profile.ts
   - Accepts: userId, { firstName?, lastName?, academicLevel?, phone? }
   - Updates user profile (calls a profileRepo port — define IProfileRepo in src/domain/ports/profile-repo.ts)

Create src/application/dto/booking-dto.ts with these DTOs (plain objects, no class instances):
   - BookingDTO: { id, studentId, studentName?, subject, topic, sessionType, startTime, durationMin, amountCents, status, calBookingUid }
   - StudentDTO: { id, email, firstName, lastName, fullName, academicLevel, phone, totalSessions?, lastSessionDate? }
   - DashboardStatsDTO: { todayCount, weekCount, totalRevenueCents, studentCount }
```

---

### PROMPT 6 — Infrastructure Adapters + Cal Webhook

```
Read api_integrations_agent.md Sections 5, 6, 7, and 8.

1. Create src/infrastructure/prisma/booking-repo.ts — PrismaBookingRepo implementing IBookingRepo.
   Full implementation from api_integrations_agent.md Section 5 including:
   - save(), findById(), findUpcomingByStudent(), findHistoryByStudent()
   - findAllUpcoming(), findTodaysSessions(), findAllStudents()
   - updateStatus(), findSessionsByStudent()
   - mapRow() and mapUser() helper functions

2. Also create a PrismaProfileRepo in src/infrastructure/prisma/profile-repo.ts:
   - update(userId, data: { firstName?, lastName?, academicLevel?, phone? })
   - Uses prisma.user.update()

3. Create src/infrastructure/resend/mailer.ts — ResendMailer from api_integrations_agent.md Section 7.
   - Catches email errors and logs to EmailLog table (never throws)
   - Logs every send attempt to DB

4. Create src/infrastructure/container.ts — full composition root from api_integrations_agent.md Section 8.
   Wire: PrismaBookingRepo, PrismaProfileRepo, ResendMailer → all use cases.

5. Create placeholder email templates (we will style them later):
   src/emails/WelcomeEmail.tsx — "Welcome to Mdubusi Mathematics, [name]!"
   src/emails/BookingConfirmation.tsx — Shows: subject, topic, session type, date/time, amount
   src/emails/TutorNewBookingAlert.tsx — Shows: student name, email, subject, topic, date/time

6. Create src/app/api/webhooks/cal/route.ts — exact implementation from api_integrations_agent.md Section 6.3:
   - HMAC-SHA256 signature verification (constant-time)
   - Idempotency check on calBookingUid
   - BOOKING_CREATED: auto-create student if not found, then call syncCalBooking use case
   - BOOKING_CANCELLED: update session status to CANCELLED
   - Return 200 immediately; all errors logged not thrown

7. Create server actions in src/app/actions/:
   booking.ts: cancelBooking(sessionId: string) — gets session from auth, calls CancelBooking use case
   profile.ts: updateProfile(data) — gets userId from auth, calls UpdateProfile use case

Verify: npx tsc --noEmit must pass.
```

---

### PROMPT 7 — Auth Pages

```
Read frontend_agent.md Sections 2, 4, and 9.

Build all auth pages using the brand design system (navy #1B3A6B, gold #C9A84C, cream #F8F4EA, DM Sans body, Cormorant Garamond headings).

First, update src/app/layout.tsx:
- Load fonts via next/font/google: Cormorant_Garamond (weight 500) + DM_Sans (weight 400,500,700)
- Apply font CSS variables to <html>
- Include <Analytics /> from @vercel/analytics/react (install: npm install @vercel/analytics)

1. src/app/(auth)/layout.tsx
   - Centred card layout (max-w-md mx-auto)
   - Logo at top (use a text fallback "Mdubusi Mathematics" if SVG not yet available)
   - Cream background

2. src/app/(auth)/login/page.tsx — Student login:
   - "Welcome back" heading
   - Email + password fields (RHF + Zod: email required, password min 8)
   - "Sign in with Google" button (calls signIn('google') from next-auth/react)
   - Submit calls signIn('credentials', { email, password, redirect: false })
   - On success: router.push('/dashboard')
   - Error display: "Invalid email or password"
   - Link: "New student? Create an account" → /signup
   - Small link at bottom: "Tutor? Sign in here" → /tutor/login

3. src/app/(auth)/signup/page.tsx — Student registration:
   - Fields: First name, Last name, Email, Password, Academic Level (Select: Grade 11, Grade 12, Undergraduate, Honours, Postgraduate, Professional)
   - "Sign up with Google" button
   - Submit calls a registerStudent server action:
     * Validates with Zod
     * Checks email not already in use
     * bcrypt.hash(password, 12)
     * prisma.user.create({ role: 'STUDENT', ... })
     * Signs in automatically after creation
     * Redirects to /dashboard
   - Link: "Already have an account? Sign in" → /login

4. src/app/(auth)/tutor/login/page.tsx — Tutor portal login:
   - Full navy background, white card, gold accents
   - Heading: "Tutor Portal"
   - Subheading: "Sign in to manage your sessions and students"
   - Email + password ONLY — no Google, no signup link, no registration option
   - Submit calls signIn('credentials') then redirects to /tutor/dashboard
   - Small "← Back to main site" link

All forms: React Hook Form + Zod resolver, inline errors, Loader2 spinner on submit, 44px touch targets.
```

---

### PROMPT 8 — Student Dashboard

```
Read frontend_agent.md Section 5.

Build the complete student experience:

1. src/app/(student)/layout.tsx
   - Calls auth() — if no session or role !== 'STUDENT', redirect('/login')
   - Top navigation bar: Logo left, "Book Session" CTA (gold button) right, user name + sign-out link
   - Mobile: hamburger or bottom nav

2. src/app/(student)/dashboard/page.tsx — Server component:
   - Get session with auth()
   - Call listUpcomingSessions use case via container (next 3 sessions)
   - Greeting: "Good morning/afternoon/evening, [firstName]" (based on server time)
   - Upcoming sessions: 3 session cards. Each card shows:
     * Subject (bold), Topic (muted), Session type badge, Date + time, Status badge
     * Status colours: confirmed=green, cancelled=muted, completed=navy
   - Empty state: "No upcoming sessions yet. Book your first session!" with CTA button
   - "View all sessions" link → /sessions
   - "Edit profile" link → /profile

3. src/app/(student)/sessions/page.tsx — Server component:
   - All sessions for the student (history), newest first
   - Mobile: stacked cards with subject, date, type, status
   - Desktop: table with columns: Date, Subject, Topic, Type, Duration, Amount, Status
   - Cancel button on confirmed future sessions (calls cancelBooking server action, shows confirm dialog)

4. src/app/(student)/profile/page.tsx — Client component:
   - Pre-filled form with current user data
   - Fields: First name, Last name, Academic level, Phone number
   - On save: calls updateProfile server action, shows success toast

5. src/app/(student)/book/page.tsx — Client component:
   - Step 1 (?step=type): 3 session type cards to pick from (Once-off, Monthly, Group) with price displayed
   - Step 2 (?step=subject): Subject text input + Topic text input (optional)
   - Step 3 (?step=calendar): Cal.com embed loaded via next/dynamic (import Cal from '@calcom/embed-react')
     * Pre-fill: name and email from session.user
     * calLink: `${CAL_USERNAME}/${eventTypeSlug}` (slug based on type chosen in step 1)
     * Payment happens inside Cal.com — no payment redirect needed
   - Progress indicator showing current step
   - Back button on each step
```

---

### PROMPT 9 — Tutor Dashboard

```
Read frontend_agent.md Section 6.

Build the complete tutor experience:

1. src/app/(tutor)/layout.tsx
   - Calls auth() — if no session or role !== 'TUTOR', redirect('/tutor/login')
   - Sidebar navigation on desktop (left, fixed width 240px):
     * Logo + "Tutor Portal" label
     * Nav items with icons (lucide-react): LayoutDashboard → /tutor/dashboard, CalendarDays → /tutor/bookings, Users → /tutor/students, Settings → /tutor/availability
     * Sign out button at bottom
   - Mobile: bottom navigation bar with the same 4 items (icons only + labels)
   - Main content area right of sidebar

2. src/app/(tutor)/dashboard/page.tsx — Server component:
   - Call getDashboardStats use case
   - Call findTodaysSessions use case
   - Greeting: "Good morning/afternoon, PS Ndlovu" + today's date
   - 4 stat cards in a grid:
     * Today's Sessions (number)
     * This Week (number)
     * Total Revenue (formatted as R amount)
     * Total Students (number)
   - "Today's Schedule" section: ordered list of today's sessions with time, student name, subject, type
   - "Upcoming This Week" section: sessions in next 7 days

3. src/app/(tutor)/bookings/page.tsx — Server component + client filters:
   - Load all bookings via listAllBookings use case
   - Client-side filter bar: search by student name, filter by status (All/Confirmed/Cancelled/Completed), filter by session type
   - Table: Student Name, Subject, Topic, Scheduled At, Type, Duration, Amount, Status, Actions
   - Actions column:
     * "Mark Complete" button (for confirmed sessions in the past)
     * "Cancel" button (for upcoming confirmed sessions) — opens confirmation AlertDialog
   - Both actions call server actions that use the appropriate use cases

4. src/app/(tutor)/students/page.tsx — Server component:
   - Load all students via listStudents use case
   - Grid of student cards: name, email, academic level, badge showing total sessions
   - Each card has a "View Sessions" button → expand inline or navigate to filtered /tutor/bookings?student=id

5. src/app/(tutor)/availability/page.tsx — Simple page:
   - Heading: "Manage Availability"
   - Explanation card: "Your availability is managed directly in Cal.com. Click below to open your Cal.com dashboard."
   - Large button: "Open Cal.com Availability →" (opens https://cal.com/dashboard/availability in new tab)
   - Below: 3 info cards showing each event type (slug, price, duration) as read-only reference
```

---

### PROMPT 10 — Landing Page

```
Read frontend_agent.md Sections 2, 7, 8, and 10.

Build the full landing page at src/app/page.tsx. All sections are React Server Components unless noted otherwise. Use the exact brand design system (navy, gold, cream, ink palette; Cormorant Garamond for display; DM Sans for body).

Add all section components under src/components/landing/. Build each section as its own component:

1. src/components/layout/navbar.tsx (client component):
   - Logo left (text "Mdubusi Mathematics" in navy + green accent)
   - Nav links: Home, Courses, Pricing, About
   - CTA button: "Book a Session" (gold, rounded-full) → /book
   - If logged in as student: show "My Dashboard" link
   - Sticky on scroll with slight shadow
   - Mobile: hamburger menu

2. src/components/landing/hero.tsx:
   - Full-width navy-to-navy-dark gradient background
   - H1: "Unlock Your Mathematics Potential" (Cormorant Garamond, large, white)
   - Subheadline: short value statement
   - Two CTAs: "Book a Session" (gold) + "View Courses" (white outline)
   - Subtle maths-related decorative element (equations or geometric shapes in low-opacity white)

3. src/components/landing/value-props.tsx:
   - Cream background, 3-column grid
   - 3 value propositions with lucide icons (green colour), title, description

4. src/components/landing/how-it-works.tsx:
   - White background, 3 numbered steps: Book Online → Attend Session → Achieve Results

5. src/components/landing/courses.tsx:
   - Cream background, 3 course cards: Grade 11, Grade 12, University Maths
   - Each: subject areas covered, appropriate for whom

6. src/components/landing/pricing.tsx:
   - 3 pricing cards using PRICES and SESSION_LABELS constants:
     * Once-off: R150/session (60 min)
     * Monthly Package: R1,500/month (24 hours)
     * Group Session: R800/session (2 hrs, multiple students)
   - Highlight the Monthly Package card with a gold border + "Most Popular" badge

7. src/components/landing/tutor-spotlight.tsx:
   - PS Ndlovu bio section: name, qualifications, teaching philosophy
   - Photo placeholder (grey avatar or initials circle)

8. src/components/landing/testimonials.tsx:
   - 3 student testimonials (placeholder/example content for now)

9. src/components/landing/faq.tsx (client component):
   - Accordion with 6 questions using Framer Motion AnimatePresence
   - Questions: How do I book? How does payment work? Can I cancel? What subjects do you cover? What level do you teach? How do group sessions work?

10. src/components/landing/cta-banner.tsx:
    - Navy background, "Ready to start?" heading, Book Session button

11. src/components/layout/footer.tsx:
    - Logo, nav links, policy links (Privacy Policy, Terms, Refund Policy, Cancellation Policy)
    - Links to policies in /policies/ directory (already exist as markdown — create /policies/page.tsx routes)
    - Copyright: © 2026 Mdubusi Mathematics

12. src/components/layout/sticky-book-bar.tsx (client component):
    - Shows only on mobile (hidden md:hidden)
    - Fixed bottom bar: "Book a Session" gold button full width

Assemble all in src/app/page.tsx as:
<Navbar />
<Hero />
<ValueProps />
<HowItWorks />
<Courses />
<Pricing />
<TutorSpotlight />
<Testimonials />
<FAQ />
<CTABanner />
<Footer />
<StickyBookBar />

Wrap the page in a Framer Motion MotionConfig with reducedMotion="user".
```

---

### PROMPT 11 — Polish, Tests & Deploy

```
Read agent.md Section 9 (Definition of Done).

1. Email templates — polish all three to be professional:
   - WelcomeEmail.tsx: navy header, logo text, welcome message, "Book your first session" CTA button (gold)
   - BookingConfirmation.tsx: session details in a clean table (subject, date/time, duration, type, amount), "Add to Calendar" ICS attachment hint, support email footer
   - TutorNewBookingAlert.tsx: clear summary of new booking, student contact details, link to tutor dashboard

2. Run a domain layer audit:
   grep -r "@prisma\|resend\|react\|next\|fetch" src/domain/
   Must return zero results. Fix anything found.

3. Create a README.md:
   ## Mdubusi Mathematics 2.0
   ### Local dev setup
   1. Clone repo
   2. npm install
   3. cp .env.example .env.local (fill in real values)
   4. npx prisma migrate dev
   5. npx prisma db seed (creates tutor account)
   6. npm run dev
   ### Deploy to Vercel
   1. Push to GitHub
   2. Import repo on vercel.com
   3. Add all env vars from .env.example in Vercel Dashboard
   4. Deploy (Prisma migrations run automatically)
   5. Set Cal.com webhook URL to: https://your-domain/api/webhooks/cal

4. Prepare Vercel deployment:
   - Confirm vercel.json is in the repo root
   - Confirm all env vars are in .env.example
   - Run: npm run build (must succeed with zero errors)
   - Fix any TypeScript or build errors

5. Run final type check:
   npx tsc --noEmit
   Zero errors required.

6. Provide me with a deployment checklist showing the exact env vars to paste into Vercel Dashboard and the exact Cal.com webhook URL format.
```

---

## PART C — After Claude Code Builds: Deploy Checklist

Once the build is complete, do these steps:

**Step 1 — Push to GitHub**
```bash
git init
git add .
git commit -m "Initial build: Mdubusi Mathematics 2.0"
git remote add origin https://github.com/psndlovuai/mdubusimaths2.0
git push -u origin main
```

**Step 2 — Import to Vercel**
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Framework: Next.js (auto-detected)
4. Do NOT deploy yet — add env vars first

**Step 3 — Add Environment Variables in Vercel**
Go to: Project → Settings → Environment Variables. Add each one:

```
DATABASE_URL          → your Neon connection string
AUTH_SECRET           → your generated secret
AUTH_URL              → https://your-project.vercel.app
AUTH_GOOGLE_ID        → from Google Cloud Console
AUTH_GOOGLE_SECRET    → from Google Cloud Console
CAL_USERNAME          → your Cal.com username
CAL_EVENT_TYPE_ONCE_OFF → your Cal.com event slug
CAL_EVENT_TYPE_MONTHLY  → your Cal.com event slug
CAL_EVENT_TYPE_GROUP    → your Cal.com event slug
CAL_WEBHOOK_SECRET    → set this AFTER first deploy (step 5)
RESEND_API_KEY        → from Resend dashboard
RESEND_FROM_EMAIL     → hello@yourdomain.com
RESEND_REPLY_TO       → support@yourdomain.com
TUTOR_EMAIL           → your email address
TUTOR_INITIAL_PASSWORD → a strong password
```

**Step 4 — First Deploy**
Click Deploy in Vercel. Watch the build log — should see:
- `prisma generate` ✓
- `prisma migrate deploy` ✓
- `next build` ✓

**Step 5 — Seed Tutor Account**
In Vercel → Project → Functions → Run Command (or use Vercel CLI):
```bash
npx prisma db seed
```
This creates your tutor login account.

**Step 6 — Set Up Cal.com Webhook**
1. Go to Cal.com → Settings → Developer → Webhooks
2. Add new webhook:
   - URL: `https://your-project.vercel.app/api/webhooks/cal`
   - Events: `BOOKING_CREATED` + `BOOKING_CANCELLED`
   - Copy the generated secret
3. Go back to Vercel → Environment Variables → add `CAL_WEBHOOK_SECRET`
4. Redeploy (Vercel → Deployments → Redeploy latest)

**Step 7 — Update Google OAuth Redirect URI**
1. Go to Google Cloud Console → Your OAuth Client
2. Add authorised redirect URI: `https://your-project.vercel.app/api/auth/callback/google`

**Step 8 — Test End-to-End**
- [ ] Open your Vercel URL
- [ ] Sign up as a student
- [ ] Book a session via Cal.com (use Stripe test card: 4242 4242 4242 4242)
- [ ] Check email arrives (student confirmation + tutor alert)
- [ ] Check booking appears in student dashboard
- [ ] Sign in as tutor at `/tutor/login` — verify booking shows in tutor dashboard

---

## PART D — Master Build Prompt (Single Session)

If you prefer to run everything in one Claude Code session, use this:

```
You are building Mdubusi Mathematics 2.0 — a South African online tutoring platform.

Start by reading ALL of these files before writing a single line of code:
1. agent.md
2. REBUILD-PLAN.md
3. backend_agent.md
4. api_integrations_agent.md
5. frontend_agent.md

Stack:
- Next.js 14 App Router + TypeScript strict
- Prisma ORM + Neon PostgreSQL (serverless, free)
- NextAuth.js v5 — credentials + Google OAuth, roles: STUDENT | TUTOR
- Cal.com for scheduling AND payments (Stripe via Cal.com — no payment code in app)
- Resend + React Email for transactional emails
- Vercel (free Hobby) — auto-deploys on git push, migrations run in build command
- Tailwind v4 + shadcn/ui + Framer Motion

Build in this exact order:

PHASE 1 — Scaffold
npx create-next-app@latest, install all packages, create folder structure, .env.example, vercel.json

PHASE 2 — Database & Auth
prisma/schema.prisma (full schema), seed.ts (tutor account), NextAuth config, middleware (role-based routing)

PHASE 3 — Domain Layer
All entities, value objects, ports, errors in src/domain/ — ZERO external imports

PHASE 4 — Use Cases
SyncCalBooking, CancelBooking, ListUpcomingSessions, ListAllBookings, ListStudents, GetDashboardStats, UpdateProfile

PHASE 5 — Infrastructure
PrismaBookingRepo, PrismaProfileRepo, ResendMailer, container.ts, email templates (3), Cal.com webhook route

PHASE 6 — Auth Pages
/login (student), /signup, /tutor/login (navy themed, no signup link)

PHASE 7 — Student Dashboard
/dashboard, /sessions, /profile, /book (Cal.com embed in step 3 of wizard)

PHASE 8 — Tutor Dashboard
/tutor/dashboard (stats + today's schedule), /tutor/bookings (full table + filters), /tutor/students, /tutor/availability

PHASE 9 — Landing Page
Navbar, Hero, ValueProps, HowItWorks, Courses, Pricing, TutorSpotlight, Testimonials, FAQ, CTABanner, Footer, StickyBookBar

PHASE 10 — Polish & Deploy Prep
Polish email templates, domain layer audit (zero external imports), README.md, npm run build must pass

Non-negotiable rules:
- Domain layer: ZERO imports of prisma, resend, react, next, fetch
- No payment code — Cal.com handles everything
- Tutor account only creatable via seed, never via public signup
- Role middleware: STUDENT can't reach /tutor/*, TUTOR redirected from /dashboard to /tutor/dashboard
- Money always in ZAR cents (integer), formatted via Money.format()
- vercel.json buildCommand: "prisma generate && prisma migrate deploy && next build"
- DATABASE_URL is the Neon connection string (with ?sslmode=require)
```

---

*End of Claude Code Build Prompts.*
