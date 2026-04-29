// ── Single source of truth for session-type colour coding ────────────────────
// Used by both the student and tutor calendars.

/** Dot colour on the calendar grid */
export const TYPE_DOT: Record<string, string> = {
  meet_greet: 'bg-green-400',
  once_off:   'bg-blue-400',
  group:      'bg-purple-400',
  monthly:    'bg-amber-400',
}

/** Left border on upcoming-session cards */
export const TYPE_BORDER: Record<string, string> = {
  meet_greet: 'border-l-green-400',
  once_off:   'border-l-blue-400',
  group:      'border-l-purple-400',
  monthly:    'border-l-amber-400',
}

/** Pill / badge background + text */
export const TYPE_PILL: Record<string, string> = {
  meet_greet: 'bg-green-50  text-green-700  border border-green-200',
  once_off:   'bg-blue-50   text-blue-700   border border-blue-200',
  group:      'bg-purple-50 text-purple-700 border border-purple-200',
  monthly:    'bg-amber-50  text-amber-700  border border-amber-200',
}

export const LEGEND = [
  { key: 'meet_greet', label: 'Meet & Greet' },
  { key: 'once_off',   label: 'Once-off' },
  { key: 'group',      label: 'Group' },
  { key: 'monthly',    label: 'Monthly' },
]
