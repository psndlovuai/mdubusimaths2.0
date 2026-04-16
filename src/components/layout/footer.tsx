import Link from 'next/link'
import { BRAND_NAME } from '@/lib/constants'

const NAV_LINKS = [
  { href: '#home',    label: 'Home' },
  { href: '#courses', label: 'Courses' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about',   label: 'About' },
]

const POLICY_LINKS = [
  { href: '/policies/privacy',      label: 'Privacy Policy' },
  { href: '/policies/terms',        label: 'Terms of Service' },
  { href: '/policies/refund',       label: 'Refund Policy' },
  { href: '/policies/cancellation', label: 'Cancellation Policy' },
]

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white" aria-label="Site footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span aria-hidden="true" className="block w-2.5 h-2.5 bg-green rotate-45 flex-shrink-0" />
            <span className="font-display text-xl font-medium text-white leading-none">{BRAND_NAME}</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Expert mathematics tutoring for South African students — Grades 11, 12, and university level.
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Navigation</h3>
          <ul className="space-y-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Policy links */}
        <nav aria-label="Legal links">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Legal</h3>
          <ul className="space-y-2">
            {POLICY_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <p>South Africa</p>
        </div>
      </div>
    </footer>
  )
}
