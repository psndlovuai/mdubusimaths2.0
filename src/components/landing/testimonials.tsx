import { AnimatedSection } from '@/components/ui/animated-section'

const TESTIMONIALS = [
  {
    quote:   'PS Ndlovu has an incredible ability to explain difficult concepts in a way that just clicks. My Grade 12 results improved dramatically — I went from 40% to 78% in three months.',
    name:    'Thabo M.',
    context: 'Grade 12 student, Johannesburg',
    initials:'TM',
  },
  {
    quote:   'The monthly package is excellent value. I was failing first-year calculus and now I genuinely understand it. The sessions are focused and the explanations are crystal clear.',
    name:    'Lerato K.',
    context: 'University of Pretoria, 1st Year',
    initials:'LK',
  },
  {
    quote:   'Online sessions are just as effective as in-person, if not more so. I can attend from home and everything is explained at my own pace. Highly recommend!',
    name:    'Siya N.',
    context: 'Grade 11 student, Cape Town',
    initials:'SN',
  },
]

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="testimonials-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            What Students Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Real results from real students.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, context, initials }, i) => (
            <AnimatedSection key={name} delay={i * 0.1}>
              <figure className="bg-cream rounded-xl p-7 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="flex-1 mb-6">
                  <p className="text-ink leading-relaxed text-[15px]">
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>

                <figcaption className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{context}</p>
                  </div>
                </figcaption>
              </figure>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
