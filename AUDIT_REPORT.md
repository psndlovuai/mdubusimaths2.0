# Codebase Audit & Cleanup Report
**Date:** 2026-04-29  
**Project:** Mdubusi Statistics (Next.js 14 / TypeScript)  
**Auditor:** Senior Dev Audit (Claude Code)

---

## Executive Summary

| Metric | Before | After |
|--------|--------|-------|
| Tracked files removed | — | 27 |
| npm packages removed | — | 1 (`ics`) |
| Dead source files removed | — | 7 |
| Dev/planning files removed | — | 19 |
| Shared utilities extracted | — | 2 (`greeting`, `formatTime`) |
| Bugs fixed | — | 1 (broken OG image) |
| TypeScript errors post-cleanup | — | 0 |
| Backup location | — | `CLEANUP_BACKUP/` |

---

## Deleted Files — Group A: Dev Artifacts

These files had no runtime role and should not have been committed to the repository.

| File | Reason |
|------|--------|
| `REBUILD-PLAN.md` | AI agent planning document |
| `CLAUDE-CODE-BUILD-PROMPT.md` | AI build prompt, no runtime role |
| `agent.md` | AI agent coordination notes |
| `frontend_agent.md` | AI agent coordination notes |
| `backend_agent.md` | AI agent coordination notes |
| `api_integrations_agent.md` | AI agent coordination notes |
| `_current-logo-preview.png` | Dev reference image at repo root |
| `brand/logo-preview.html` | Logo dev preview, not a web asset |
| `brand/og-image.svg` | Design source for the PNG; not referenced in code |
| `brand/logo-vertical.svg` | SVG variant never referenced in any source file |
| `fix/PROMPT.md` | Dev reference document |
| `fix/README.md` | Dev reference document |
| `fix/screenshots/` (16 files) | Reference screenshots from design phase |

---

## Deleted Files — Group B: Dead Source Code

All confirmed by exhaustive `grep` — zero imports across the entire `src/` tree.

| File | Reason |
|------|--------|
| `src/hooks/use-user.ts` | Placeholder stub (`return { user: null, isLoading: true }`). Never imported. |
| `src/hooks/use-theme-contrast.ts` | `Logo` takes an explicit `variant` prop; this hook was never called. |
| `src/components/auth/index.ts` | Contains only a phase-marker comment; exports nothing. |
| `src/components/student/index.ts` | Contains only a phase-marker comment; exports nothing. |
| `src/components/tutor/index.ts` | Contains only a phase-marker comment; exports nothing. |
| `src/components/landing/index.ts` | Contains only a phase-marker comment; exports nothing. |
| `src/types/index.ts` | Defines `Role`, `SessionStatus`, `SessionTypeValue`, `NavItem` — zero imports. Additionally incorrect: `SessionTypeValue` missing `'meet_greet'`; `SessionStatus` missing `'pending'`. Superseded by domain types. |

---

## Bug Fixed

**OG Image 404**  
`src/app/layout.tsx:40` referenced `/og-image.png` in the OpenGraph metadata, but `public/og-image.png` did not exist — Next.js only serves static files from `public/`. The source file `brand/og-image.png` was copied to `public/og-image.png` and committed. All link previews (WhatsApp, Twitter, LinkedIn, Slack) were previously showing no image.

---

## Deduplicated Code

### `formatTime(iso: string)` — was defined 3 times

Previously duplicated verbatim in:
- `src/components/student/session-calendar.tsx`
- `src/components/tutor/tutor-calendar.tsx`
- `src/app/tutor/dashboard/page.tsx`

**Action:** Moved canonical definition to `src/lib/utils.ts`. All 3 files updated to `import { formatTime } from '@/lib/utils'`. Local definitions removed.

### `greeting()` — was defined 2 times

Previously duplicated verbatim in:
- `src/app/(student)/dashboard/page.tsx`
- `src/app/tutor/dashboard/page.tsx`

**Action:** Moved to `src/lib/utils.ts`. Both pages updated to `import { greeting } from '@/lib/utils'`. Local definitions removed.

---

## Dependency Change

**Removed: `ics` (^3.8.1)**  
The iCalendar export package was listed in `dependencies` but had zero imports anywhere in `src/`. It was planned for session calendar export but never implemented. Removed from `package.json` and `package-lock.json` via `npm uninstall ics`.

---

## Remaining TODOs — Manual Developer Decision Required

### 1. Calendar component deduplication (High value — developer effort required)

`src/components/student/session-calendar.tsx` and `src/components/tutor/tutor-calendar.tsx` share approximately **85% identical code**: the same calendar grid logic, `prevMonth`/`nextMonth`, `byDate` grouping, dot rendering, and legend. The only meaningful differences are:

- The tutor calendar shows the student name with a `User` icon in each upcoming-session card
- The tutor calendar links to `/tutor/bookings`; the student calendar links to `/book` with a CTA when empty

**Recommendation:** Extract a `BaseCalendar` component accepting a render prop or configuration object for the upcoming-session card content. This is a non-trivial refactor that requires UI testing — not done in this cleanup pass.

### 2. `CAL_EVENT_TYPE_*` environment variables (Low risk)

Three env vars are validated at startup in `src/infrastructure/env.ts` but never read anywhere in application code:
```
CAL_EVENT_TYPE_ONCE_OFF
CAL_EVENT_TYPE_MONTHLY
CAL_EVENT_TYPE_GROUP
```
Event-type slugs are hardcoded in `src/domain/value-objects/session-type.ts`. If these vars were removed from the host environment, startup would fail with a Zod validation error.

**Options:**
- A) Make them `optional()` in `env.ts` if they're kept for future use
- B) Remove them from `env.ts` and `.env.example` entirely if the hardcoded slugs are the intended approach
- C) Implement them: replace the hardcoded SLUG_MAP in `session-type.ts` with dynamic env-var lookup

### 3. `brand/favicon.svg` not wired into the app

`brand/favicon.svg` exists but is not in `public/` and is not referenced in `src/app/layout.tsx`. The site currently has no custom favicon.

**Fix:** Copy `brand/favicon.svg` to `public/favicon.svg` and add to `src/app/layout.tsx`:
```ts
icons: { icon: '/favicon.svg' },
```
Or convert to `src/app/favicon.ico` for broader browser compatibility.

### 4. `brand/` vs `public/` — undocumented canonical source

`public/logo*.svg` files are byte-for-byte copies of `brand/logo*.svg`. There is no documented workflow for keeping them in sync. If a designer updates `brand/`, `public/` will silently go stale.

**Recommendation:** Add a note to `README.md` documenting that `public/` logos are copies of `brand/` and must be updated together.

---

## Structural Recommendations (Future Work)

1. **Extract `BaseCalendar`** — see TODO #1 above. Eliminates the largest duplication in the codebase.

2. **Implement `src/hooks/use-user.ts` properly** — now deleted because it was a stub, but a real `useUser()` hook wrapping NextAuth's `useSession` would clean up repeated `session!.user.id` assertions in page components.

3. **Empty `src/hooks/` directory** — with both hooks deleted, the directory is now empty. Either implement real hooks or remove the directory.

4. **`src/components/layout/index.ts`** — currently exports only `Logo`. The other layout components (`Navbar`, `Footer`, `StickyBookBar`) are imported by full path. Either complete the barrel file or remove it.

5. **`src/app/(auth)/login/page.tsx` magic-link section** — the login page references `signIn('resend', ...)` for magic links, but the auth config needs a Resend provider configured in NextAuth for this to work. Verify this is wired up, or remove the dead UI branch.

---

## Backup

All deleted files are preserved in `CLEANUP_BACKUP/` at the repository root. This directory is **not committed to git** and can be deleted once you are confident the cleanup is correct.

```
CLEANUP_BACKUP/
├── root/          ← planning docs, logo preview PNG
├── brand/         ← logo-preview.html, og-image.svg, logo-vertical.svg
├── fix/           ← screenshots and reference docs
└── src/
    ├── hooks/     ← use-user.ts, use-theme-contrast.ts
    ├── components/
    │   ├── auth/  ← index.ts
    │   ├── student/ ← index.ts
    │   ├── tutor/   ← index.ts
    │   └── landing/ ← index.ts
    └── types/     ← index.ts
```
