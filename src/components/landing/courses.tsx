import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/animated-section'

const COURSES = [
  {
    level:       'Grade 11',
    audience:    'For students in Grade 11 completing the NSC curriculum',
    colour:      'bg-navy/10 text-navy border-navy/20',
    topics: [
      'Algebra & Functions',
      'Euclidean Geometry',
      'Trigonometry',
      'Statistics & Probability',
      'Analytical Geometry',
      'Finance & Growth',
    ],
    delay: 0,
  },
  {
    level:       'Grade 12',
    audience:    'For matric students preparing for final NSC examinations',
    colour:      'bg-gold/10 text-gold-dark border-gold/20',
    topics: [
      'Calculus (Differential)',
      'Probability & Counting',
      'Analytical Geometry',
      'Trigonometry (Compound Angles)',
      'Functions & Graphs',
      'Statistics',
    ],
    delay: 0.1,
  },
  {
    level:       'University Maths',
    audience:    'For undergraduate and honours students',
    colour:      'bg-green/10 text-green border-green/20',
    topics: [
      'Differential Calculus',
      'Integral Calculus',
      'Linear Algebra',
      'Differential Equations',
      'Statistics & Probability',
      'Real Analysis',
    ],
    delay: 0.2,
  },
]

export function Courses() {
  return (
    <section id="courses" aria-labelledby="courses-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="courses-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            What We Teach
          </h2>
          <p className="text-muted-foreground text-lg">
            Structured, curriculum-aligned content at every level.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSES.map(({ level, audience, colour, topics, delay }) => (
            <AnimatedSection key={level} delay={delay}>
              <article className="bg-white rounded-xl shadow-card p-7 h-full flex flex-col">
                <span className={`inline-flex self-start text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${colour}`}>
                  {level}
                </span>
                <p className="text-sm text-muted-foreground mb-5">{audience}</p>
                <ul className="space-y-2 flex-1" aria-label={`${level} topics`}>
                  {topics.map(topic => (
                    <li key={topic} className="flex items-center gap-2 text-sm text-ink">
                      <span className="w-1.5 h-1.5 rounded-full bg-green flex-shrink-0" aria-hidden="true" />
                      {topic}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className="mt-6 w-full text-center border border-navy text-navy hover:bg-navy hover:text-white font-medium rounded-full py-2.5 text-sm transition-colors min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Book {level}
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
