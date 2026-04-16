import { ExternalLink, Clock, Calendar, Users } from 'lucide-react'
import { PRICES } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Availability' }

function formatPrice(cents: number) {
  return `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
}

const EVENT_TYPES = [
  {
    slug:      'once-off-60min',
    label:     'Once-off Session',
    duration:  '60 minutes',
    priceKey:  'once_off',
    icon:      Clock,
  },
  {
    slug:      'monthly-60min',
    label:     'Monthly Package',
    duration:  '24 hours / month',
    priceKey:  'monthly',
    icon:      Calendar,
  },
  {
    slug:      'group-120min',
    label:     'Group Session',
    duration:  '120 minutes',
    priceKey:  'group',
    icon:      Users,
  },
]

export default function TutorAvailabilityPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">Manage Availability</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your calendar and availability are managed directly in Cal.com
        </p>
      </div>

      {/* Cal.com link card */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <p className="text-sm text-muted-foreground mb-6">
          Your availability is managed directly in Cal.com. Click below to open your Cal.com dashboard
          and set your available hours, blocked dates, and event type settings.
        </p>
        <a
          href="https://cal.com/dashboard/availability"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white font-semibold rounded-full px-6 py-3 text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          Open Cal.com Availability
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Event types reference */}
      <section aria-labelledby="event-types-heading">
        <h2 id="event-types-heading" className="font-semibold text-ink mb-4">
          Your Event Types (read-only)
        </h2>
        <div className="space-y-3">
          {EVENT_TYPES.map(({ slug, label, duration, priceKey, icon: Icon }) => (
            <div key={slug} className="bg-white rounded-xl shadow-card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink">{label}</p>
                <p className="text-sm text-muted-foreground">{duration}</p>
                <p className="text-xs font-mono text-muted-foreground/70 mt-0.5">/{slug}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-navy text-lg">
                  {formatPrice(PRICES[priceKey] ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">per session</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
