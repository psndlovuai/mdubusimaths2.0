// ─── Session pricing (ZAR cents) ─────────────────────────────────────────────
// Source of truth. Never hardcode prices in UI components.
export const PRICES: Record<string, number> = {
  meet_greet: 0,       // Free — 15 min introduction call
  once_off:   15000,   // R150 — 60 min one-on-one / exam prep
  group:      40000,   // R400 per person — 2 hr group session (4–10 people)
  monthly:    150000,  // R1,500 — monthly package
}

// ─── Session display labels ───────────────────────────────────────────────────
export const SESSION_LABELS: Record<string, string> = {
  meet_greet: 'Meet & Greet (15 min)',
  once_off:   'Once-off / Exam Prep (60 min)',
  group:      'Group Session (2 hrs)',
  monthly:    'Monthly Package',
}

// ─── Session durations in minutes ────────────────────────────────────────────
export const SESSION_DURATIONS: Record<string, number> = {
  meet_greet: 15,
  once_off:   60,
  group:      120,
  monthly:    60,   // individual session within the package
}

// ─── Brand ───────────────────────────────────────────────────────────────────
export const TUTOR_NAME     = 'PS Ndlovu'
export const BRAND_NAME     = 'Mdubusi Mathematics'
export const SUPPORT_EMAIL  = 'support@mdubusimaths.co.za'

// ─── Social links ────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  whatsapp:  'https://wa.me/27833819069',
  instagram: 'https://www.instagram.com/mdubusimaths?igsh=NGtxd2Q3MTB5b3Fk&utm_source=qr',
  tiktok:    'https://www.tiktok.com/@mdubusimaths',
  linkedin:  'https://www.linkedin.com/in/phelelani-siboniso-ndlovu-b2346320a/',
}

// ─── Cal.com ─────────────────────────────────────────────────────────────────
export const CAL_USERNAME = process.env.CAL_USERNAME ?? 'ps-ndlovu'
