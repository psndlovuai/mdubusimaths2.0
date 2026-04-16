'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Menu, X, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/logo'

const NAV_LINKS = [
  { href: '#home',     label: 'Home' },
  { href: '#courses',  label: 'Courses' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#about',    label: 'About' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isStudent = session?.user?.role === 'STUDENT'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-border' : 'bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          aria-label="Mdubusi Mathematics — home"
        >
          <Logo
            variant={scrolled ? 'on-light' : 'on-dark'}
            priority
            className="h-9 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                scrolled ? 'text-ink hover:text-navy hover:bg-cream' : 'text-white/80 hover:text-white hover:bg-white/10',
              )}
            >
              {label}
            </a>
          ))}
          {isStudent && (
            <Link
              href="/dashboard"
              className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors', scrolled ? 'text-navy' : 'text-white/80 hover:text-white')}
            >
              My Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden md:inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <BookOpen className="w-4 h-4" />
            Book a Session
          </Link>

          {/* Mobile menu toggle */}
          <button
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              scrolled ? 'text-ink hover:bg-cream' : 'text-white hover:bg-white/10',
            )}
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
          className="md:hidden bg-white border-t border-border px-4 py-3 flex flex-col gap-1 shadow-lg"
          aria-label="Mobile main navigation"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-ink hover:bg-cream transition-colors min-h-[44px]"
            >
              {label}
            </a>
          ))}
          {isStudent && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-navy hover:bg-cream min-h-[44px]"
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
