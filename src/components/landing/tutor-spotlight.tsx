import { AnimatedSection } from '@/components/ui/animated-section'
import { TUTOR_NAME } from '@/lib/constants'

export function TutorSpotlight() {
  return (
    <section id="about" aria-labelledby="tutor-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">Meet Your Tutor</span>
          </div>

          <h2 id="tutor-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-2">
            {TUTOR_NAME}
          </h2>

          <p className="text-muted-foreground text-sm mb-8">
            BSc Mathematics (cum laude) · PGCE Education · 5+ years private tutoring
          </p>

          <blockquote className="border-l-4 border-gold pl-5 mb-8">
            <p className="text-ink text-xl leading-relaxed italic">
              &ldquo;Mathematics is not about memorising formulas — it&apos;s about developing
              logical thinking and problem-solving skills that last a lifetime.&rdquo;
            </p>
          </blockquote>

          <div className="space-y-4 text-muted-foreground text-[15px] leading-relaxed mb-8">
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

          <div className="flex flex-wrap gap-3">
            {['Grade 11 & 12', 'University Maths', 'Exam Preparation', 'Statistics', 'Calculus'].map(tag => (
              <span
                key={tag}
                className="text-xs font-medium bg-navy/10 text-navy px-3 py-1.5 rounded-full border border-navy/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
