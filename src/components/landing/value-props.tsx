import { User, Users, BookOpenCheck } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'

const SERVICES = [
  {
    icon:        User,
    title:       'Private Tutoring',
    description: 'One-on-one personalised sessions tailored to your learning pace, covering statistics from descriptive analysis to advanced inference — Grade 11 to university level.',
    delay:       0,
  },
  {
    icon:        Users,
    title:       'Group Sessions',
    description: 'Collaborative small-group tutoring where students learn from each other while receiving expert guidance and support. 4–10 students per group.',
    delay:       0.1,
  },
  {
    icon:        BookOpenCheck,
    title:       'Exam Preparation',
    description: 'Intensive exam-focused sessions with past papers, practice problems, and proven strategies to help you achieve top marks.',
    delay:       0.2,
  },
]

export function ValueProps() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">What I Offer</span>
            <span className="w-8 h-0.5 bg-gold" />
          </div>
          <h2 id="services-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            Services I Offer
          </h2>
          <p className="text-muted-foreground text-lg">
            Flexible, results-focused tutoring designed around your goals and schedule.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map(({ icon: Icon, title, description, delay }) => (
            <AnimatedSection key={title} delay={delay}>
              <div className="bg-white rounded-2xl shadow-card p-8 h-full flex flex-col items-center text-center group hover:shadow-lg transition-shadow">
                {/* Circular navy icon — matches left screenshot */}
                <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                  <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-navy text-xl mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
