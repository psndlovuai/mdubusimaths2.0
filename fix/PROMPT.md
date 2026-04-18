# Claude Code Implementation Brief — Mdubusi Mathematics Site Redesign (v2)

> **Source of truth:** the `screenshots/` folder next to this file (frames extracted from the two WhatsApp walkthroughs) shows the **current local site (left pane)** versus the **target production site `mdubusimaths.com` (right pane)**. The job is to bring the current local site fully in line with the right pane — while keeping the existing logo and making the site seamless across all devices and both color modes.

Working directory (from the video URL bar): `/Users/boitsmelomahlaha/Desktop/mdubusi-mathematics-tutor/`
Primary files: `index.html`, `booking.html`, `pricing.html`, any linked `css/`, `js/`, `assets/`.

---

## 0. Pre-flight audit (do this first, write findings to `/docs/audit.md`)

Before touching styles, run a read-only audit and produce a short report. This prevents rework.

### 0.1 Logo audit — keep the current logo
The **current logo MUST be retained** across the redesign. Only its container / framing / background may change. Before editing anything:

1. Locate every reference to the logo in the repo. Grep for `logo`, `favicon`, `brand`, `icon`, `<img`, `background-image`, `mask-image`, `svg` inside the header/footer/nav partials. List every path you find.
2. For each logo asset, record:
   - Where it lives (e.g. `/assets/logo.svg`, `/img/logo.png`, inlined `<svg>…</svg>`).
   - Format (SVG / PNG / inline SVG / font-icon / CSS background).
   - Dimensions and intrinsic aspect ratio.
   - Whether it uses `currentColor` / `fill="none"` (so it can invert with theme) or is color-baked.
   - Whether it has an accessible `<title>` or `role="img"` + `aria-label`.
   - Where it's rendered (header, footer, favicon, social meta, loading screen, booking confirmation, etc.).
3. Rate the current logo implementation against this checklist and report pass/fail:
   - [ ] Stored once, referenced everywhere (no duplicated inline copies drifting out of sync).
   - [ ] SVG preferred over PNG. If PNG, has a 2× retina version.
   - [ ] Has semantic alt text (`alt="Mdubusi Mathematics"`, not `alt="logo"`).
   - [ ] Wrapped in an `<a href="/" aria-label="Mdubusi Mathematics home">` in the header.
   - [ ] Uses `currentColor` / CSS variable for fill so it adapts to light & dark modes.
   - [ ] Has favicon (`.ico`), apple-touch-icon (180×180 PNG), maskable PWA icon, and Open Graph image variants.
   - [ ] Not inlined as a huge base64 blob that blocks HTML parsing.
   - [ ] Width/height attributes set so it doesn't cause layout shift (CLS).
   - [ ] Print stylesheet doesn't break it.
4. Fixes allowed: re-wrap in a semantic `<a>`, add `aria-label`, switch a PNG to SVG **only if the SVG already exists in the repo**, add missing favicon/meta variants, recolor via `currentColor` so it adapts to theme.
5. Fixes NOT allowed: redrawing the logo, replacing it with a different mark, changing the wordmark typography, altering its proportions, adding AI-generated alternatives.
6. In light mode the logo uses its current colors; in dark mode, if the logo has dark strokes, swap to a cream/gold rendering by either (a) using `currentColor` + `color: var(--cream-50)` on dark backgrounds, or (b) loading a second prepared asset via `<picture>` with `prefers-color-scheme` sources. Prefer option (a).

### 0.2 Code-quality audit of the rest of the site
Also note (don't fix yet — just report):
- CSS size, duplicated rules, unused selectors (run PurgeCSS or `coverage` tab in DevTools).
- Any inline `style=""` that fights the stylesheet.
- JS errors in the console on each page (the blank Pricing page is almost certainly a thrown exception).
- Console warnings about missing alt text, failed network requests, mixed content.
- Lighthouse scores for Home / Pricing / Booking at mobile + desktop.

---

## 1. What the videos show (issues to fix)

A. **Visual identity is wrong.** The current local build uses a black + bright blue (#2563EB-ish) system with a floating pill navbar and heavy cards. Target is editorial: deep navy + warm cream + muted gold, serif display headings, quieter dividers.

B. **Broken/empty Pricing page.** In `screenshots/14_broken_pricing_page.jpg` the Pricing page renders almost blank — only "All prices inclusive of VAT. Payment processed securely." is visible. Pricing tiers are failing to render.

C. **Hero copy + layout mismatch.** Current: "Hi, I'm Mdubusi — Mathematics Tutor & Mentor" with left-aligned stat-card grid. Target: "Unlock Your Mathematics Potential", eyebrow label "EXPERT MATHEMATICS TUTORING", inline stat strip, subtle math-symbol background.

D. **Tutor section incomplete.** Current shows a "Photo Coming Soon" avatar. Target uses a large navy circle (~360px) with "PS" monogram in gold serif, gold ring, small green availability dot.

E. **"Ready to Start?" CTA wrong palette.** Current: bright blue gradient. Target: solid deep navy, gold pill "Book a Session", outlined "Create Free Account".

F. **Footer underdeveloped.** Current: centered minimal. Target: three-column (brand + blurb · NAVIGATION · LEGAL) with Privacy, Terms, Refund, Cancellation links and a hairline-separated copyright row "© 2026 Mdubusi Mathematics. All rights reserved."

G. **Testimonials styling differs.** Current: blue-circle carousel. Target: three static cream cards with 5 gold stars, quote, small navy avatar + name + grade/city.

H. **"Why Choose" section missing.** Insert between hero and Services with three cards: Expert Guidance, Flexible Scheduling, All Levels Welcome.

I. **Booking flow styling.** Restyle 3-step flow (Session Type → Your Details → Confirm) to navy/gold. Preserve prices: Once-off R350 · Monthly R1 500 · Group R250. Levels: Grade 11, Grade 12, University.

J. **Theme toggle swaps to pure black.** Dark mode should swap to deep navy and keep gold accents — see §4 for the full dark/light spec.

---

## 2. Design system to implement

Create `css/tokens.css` and `@import` it at the top of the main stylesheet:

```css
:root {
  /* Brand palette (shared) */
  --gold-500:    #C8A255;
  --gold-600:    #B08A3E;
  --gold-300:    #E3CB8F;

  /* Light mode (default) */
  --bg:          #FAF3E3;   /* cream */
  --bg-elev:     #FFFFFF;   /* white cards */
  --bg-muted:    #F3E7CC;   /* cream-100 */
  --surface-inverse: #0B1B2B; /* navy hero/footer */
  --text:        #0D1626;
  --text-muted:  #3C4A5E;
  --text-on-inverse: #FAF3E3;
  --line:        rgba(11,27,43,0.12);
  --success-green: #3FA66A;
  --logo-color:  #0B1B2B;   /* logo picks up currentColor */
  color-scheme: light;
}

:root[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:          #0B1B2B;   /* navy background */
    --bg-elev:     #10233A;   /* elevated card */
    --bg-muted:    #17314F;
    --surface-inverse: #FAF3E3;
    --text:        #FAF3E3;
    --text-muted:  #C6D0DF;
    --text-on-inverse: #0B1B2B;
    --line:        rgba(250,243,227,0.12);
    --logo-color:  #FAF3E3;
    color-scheme: dark;
  }
}

body { background: var(--bg); color: var(--text); transition: background .25s ease, color .25s ease; }
```

Typography:
- Display / section titles → `var(--font-serif)` (Playfair Display, 500–600, `letter-spacing: -0.01em`).
- Eyebrow labels ("EXPERT MATHEMATICS TUTORING", "MEET YOUR TUTOR", "NAVIGATION", "LEGAL") → sans, 0.75rem, `letter-spacing: 0.18em`, uppercase, color `var(--gold-500)` on dark surfaces, `var(--text-muted)` on cream.
- Body → Inter, 16px, line-height 1.6.

Buttons:
- `.btn-primary` — gold pill, navy text, icon slot.
- `.btn-outline` — 1.5px solid currentColor, pill, inherits text color (cream on navy, navy on cream).
- `.btn-ghost` — text only, gold underline on hover.

Delete every bright-blue usage (`#2563EB`, `bg-blue-600`, `text-blue-500`, etc.). Greens/reds stay as they are.

---

## 3. Seamless responsiveness — device matrix

The site must render cleanly on every one of these targets without horizontal scroll, overflow, or layout jank. Test in Chrome DevTools Device Toolbar and in real hardware where available.

| Category | Viewport (CSS px) | Notes |
|---|---|---|
| Small phone | 320×568 (iPhone SE 1st gen) | Must not break. Single column, hamburger nav. |
| Phone | 375×667 (iPhone SE 2/3) | |
| Phone | 390×844 (iPhone 14/15) | Primary mobile reference. |
| Phone | 393×852 (Pixel 8) | |
| Phone (XL) | 430×932 (iPhone 15 Pro Max) | |
| Foldable inner | 673×841 (Galaxy Z Fold open) | Watch grid gaps. |
| Small tablet | 768×1024 (iPad mini portrait) | Switch from 1-col to 2-col where specified. |
| Tablet | 820×1180 (iPad Air) | |
| Tablet landscape | 1024×768 | Nav becomes horizontal. |
| Laptop | 1280×800 | |
| Desktop | 1440×900 | Primary desktop reference. |
| Large desktop | 1920×1080 | Max-content-width 1280px, center content. |
| Ultra-wide | 2560×1440 | Same max width; just more side padding. |

Breakpoints to implement (mobile-first):
```css
/* default: 0–639 (mobile) */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md — tablet, 2-col grids */ }
@media (min-width: 1024px) { /* lg — desktop, 3-col grids, horizontal nav */ }
@media (min-width: 1280px) { /* xl — widescreen */ }
@media (min-width: 1536px) { /* 2xl — cap content at 1280px */ }
```

Seamless-responsive rules:
1. **No fixed pixel widths on layout containers.** Use `max-width` + `width: 100%` + `margin-inline: auto`.
2. **Fluid type:** hero H1 uses `clamp(2.25rem, 1.2rem + 4vw, 4.5rem)`. Section H2 `clamp(1.75rem, 1rem + 2.5vw, 3rem)`. Body stays 16–18px.
3. **Fluid spacing:** section padding `padding-block: clamp(3rem, 4vw, 6rem)`.
4. **Grids use `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));`** so cards reflow naturally.
5. **Images:** `max-width: 100%; height: auto; display: block;`. Hero decorative SVGs use `object-fit: cover` inside a wrapper with `aspect-ratio`.
6. **Nav:** below `lg` (1024), collapse into a hamburger drawer. Drawer slides from the right, dims background with `rgba(11,27,43,0.6)`, traps focus, closes on Esc and on link click. The hamburger icon must be ≥44×44px touch target.
7. **Tap targets** everywhere ≥44×44px (`min-height: 44px; min-width: 44px`).
8. **Safe areas** on iOS: `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` on the root container; sticky headers add `padding-top: env(safe-area-inset-top)`.
9. **Reduced motion:** wrap any animation/transition in `@media (prefers-reduced-motion: no-preference) { … }`.
10. **Booking form on mobile:** step cards stack vertically, sticky "Next" button pinned to bottom with `position: sticky; bottom: 0;` and a cream gradient fade above it.
11. **Testimonials on mobile:** the three cream cards become a horizontal snap-scroll carousel (`scroll-snap-type: x mandatory`) with dots.
12. **FAQ:** full-width rows on mobile, no side padding loss.
13. **Footer on mobile:** columns stack; "NAVIGATION" and "LEGAL" each become a collapsed `<details>` block on <640px if the list is long.
14. **Logo:** on mobile the wordmark may hide (`@media (max-width: 480px)`) leaving only the mark; never distort proportions.
15. **Zero horizontal overflow:** add `html, body { overflow-x: clip; }` and verify by dragging the DevTools viewport slider from 320 → 2560 px; nothing should produce a horizontal scrollbar.
16. **Hit-testing the videos:** at 320×568 the hero "Unlock Your Mathematics Potential" wraps to 4 lines with no orphan words; the two CTA buttons stack vertically full-width with 12px gap; the stat strip wraps to two rows with a thin divider.

---

## 4. Dark & light mode — both must work end-to-end

The current toggle exists but produces a harsh pure-black dark mode and doesn't persist. Rebuild as follows.

### 4.1 Source of truth
- Theme is stored as `data-theme="light"` or `data-theme="dark"` on `<html>`.
- Default is "follow system" — no attribute set, `@media (prefers-color-scheme: dark)` governs.
- Once the user clicks the toggle, persist to `localStorage.theme`.
- On page load, read `localStorage.theme` synchronously in a tiny inline `<script>` in `<head>` **before** the stylesheet loads, to avoid a flash of wrong theme (FOUC):

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem('theme');
      if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  })();
</script>
```

### 4.2 Toggle UX
- Place the toggle top-right in the header (desktop) and inside the hamburger drawer (mobile).
- Two icons: sun (light active) / moon (dark active). On hover shows tooltip "Switch to dark mode" / "Switch to light mode".
- Uses `aria-pressed`, `aria-label`, keyboard focusable, activates on Enter/Space.
- Clicking cycles: system → light → dark → system. Or (simpler) light ↔ dark, with a "Match system" option in the footer.

### 4.3 Palette mapping (must be implemented via CSS variables only — no class-based overrides per component)

| Element | Light | Dark |
|---|---|---|
| Page background | `--bg` = `#FAF3E3` cream | `--bg` = `#0B1B2B` navy |
| Elevated card | `#FFFFFF` | `#10233A` |
| Muted card | `#F3E7CC` | `#17314F` |
| Body text | `#0D1626` | `#FAF3E3` |
| Muted text | `#3C4A5E` | `#C6D0DF` |
| Gold accent | `#C8A255` | `#C8A255` (same, slightly brighter `#D8B36D` if contrast fails AA) |
| Hero background | `#0B1B2B` (always navy) | `#0B1B2B` (always navy) |
| Footer background | `#0B1B2B` | `#0B1B2B` |
| Divider line | `rgba(11,27,43,.12)` | `rgba(250,243,227,.12)` |
| Logo | `currentColor` resolving to navy | `currentColor` resolving to cream |
| Form input bg | white | `#10233A` |
| Form input border | `rgba(11,27,43,.2)` | `rgba(250,243,227,.2)` |
| Focus ring | `#C8A255` | `#E3CB8F` (brighter for contrast) |
| Shadows | `rgba(11,27,43,.06)` | `rgba(0,0,0,.4)` |

### 4.4 Contrast requirements
Verify with the axe DevTools extension or a WCAG contrast checker:
- Body text vs background ≥ 4.5:1 in both modes.
- Gold on navy and gold on cream must both clear AA for large text (3:1). If they don't, shift gold slightly (use `--gold-300` on navy, `--gold-600` on cream) via the variable mapping — do not hardcode.

### 4.5 Media & asset handling
- The PS monogram circle flips: navy fill + gold "PS" (light mode) → cream fill + navy "PS" (dark mode), using CSS variables.
- Hero and "Ready to Start?" stay navy in both modes (they're inverse sections); their text and buttons do not change between modes.
- Any raster images with baked-in white backgrounds must be swapped for transparent PNGs or SVGs.
- `<meta name="theme-color">` set via two entries so mobile browser chrome matches:
  ```html
  <meta name="theme-color" content="#FAF3E3" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0B1B2B" media="(prefers-color-scheme: dark)">
  ```

### 4.6 Acceptance tests for theming
- [ ] Toggle flips every page section correctly, no leftover white/black patches.
- [ ] Reload on any page preserves the chosen theme with no flash.
- [ ] System preference change (OS-level) updates the theme if the user hasn't manually chosen.
- [ ] Logo stays legible in both modes.
- [ ] Form inputs, placeholders, disabled states, error states all readable in both modes.
- [ ] PDF/print stylesheet forces light mode regardless of setting.

---

## 5. Page-by-page changes

(Unchanged in intent from v1 — repeated here for completeness. All colors come from tokens in §2; all layouts obey §3; all color-mode behavior obeys §4.)

### 5.1 `index.html` — Home
Header (new nav, hamburger below lg), Hero ("Unlock Your Mathematics Potential" + eyebrow + stat strip + two buttons), **new "Why Choose" section** (3 cards), "How It Works" (01/02/03 navy circles), "What We Teach" (subject cards with Enquire Now), "Meet Your Tutor" (PS monogram + bio), "What Students Say" (3 cream cards with 5-star), "FAQ" (accordion, one open by default), "Ready to Start?" (navy CTA, gold + outline buttons), pro footer (brand + NAVIGATION + LEGAL columns, copyright row).

### 5.2 `pricing.html` — REBUILD
Three pricing cards (Once-off R350 / Monthly R1 500 / Group R250), middle card elevated + "MOST POPULAR" gold tag, features list, Book Now buttons (middle is primary gold, outer two are outlined), VAT note below, "Still have questions?" FAQ anchor link. Investigate why the page currently renders blank — likely a JS error; if so, rebuild pricing as static HTML+CSS that doesn't depend on JS.

### 5.3 `booking.html` — restyle
Stepper (gold completed / navy current / line upcoming), session-type and level cards with gold selected-state border + check, gold pill Next button. Mobile: sticky Next.

### 5.4 `contact.html`
Gold Send Message button, navy social icons with gold hover.

---

## 6. Implementation order

1. Branch: `feat/site-redesign-v2`.
2. Run §0 pre-flight audit; commit `/docs/audit.md`.
3. Add `css/tokens.css`; replace blue usages via search-and-replace.
4. Refactor header (keep current logo, wrap in `<a>`, add `aria-label`, apply `currentColor`), add hamburger drawer.
5. Add the inline theme-boot script in `<head>` of every page.
6. Rewrite hero on `index.html`.
7. Insert new "Why Choose" section.
8. Restyle "How It Works", "What We Teach", "Meet Your Tutor", testimonials, FAQ, "Ready to Start?", footer.
9. Fix `pricing.html`.
10. Restyle `booking.html` stepper and form.
11. QA against the §3 device matrix and §4 dark/light acceptance tests.
12. Run Lighthouse (mobile + desktop) on all pages; target ≥90 across Performance / Accessibility / Best Practices / SEO.
13. Capture screenshots of each page at 390×844, 768×1024, 1440×900 in **both** light and dark modes; save to `/docs/redesign-after/`. Compare with `/docs/redesign-before/`.
14. Open PR "Redesign: navy + cream + gold brand system, responsive, dark-mode ready" with audit report, before/after shots, and Lighthouse numbers.

---

## 7. Guardrails

- **Keep the existing logo.** No redesign, no AI regeneration. Only wrapping, alt text, and `currentColor` treatment may change.
- **Do not change bio, testimonial, or FAQ copy** unless listed above.
- **Do not introduce a new framework.** If it's plain HTML/CSS/JS, keep it plain. If it's Tailwind, extend `tailwind.config`.
- **Do not remove contact form, booking flow, or pricing data** — only restyle and fix.
- After changes, grep for `#2563` and `blue-6` in production code; must return zero matches.
- Validate HTML with the W3C validator; fix any errors.
- Test with keyboard only; every interactive element must be reachable and operable.

---

## 8. Final deliverable

A PR containing:
- `/docs/audit.md` (logo + code-quality audit report).
- Updated `index.html`, `pricing.html`, `booking.html`, `contact.html`, partials.
- `css/tokens.css` + updated main stylesheet.
- `/docs/redesign-before/` and `/docs/redesign-after/` screenshots at three viewports × two themes (= 6 shots per page).
- Lighthouse before/after table in the PR description.
- A note confirming the original logo file is unchanged (`git log --follow` on the logo path should show zero diffs in this PR).

The `screenshots/` folder next to this file shows the exact before (left pane in each frame) vs. target (right pane in each frame). Match the right pane for visual intent, retain the current logo, and make the result seamless on every device in §3 and both modes in §4.
