// ─── Session pricing (ZAR cents) ─────────────────────────────────────────────
// These are the source-of-truth prices. Never hardcode prices in UI components.
export const PRICES: Record<string, number> = {
  once_off: 15000,   // R150.00
  monthly:  150000,  // R1,500.00
  group:    25000,   // R250.00
}

// ─── Session display labels ───────────────────────────────────────────────────
export const SESSION_LABELS: Record<string, string> = {
  once_off: 'Once-off (60 min)',
  monthly:  'Monthly Package (24 hrs)',
  group:    'Group Session (2 hrs)',
}

// ─── Brand ───────────────────────────────────────────────────────────────────
export const TUTOR_NAME     = 'PS Ndlovu'
export const BRAND_NAME     = 'Mdubusi Mathematics'
export const SUPPORT_EMAIL  = 'support@mdubusimaths.co.za'

// ─── Social links ────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  whatsapp:  'https://wa.me/27000000000',           // replace with real number
  facebook:  'https://facebook.com/mdubusimaths',
  instagram: 'https://instagram.com/mdubusimaths',
  linkedin:  'https://linkedin.com/company/mdubusimaths',
}

// ─── Cal.com ─────────────────────────────────────────────────────────────────
export const CAL_USERNAME = process.env.CAL_USERNAME ?? 'ps-ndlovu'
