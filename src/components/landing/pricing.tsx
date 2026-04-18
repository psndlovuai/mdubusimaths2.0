import Link from 'next/link'
import { Check, Video } from 'lucide-react'
import { PRICES } from '@/lib/constants'
import { AnimatedSection } from '@/components/ui/animated-section'
import { cn } from '@/lib/utils'

function formatPrice(cents: number) {
  if (cents === 0) return 'Free'
  return `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`
}

const PLANS = [
  {
    key:         'meet_greet' as const,
    label:       'Meet & Greet',
    period:      '',
    duration:    '15 minutes',
    description: 'Not sure if tutoring is right for you? Start with a free introduction call — no commitment required.',
    popular:     false,
    highlight:   false,
    features: [
      'Free 15-minute online call',
      'Discuss your goals and challenges',
      'Get a feel for the teaching style',
      'No payment required',
    ],
    cta:   'Book Free Call',
    delay: 0,
  },
  {
    key:         'once_off' as const,
    label:       'Once-off / Exam Prep',
    period:      'per session',
    duration:    '60 minutes',
    description: 'A focused one-on-one session on any topic — ideal for exam revision or a concept you\'re stuck on.',
    popular:     false,
    highlight:   false,
    features: [
      '60-minute one-on-one online session',
      'Targeted at your specific topic',
      'Exam preparation focused',
      'Flexible scheduling',
      'Post-session summary notes',
    ],
    cta:   'Book Session',
    delay: 0.08,
  },
  {
    key:         'group' as const,
    label:       'Group Session',
    period:      'per person',
    duration:    '2 hours',
    description: 'Learn alongside peers in a focused online group of up to 6 students on a shared topic.',
    popular:     false,
    highlight:   false,
    features: [
      '2-hour online group session',
      'Up to 6 students per group',
      'Topic agreed at booking',
      'Exam preparation focus',
      'Great for study groups',
    ],
    cta:   'Book Group',
    delay: 0.16,
  },
  {
    key:         'monthly' as const,
    label:       'Monthly Package',
    period:      'per month',
    duration:    'Unlimited sessions',
    description: 'Consistent support throughout the school year or semester with priority scheduling.',
    popular:     true,
    highlight:   true,
    features: [
      'Unlimited 60-min sessions per month',
      'Priority scheduling',
      'Progress tracking & goal setting',
      'Exam & assignment support',
      'Study resources provided',
      'WhatsApp support between sessions',
    ],
    cta:   'Get Started',
    delay: 0.24,
  },
]

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-6">
          <h2 id="pricing-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            All sessions are conducted online. No hidden fees — choose what works for you.
          </p>
        </AnimatedSection>

        {/* Online-only badge */}
        <AnimatedSection className="flex justify-center mb-12">
          <span className="inline-flex items-center gap-2 bg-navy/10 text-navy text-sm font-medium px-4 py-2 rounded-full border border-navy/20">
            <Video className="w-4 h-4" />
            100% Online — join from anywhere in South Africa
          </span>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {PLANS.map(({ key, label, period, duration, description, popular, features, cta, delay }) => (
            <AnimatedSection key={key} delay={delay}>
              <article
                className={cn(
                  'rounded-xl p-6 flex flex-col h-full relative',
                  popular
                    ? 'border-2 border-gold bg-white shadow-xl'
                    : 'border border-border bg-white shadow-card',
                )}
              >
                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                      Best Value
                    </span>
                  </div>
                )}

                {key === 'meet_greet' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-green text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                      Start Here
                    </span>
                  </div>
                )}

                <div className="mb-5 mt-2">
                  <h3 className="font-semibold text-ink text-base mb-1">{label}</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{description}</p>
                  <div className="flex items-end gap-1">
                    <span className={cn(
                      'font-display text-4xl font-medium',
                      key === 'meet_greet' ? 'text-green-700' : 'text-navy',
                    )}>
                      {formatPrice(PRICES[key] ?? 0)}
                    </span>
                    {period && <span className="text-muted-foreground text-xs mb-1.5">{period}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{duration}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7" aria-label={`${label} features`}>
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-ink leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/book"
                  className={cn(
                    'w-full text-center font-semibold rounded-full py-2.5 text-sm transition-colors min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    key === 'meet_greet'
                      ? 'bg-green hover:bg-green/90 text-white focus-visible:ring-green'
                      : popular
                        ? 'bg-gold hover:bg-gold-dark text-white focus-visible:ring-gold'
                        : 'bg-navy hover:bg-navy-dark text-white focus-visible:ring-navy',
                  )}
                >
                  {cta}
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All prices inclusive of VAT · Payment processed securely at checkout ·{' '}
            <Link href="/policies/refund" className="text-navy hover:underline">Refund Policy</Link>
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
