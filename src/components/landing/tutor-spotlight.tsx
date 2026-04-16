import { AnimatedSection } from '@/components/ui/animated-section'
import { TUTOR_NAME } from '@/lib/constants'

export function TutorSpotlight() {
  return (
    <section id="about" aria-labelledby="tutor-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo / avatar */}
          <AnimatedSection className="flex justify-center md:justify-end">
            <div className="relative">
              {/* Avatar circle */}
              <div
                className="w-72 h-72 md:w-[360px] md:h-[360px] rounded-full bg-navy flex items-center justify-center"
                aria-label={`Photo of ${TUTOR_NAME}`}
              >
                <span className="font-display text-7xl md:text-9xl font-medium text-gold">
                  PS
                </span>
              </div>
              {/* Decorative ring */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-4 border-gold/30 scale-110"
              />
              {/* Green accent dot */}
              <div
                aria-hidden="true"
                className="absolute bottom-4 right-4 w-5 h-5 bg-green rounded-full border-2 border-white"
              />
            </div>
          </AnimatedSection>

          {/* Bio */}
          <AnimatedSection delay={0.15}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-gold" />
              <span className="text-gold text-sm font-medium tracking-wide uppercase">Meet Your Tutor</span>
            </div>

            <h2 id="tutor-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-2">
              {TUTOR_NAME}
            </h2>

            <p className="text-muted-foreground text-sm mb-6">
              BSc Mathematics (cum laude) · PGCE Education · 5+ years private tutoring
            </p>

            <blockquote className="border-l-4 border-gold pl-5 mb-6">
              <p className="text-ink text-lg leading-relaxed italic">
                &ldquo;Mathematics is not about memorising formulas — it&apos;s about developing
                logical thinking and problem-solving skills that last a lifetime.&rdquo;
              </p>
            </blockquote>

            <div className="space-y-3 text-muted-foreground">
              <p>
                With a passion for making mathematics accessible, {TUTOR_NAME} specialises
                in breaking down complex concepts into clear, manageable steps. Every
                student learns differently, and sessions are tailored to meet each
                student&apos;s unique pace and learning style.
              </p>
              <p>
                From high school algebra to university-level calculus, the focus is always
                on deep understanding — not just passing the next test.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Grade 11 & 12', 'University Maths', 'Exam Preparation', 'Statistics', 'Calculus'].map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-navy/10 text-navy px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
