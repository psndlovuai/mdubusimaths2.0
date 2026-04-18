import { AnimatedSection } from '@/components/ui/animated-section'

const STEPS = [
  {
    number:      '01',
    title:       'Book Online',
    description: 'Start with a free 15-minute Meet & Greet or go straight to booking a once-off session, group session, or monthly package. Pick a time that works for you — payment is processed securely at checkout.',
  },
  {
    number:      '02',
    title:       'Join Your Session',
    description: 'All sessions are conducted online via video call. No commuting, no setup hassle — just open the link and learn from anywhere in South Africa at the scheduled time.',
  },
  {
    number:      '03',
    title:       'Achieve Results',
    description: 'Apply what you\'ve learned, track your progress, and build real mathematical confidence. Whether it\'s passing matric, acing exams, or mastering university maths — we\'re with you every step.',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="how-it-works-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Three simple steps — from first visit to your first session.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector line on desktop */}
          <div aria-hidden="true" className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {STEPS.map(({ number, title, description }, i) => (
            <AnimatedSection key={number} delay={i * 0.12}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center">
                    <span className="font-display text-3xl font-medium text-gold">{number}</span>
                  </div>
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
