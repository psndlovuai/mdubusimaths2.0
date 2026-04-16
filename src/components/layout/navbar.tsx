'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Menu, X, BookOpen } from 'lucide-react'
import { Logo } from '@/components/layout/logo'

const NAV_LINKS = [
  { href: '#home',     label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#courses',  label: 'Courses' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#about',    label: 'About' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const isStudent = session?.user?.role === 'STUDENT'

  return (
    <header className="sticky top-0 z-50 w-full bg-navy border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo — always on-dark since bg is always navy */}
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          aria-label="Mdubusi Mathematics — home"
        >
          <Logo variant="on-dark" priority className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-colors"
            >
              {label}
            </a>
          ))}
          {isStudent && (
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-colors"
            >
              My Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden lg:inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <BookOpen className="w-4 h-4" />
            Book a Session
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          className="lg:hidden bg-navy-dark border-t border-white/10 px-4 py-3 flex flex-col gap-1 shadow-lg"
          aria-label="Mobile main navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors min-h-[44px]"
            >
              {label}
            </a>
          ))}
          {isStudent && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 min-h-[44px]"
            >
              My Dashboard
            </Link>
          )}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 bg-gold text-white font-semibold rounded-full px-5 py-3 text-sm mt-2 min-h-[44px]"
          >
            <BookOpen className="w-4 h-4" />
            Book a Session
          </Link>
        </nav>
      )}
    </header>
  )
}
