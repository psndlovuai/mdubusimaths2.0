export type SessionTypeValue = 'meet_greet' | 'once_off' | 'group' | 'monthly'

const SLUG_MAP: Record<string, SessionTypeValue> = {
  // Cal.com event type slugs
  'meet-greet-15min': 'meet_greet',
  'once-off-60min':   'once_off',
  'group-120min':     'group',
  'monthly-60min':    'monthly',
  // accept raw values as fallback
  'meet_greet':       'meet_greet',
  'once_off':         'once_off',
  'group':            'group',
  'monthly':          'monthly',
}

// Labels intentionally duplicated — domain must not import from lib/
const LABELS: Record<SessionTypeValue, string> = {
  meet_greet: 'Meet & Greet (15 min)',
  once_off:   'Once-off / Exam Prep (60 min)',
  group:      'Group Session (2 hrs)',
  monthly:    'Monthly Package',
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
