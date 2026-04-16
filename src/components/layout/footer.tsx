import Link from 'next/link'
import { BRAND_NAME, SOCIAL_LINKS } from '@/lib/constants'
import { Logo } from '@/components/layout/logo'

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

// Simple inline SVG icons (keeps bundle small — no extra icon package needed)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
  { href: SOCIAL_LINKS.facebook,  label: 'Facebook',  Icon: FacebookIcon },
  { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: SOCIAL_LINKS.linkedin,  label: 'LinkedIn',  Icon: LinkedInIcon },
]

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white" aria-label="Site footer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="md:col-span-1">
          <Logo variant="on-dark" className="h-10 w-auto mb-4" />
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mt-4">
            Expert mathematics tutoring for South African students — Grades 11, 12, and university level.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-6">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation" className="md:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Navigation</h3>
          <ul className="space-y-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Policy links */}
        <nav aria-label="Legal links" className="md:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Legal</h3>
          <ul className="space-y-2">
            {POLICY_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact / CTA column */}
        <div className="md:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Contact</h3>
          <ul className="space-y-3">
            <li>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
            </li>
            <li>
              <a
                href="mailto:support@mdubusimaths.co.za"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                support@mdubusimaths.co.za
              </a>
            </li>
          </ul>

          <Link
            href="/book"
            className="inline-flex items-center justify-center mt-6 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-dark"
          >
            Book a Session
          </Link>
        </div>
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
