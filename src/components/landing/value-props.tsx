import { CheckCircle, CalendarDays, GraduationCap } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'

const PROPS = [
  {
    icon:        CheckCircle,
    title:       'Expert Guidance',
    description: 'Results-focused tutoring from a qualified mathematics teacher with 5+ years of proven success helping students achieve their goals.',
    delay:       0,
  },
  {
    icon:        CalendarDays,
    title:       'Flexible Scheduling',
    description: 'Book sessions at times that work for you — fully online, no travel needed. Once-off, monthly packages, or group sessions available.',
    delay:       0.1,
  },
  {
    icon:        GraduationCap,
    title:       'All Levels Welcome',
    description: 'From Grade 11 to university mathematics, we cover every level with tailored content that meets you exactly where you are.',
    delay:       0.2,
  },
]

export function ValueProps() {
  return (
    <section aria-labelledby="value-props-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="value-props-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            Why Choose Mdubusi Mathematics?
          </h2>
          <p className="text-muted-foreground text-lg">
            We believe every student can excel at mathematics with the right support.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROPS.map(({ icon: Icon, title, description, delay }) => (
            <AnimatedSection key={title} delay={delay}>
              <div className="bg-white rounded-xl shadow-card p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-green" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-ink text-xl mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
