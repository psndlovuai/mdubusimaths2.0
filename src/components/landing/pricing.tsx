import Link from 'next/link'
import { Check } from 'lucide-react'
import { PRICES } from '@/lib/constants'
import { AnimatedSection } from '@/components/ui/animated-section'
import { cn } from '@/lib/utils'

function formatPrice(cents: number) {
  return `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`
}

const PLANS = [
  {
    key:         'once_off' as const,
    label:       'Once-off Session',
    period:      'per session',
    duration:    '60 minutes',
    description: 'Perfect for exam revision or a specific topic you need help with.',
    popular:     false,
    features: [
      '60-minute one-on-one session',
      'Tailored to your specific need',
      'Flexible scheduling',
      'Post-session summary notes',
    ],
    delay: 0,
  },
  {
    key:         'monthly' as const,
    label:       'Monthly Package',
    period:      'per month',
    duration:    '24 hours / month',
    description: 'Ideal for consistent progress throughout the school year or semester.',
    popular:     true,
    features: [
      '24 hours of tutoring per month',
      'Priority scheduling',
      'Progress tracking',
      'Exam & assignment support',
      'Study materials provided',
    ],
    delay: 0.1,
  },
  {
    key:         'group' as const,
    label:       'Group Session',
    period:      'per session',
    duration:    '2 hours',
    description: 'Learn alongside peers in a focused group of up to 6 students.',
    popular:     false,
    features: [
      '2-hour group session',
      'Up to 6 students per group',
      'Shared learning environment',
      'Exam preparation focus',
    ],
    delay: 0.2,
  },
]

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="pricing-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            No hidden fees. Choose the option that suits your learning needs.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map(({ key, label, period, duration, description, popular, features, delay }) => (
            <AnimatedSection key={key} delay={delay}>
              <article
                className={cn(
                  'rounded-xl p-7 flex flex-col h-full relative',
                  popular
                    ? 'border-2 border-gold bg-white shadow-xl'
                    : 'border border-border bg-white shadow-card',
                )}
              >
                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold text-ink text-lg mb-1">{label}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{description}</p>
                  <div className="flex items-end gap-1">
                    <span className="font-display text-5xl font-medium text-navy">
                      {formatPrice(PRICES[key] ?? 0)}
                    </span>
                    <span className="text-muted-foreground text-sm mb-2">{period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{duration}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8" aria-label={`${label} features`}>
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-ink">
                      <Check className="w-4 h-4 text-green flex-shrink-0" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/book"
                  className={cn(
                    'w-full text-center font-semibold rounded-full py-3 text-sm transition-colors min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    popular
                      ? 'bg-gold hover:bg-gold-dark text-white focus-visible:ring-gold'
                      : 'bg-navy hover:bg-navy-dark text-white focus-visible:ring-navy',
                  )}
                >
                  Book Now
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            All prices inclusive of VAT. Payment processed securely by Cal.com.{' '}
            <Link href="/policies/refund" className="text-blue hover:underline">Refund Policy</Link>
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
