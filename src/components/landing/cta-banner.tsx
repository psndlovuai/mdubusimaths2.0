import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'

export function CTABanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-gradient-to-b from-navy to-navy-dark py-20 md:py-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          <h2 id="cta-heading" className="font-display text-4xl md:text-6xl font-medium text-white mb-6">
            Ready to Start?
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Book your first session today and take the first step towards
            mathematical confidence and better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full px-8 py-4 text-base transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              <BookOpen className="w-5 h-5" />
              Book a Session
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold rounded-full px-8 py-4 text-base transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Create Free Account
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
