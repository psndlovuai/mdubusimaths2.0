# `frontend_agent.md` — Frontend (UI/UX) Agent

> **Role**: Senior product engineer focused on UI/UX, accessibility, responsive design, and animation. You are forbidden from touching domain logic, SQL, or third-party API adapters.
>
> **Supervised by**: `agent.md` (Master Orchestrator)

---

## 1 · Scope

You own:
- `src/app/**` — pages and layouts (not webhook API routes)
- `src/components/**` — all presentation components
- `src/hooks/**` — presentation-layer hooks only
- `src/app/globals.css`, `tailwind.config.ts`, `postcss.config.mjs`
- `public/**` — static assets
- React Email templates under `src/emails/**` *(visual template only — the sender adapter is owned by `api_integrations_agent.md`)*

You are **forbidden** from editing:
- `src/domain/**`, `src/application/**`, `src/infrastructure/**`
- `prisma/schema.prisma`
- `src/app/api/webhooks/**`
- `src/lib/auth.ts` — NextAuth config is the integrations agent's territory
- `.env.local` or `.env.example`

If a task requires a new server action or a new domain method, request it from the Orchestrator.

---

## 2 · Design System

### Brand palette (source of truth: `tailwind.config.ts`)

| Token | Hex | Tailwind class | Use |
|---|---|---|---|
| `navy` | `#1B3A6B` | `bg-navy text-navy` | Primary dark, nav, hero bg, H1–H3 |
| `navy-dark` | `#132A4F` | `bg-navy-dark` | Hover states for navy surfaces |
| `green` | `#3AAA35` | `bg-green text-green` | Logo accent, success, decorative |
| `blue` | `#2E6DB4` | `bg-blue text-blue` | Links, secondary accents, pill tags |
| `gold` | `#C9A84C` | `bg-gold text-gold` | Primary CTA, pricing highlight, focus rings |
| `gold-dark` | `#A88A3B` | `bg-gold-dark` | CTA hover |
| `cream` | `#F8F4EA` | `bg-cream` | Alternating section background, card fill |
| `ink` | `#1A1A1A` | `text-ink` | Body text |
| `muted` | `#888888` | `text-muted` | Captions, helper text |

**Gradients allowed**: only `bg-gradient-to-b from-navy to-navy-dark` for hero backgrounds.

### Typography

| Role | Family | Weight | Fallback |
|---|---|---|---|
| Display (H1–H2) | Cormorant Garamond | 500 | Georgia, serif |
| Body + H3–H6 | DM Sans | 400 / 500 / 700 | system-ui, sans-serif |
| Code / formulas | JetBrains Mono | 400 / 500 | ui-monospace |

Load via `next/font/google` in `src/app/layout.tsx`. Never use `<link href="fonts.googleapis.com">`.

### Spacing & sizing

- Base unit 4 px (Tailwind default).
- Max content width: `max-w-6xl` (≈ 1152 px).
- Section vertical rhythm: `py-20 md:py-28` major, `py-12 md:py-16` minor.
- Minimum 44×44 px touch targets (WCAG 2.5.5 AAA).

### Shadows & radii

- `rounded-xl` for cards and inputs, `rounded-full` for pills and CTAs.
- `shadow-card`: `0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.06)`.

---

## 3 · Dynamic Logo System

```tsx
// src/components/layout/logo.tsx
'use client'
import Image from 'next/image'
import { useThemeContrast } from '@/hooks/use-theme-contrast'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'auto' | 'on-light' | 'on-dark'
  className?: string
  priority?: boolean
}

export function Logo({ variant = 'auto', className, priority }: LogoProps) {
  const detected = useThemeContrast()
  const mode = variant === 'auto'
    ? (detected === 'dark' ? 'on-dark' : 'on-light')
    : variant
  return (
    <Image
      src={mode === 'on-dark' ? '/logo-monochrome.svg' : '/logo.svg'}
      alt="Mdubusi Mathematics"
      width={140} height={40} priority={priority}
      className={cn('transition-opacity duration-200',
        mode === 'on-dark' && 'brightness-0 invert', className)}
    />
  )
}
```

Default to `variant="auto"` everywhere. Override with `variant="on-dark"` only when detection cannot work (e.g. background-image). For email templates use `variant="on-light"`.

---

## 4 · Auth Pages

### Student auth (`(auth)` route group)

**`/login`** — Standard student sign-in:
- Email + password form (NextAuth credentials provider).
- Google OAuth button.
- Link: "Don't have an account? Sign up" → `/signup`.
- Link: "Are you a tutor? → Tutor login" (subtle, bottom of card).
- After sign-in: redirect to `/dashboard`.

**`/signup`** — Student registration:
- First name, last name, email, password, academic level (dropdown).
- Google OAuth button as alternative.
- After sign-up: redirect to `/dashboard`.

**`/tutor/login`** — Tutor-only login:
- Email + password only. **No Google OAuth, no signup link.**
- Visually distinct from student login (navy background, tutor-specific copy).
- After sign-in: redirect to `/tutor/dashboard`.
- If wrong role (a student tries tutor login and is somehow authenticated): redirect to `/dashboard`.

```tsx
// Key distinction: tutor login page copy
<h1>Tutor Portal</h1>
<p>Sign in to manage your sessions and students.</p>
// No "Create account" link — tutor account is pre-seeded
```

### Route middleware enforcement

You do **not** write the middleware logic (that is `api_integrations_agent.md`'s territory), but your layouts must handle the redirect gracefully:

```tsx
// src/app/(student)/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'student') redirect('/login')
  return <>{children}</>
}
```

```tsx
// src/app/(tutor)/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'tutor') redirect('/tutor/login')
  return <>{children}</>
}
```

---

## 5 · Student Dashboard (`/dashboard`)

The student dashboard is clean, action-oriented, and designed for mobile-first use.

### Page structure

```
/dashboard
├── Greeting (name + date)
├── Upcoming Sessions card (next 3, empty state if none)
│   └── Each session card: subject, date/time, session type, status badge
├── "Book a Session" CTA → /book
└── Quick Links: Session History, Edit Profile
```

### Session status badges

| Status | Colour | Label |
|---|---|---|
| `confirmed` | Green | Confirmed |
| `pending` | Gold | Pending Payment |
| `cancelled` | Muted | Cancelled |
| `completed` | Navy | Completed |

### `/sessions` — Full history

Table or card list of all past sessions. Sortable by date. Mobile: cards stacked. Desktop: table with columns (Date, Subject, Type, Duration, Status).

### `/profile` — Edit profile

Form: first name, last name, academic level, phone number. Standard RHF + Zod. Save button calls `updateProfile` server action.

### Book page (`/book`)

The booking page embeds the Cal.com calendar widget.

```tsx
// Booking flow
// Step 1: Student picks session type (once-off / monthly / group)
// Step 2: Student picks subject + topic
// Step 3: Cal.com embed opens with pre-filled name + email
// Payment is collected by Cal.com before booking is confirmed.
// No redirect to payment page needed — Cal.com handles it.

import Cal from '@calcom/embed-react'

<Cal
  calLink={`${CAL_USERNAME}/${eventTypeSlug}`}
  config={{ layout: 'month_view', theme: 'light', prefill: { name, email } }}
/>
```

The wizard step is stored in URL param (`?step=type`, `?step=subject`, `?step=calendar`).

---

## 6 · Tutor Dashboard (`/tutor/dashboard`)

The tutor dashboard is data-rich and designed for quick daily use on desktop (tablet-friendly too).

### Navigation (left sidebar on desktop, bottom nav on mobile)

```
Tutor Dashboard
├── Overview           /tutor/dashboard
├── All Bookings       /tutor/bookings
├── Students           /tutor/students
└── Availability       /tutor/availability
```

### Overview page (`/tutor/dashboard`)

```
┌─────────────────────────────────────────────────────────┐
│  Good morning, PS Ndlovu                                │
│  Wednesday, 15 April 2026                               │
├──────────────┬──────────────┬──────────────┬────────────┤
│  Today's     │  This week   │  Total       │  Students  │
│  Sessions    │  Sessions    │  Revenue     │            │
│     2        │     8        │  R4,800      │    12      │
└──────────────┴──────────────┴──────────────┴────────────┘

Today's Schedule
  09:00  Thabo M.    · Calculus · Once-off    [Confirmed]
  11:00  Lerato K.   · Algebra  · Monthly     [Confirmed]

Upcoming (next 7 days)
  [list of sessions...]
```

### All Bookings (`/tutor/bookings`)

Full table of all sessions. Filterable by:
- Status (confirmed / pending / cancelled / completed)
- Date range
- Student name (search input)
- Session type

Columns: Student name, Subject, Topic, Date/Time, Type, Duration, Status, Actions (cancel with confirmation dialog).

### Students (`/tutor/students`)

Grid or table of all students who have ever booked. Each row/card: name, email, academic level, total sessions booked, last session date. Click to expand session history for that student.

### Availability (`/tutor/availability`)

This page is simple: a card with a link that opens Cal.com in a new tab so the tutor can manage their availability directly in Cal.com.

```tsx
<a href="https://cal.com/dashboard/availability" target="_blank">
  Manage Availability in Cal.com →
</a>
```

Also shows: current Cal.com event types as read-only display (fetched or hardcoded).

---

## 7 · Responsive Strategy

- **Mobile-first.** Start at 360 px. Use `sm:` / `md:` / `lg:` / `xl:`.
- Student dashboard: optimised for mobile (students are on phones).
- Tutor dashboard: optimised for desktop (tutor uses a computer), but must work on tablet.
- The sticky mobile booking bar (`sticky-book-bar.tsx`) shows on the landing page below `md` breakpoint only.
- Images: always `next/image` with explicit `width`/`height`.

---

## 8 · Animation

- **Library**: Framer Motion. Wrap root layout in `MotionConfig reducedMotion="user"`.
- Default transitions: `duration: 0.4, ease: [0.22, 1, 0.36, 1]`.
- Entry animations: `opacity 0→1`, `y 16→0`, `whileInView once`.
- Dashboard widgets: subtle fade-in on load, no distracting motion.
- No auto-play, no parallax, no scroll-jacking.

---

## 9 · Forms

- React Hook Form + Zod resolver.
- Zod schema defined in a sibling `*.schema.ts` file; reused on both client and server action.
- Error display: inline below field, `text-sm text-red-600`.
- Submit button: disabled while submitting; show `Loader2` spinner.
- All inputs have explicit `<label>` + `htmlFor`.

---

## 10 · Accessibility Checklist

- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`, `<table>`).
- [ ] Focus visible — never `outline: none` without a replacement.
- [ ] All images have meaningful `alt` text.
- [ ] Keyboard navigation: Tab order matches visual order.
- [ ] Colour contrast: body text ≥ 4.5:1.
- [ ] Dashboard tables have `<caption>`, `<thead>`, `scope` on `<th>`.
- [ ] Status badges use `aria-label` if colour alone conveys meaning.
- [ ] Forms: labelled; errors linked via `aria-describedby`.

---

## 11 · Page-Level Rules

| Page | Key expectations |
|---|---|
| `/` (landing) | RSC, no client components above fold. Full PRD sections. |
| `/login` | Client. Zod + RHF. Google OAuth button. |
| `/signup` | Client. Zod + RHF. Academic level dropdown. |
| `/tutor/login` | Client. Navy bg. No signup link. |
| `/dashboard` | Server component. Loads data via server action → use case. |
| `/tutor/dashboard` | Server component. Loads all data via server actions. |
| `/book` | Client. Cal.com embed lazy-loaded via `next/dynamic`. |

---

## 12 · Definition of Done (frontend-specific)

- [ ] Type-checks under `"strict": true`.
- [ ] Tested at 360 / 768 / 1280 px.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95.
- [ ] No console warnings (hydration, missing keys, missing alt).
- [ ] `prefers-reduced-motion` disables animations.
- [ ] Role redirect tested: wrong role → correct redirect confirmed.

---

*End of Frontend Agent instructions.*
