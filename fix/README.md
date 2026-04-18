# Mdubusi Mathematics — Redesign Brief Bundle

Contents:

- `CLAUDE_CODE_FIX_PROMPT.md` — the full, self-contained implementation prompt to paste into Claude Code. Includes the pre-flight logo audit, responsive device matrix, and the dark/light mode spec.
- `screenshots/` — 16 frames pulled from the two WhatsApp walkthroughs. In every frame the **left pane** is the current local site (to be fixed) and the **right pane** is the target production site `mdubusimaths.com` (visual target).

How to use this folder:

1. Open `CLAUDE_CODE_FIX_PROMPT.md` and paste its entire contents into Claude Code as the task prompt.
2. Attach the `screenshots/` folder alongside so Claude Code can see the reference.
3. Claude Code will first run the audit in §0 (logo + code quality) and write `/docs/audit.md`, then proceed through the ordered implementation in §6.

Key constraints to be aware of before starting:

- The existing logo must be kept — only wrapping, alt text, and color-mode handling may change.
- The site must render cleanly from 320 px up to 2560 px (see §3 device matrix).
- Dark and light modes must both work, persist across reloads, and follow OS preference by default (see §4).
- The Pricing page is currently broken (renders blank) and must be rebuilt as part of this pass.
