import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative overflow-hidden bg-gradient-to-b from-navy to-navy-dark min-h-[92vh] flex items-center"
    >
      {/* Decorative maths elements */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Floating equations */}
        <span className="absolute top-[15%] left-[6%] text-white/5 font-mono text-4xl lg:text-6xl font-light rotate-[-8deg]">∫</span>
        <span className="absolute top-[20%] right-[8%] text-white/5 font-mono text-3xl lg:text-5xl font-light rotate-[6deg]">∑</span>
        <span className="absolute bottom-[25%] left-[4%] text-white/4 font-mono text-2xl lg:text-4xl font-light rotate-[-4deg]">π²</span>
        <span className="absolute top-[55%] right-[5%] text-white/4 font-mono text-3xl lg:text-5xl font-light rotate-[10deg]">√x</span>
        <span className="absolute bottom-[15%] right-[15%] text-white/4 font-mono text-xl lg:text-3xl font-light rotate-[-6deg]">dy/dx</span>
        <span className="absolute top-[40%] left-[3%] text-white/4 font-mono text-2xl font-light rotate-[4deg]">Δ</span>
        {/* Geometric circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-white/5" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full border border-white/4" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        {/* Green accent bar */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-0.5 bg-green" />
          <span className="text-green text-sm font-medium tracking-wide uppercase">Expert Mathematics Tutoring</span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight max-w-3xl mb-6">
          Unlock Your<br />
          <span className="text-gold">Mathematics</span><br />
          Potential
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Personalised one-on-one and group tutoring for Grade 11, Grade 12, and
          university students. Expert guidance that builds lasting confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full px-8 py-4 text-base transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <BookOpen className="w-5 h-5" />
            Book a Session
          </Link>
          <a
            href="#courses"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold rounded-full px-8 py-4 text-base transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View Courses
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-14 flex flex-wrap items-center gap-6 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <span className="text-green font-bold text-2xl">5+</span>
            <span>Years experience</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-green font-bold text-2xl">100%</span>
            <span>Online tutoring</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-green font-bold text-2xl">3</span>
            <span>Session types available</span>
          </div>
        </div>
      </div>
    </section>
  )
}
