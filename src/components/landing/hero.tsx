import Link from 'next/link'
import { BookOpen, ChevronRight } from 'lucide-react'
import { TUTOR_NAME, SOCIAL_LINKS } from '@/lib/constants'

const STATS = [
  { value: '6+',   label: 'Years Experience' },
  { value: '100+', label: 'Students Helped'  },
  { value: '95%',  label: 'Pass Rate'        },
]

// Inline social SVGs — same as footer
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const SOCIALS = [
  { href: SOCIAL_LINKS.whatsapp,  label: 'WhatsApp',  Icon: WhatsAppIcon },
  { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: SOCIAL_LINKS.tiktok,    label: 'TikTok',    Icon: TikTokIcon },
  { href: SOCIAL_LINKS.linkedin,  label: 'LinkedIn',  Icon: LinkedInIcon },
]

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Hero"
      className="relative overflow-hidden bg-navy-dark"
    >
      {/* Subtle decorative maths symbols — no circle outlines */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-[12%] right-[6%]  text-white/4 font-mono text-5xl lg:text-7xl font-light rotate-[6deg]">∑</span>
        <span className="absolute bottom-[20%] left-[3%]  text-white/4 font-mono text-3xl lg:text-5xl font-light rotate-[-4deg]">π²</span>
        <span className="absolute top-[55%] right-[4%]  text-white/3 font-mono text-4xl lg:text-6xl font-light rotate-[10deg]">√x</span>
        <span className="absolute top-[35%] left-[2%]  text-white/3 font-mono text-2xl font-light rotate-[4deg]">Δ</span>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

          {/* ── Left column: text + CTAs + socials ── */}
          <div className="lg:col-span-3">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-0.5 bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">
                Mathematics Tutor &amp; Mentor
              </span>
            </div>

            <h1 className="font-display font-medium text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.5rem, 1.5rem + 4vw, 4.5rem)' }}>
              Hi, I&apos;m{' '}
              <span className="text-gold">{TUTOR_NAME}</span>
            </h1>

            <p className="text-white/65 text-lg leading-relaxed max-w-lg mb-8">
              Passionate mathematics tutor dedicated to helping students unlock their
              full potential. From high school to university level, I make complex
              mathematical concepts simple and accessible.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full px-8 py-4 text-base transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-dark"
              >
                <BookOpen className="w-5 h-5" />
                Book a Session
              </Link>
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-gold hover:text-gold text-white/80 font-semibold rounded-full px-8 py-4 text-base transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                View Courses
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs uppercase tracking-widest mr-1">Follow</span>
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 hover:border-gold hover:text-gold flex items-center justify-center text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Right column: stat cards ── */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/10 rounded-2xl px-7 py-6 flex items-center gap-5 hover:bg-white/8 hover:border-gold/30 transition-colors"
              >
                <span className="font-display text-5xl font-semibold text-gold leading-none flex-shrink-0">
                  {value}
                </span>
                <span className="text-white/70 text-base leading-snug">{label}</span>
              </div>
            ))}

            {/* Available badge */}
            <div className="bg-green/10 border border-green/20 rounded-2xl px-7 py-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green flex-shrink-0 animate-pulse" />
              <span className="text-green text-sm font-medium">Currently accepting new students</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
