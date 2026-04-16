export type SessionTypeValue = 'once_off' | 'monthly' | 'group'

const SLUG_MAP: Record<string, SessionTypeValue> = {
  'once-off-60min': 'once_off',
  'monthly-60min':  'monthly',
  'group-120min':   'group',
  // fallback: accept raw values too
  'once_off':       'once_off',
  'monthly':        'monthly',
  'group':          'group',
}

// Labels are duplicated here intentionally — domain must not import from lib/
const LABELS: Record<SessionTypeValue, string> = {
  once_off: 'Once-off (60 min)',
  monthly:  'Monthly Package (24 hrs)',
  group:    'Group Session (2 hrs)',
}

export class SessionType {
  constructor(public readonly value: SessionTypeValue) {}

  static fromSlug(slug: string): SessionType {
    const mapped = SLUG_MAP[slug]
    if (!mapped) throw new Error(`Unknown Cal.com event type slug: "${slug}"`)
    return new SessionType(mapped)
  }

  get label(): string {
    return LABELS[this.value]
  }
}
