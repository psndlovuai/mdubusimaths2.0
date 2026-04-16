'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Menu, X, LayoutDashboard, LogIn, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/layout/logo'

interface NavBadge {
  text:  string
  color: string
}

interface NavLink {
  href:   string
  label:  string
  badge?: NavBadge
  isPage?: boolean   // true = <Link>, false = <a href="#">
}

const NAV_LINKS: NavLink[] = [
  { href: '#home',     label: 'Home' },
  { href: '#services', label: 'Services' },
  {
    href:  '#courses',
    label: 'Courses',
    badge: { text: '3 Levels', color: 'bg-gold/25 text-gold' },
  },
  {
    href:  '#pricing',
    label: 'Pricing',
    badge: { text: 'From R350', color: 'bg-green/25 text-green' },
  },
  {
    href:   '/enquire',
    label:  'Enquire',
    badge:  { text: 'New', color: 'bg-white/20 text-white' },
    isPage: true,
  },
  { href: '#about', label: 'About' },
]

function NavItem({ href, label, badge, isPage, onClick }: NavLink & { onClick?: () => void }) {
  const inner = (
    <>
      {label}
      {badge && (
        <span className={cn('ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none', badge.color)}>
          {badge.text}
        </span>
      )}
    </>
  )

  const cls = 'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white/75 hover:text-white hover:bg-white/10 transition-colors'

  return isPage
    ? <Link href={href} className={cls} onClick={onClick}>{inner}</Link>
    : <a    href={href} className={cls} onClick={onClick}>{inner}</a>
}

function MobileNavItem({ href, label, badge, isPage, onClick }: NavLink & { onClick?: () => void }) {
  const inner = (
    <span className="flex items-center gap-2">
      {label}
      {badge && (
        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none', badge.color)}>
          {badge.text}
        </span>
      )}
    </span>
  )

  const cls = 'flex items-center px-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors min-h-[44px]'

  return isPage
    ? <Link href={href} className={cls} onClick={onClick}>{inner}</Link>
    : <a    href={href} className={cls} onClick={onClick}>{inner}</a>
}

export function Navbar() {
  const { data: session } = useSession()
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const role      = session?.user?.role
  const isStudent = role === 'STUDENT'
  const isTutor   = role === 'TUTOR'
  const loggedIn  = isStudent || isTutor

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled ? 'bg-transparent px-4 pt-3 pb-0' : 'bg-navy',
      )}
    >
      {/* Island wrapper */}
      <div
        className={cn(
          'bg-navy transition-all duration-500',
          scrolled && 'rounded-2xl shadow-2xl shadow-black/40 border border-white/10',
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            aria-label="Mdubusi Mathematics — home"
          >
            <Logo variant="on-dark" priority className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <NavItem key={link.href} {...link} />
            ))}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {loggedIn ? (
              <Link
                href={isTutor ? '/tutor/dashboard' : '/dashboard'}
                className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                <LayoutDashboard className="w-4 h-4" />
                {isTutor ? 'Tutor Dashboard' : 'My Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 border border-white/30 hover:border-white text-white/80 hover:text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
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
        <div className={cn(
          'lg:hidden bg-navy border-t border-white/10 px-4 py-3 flex flex-col gap-1 shadow-lg',
          scrolled && 'rounded-b-2xl',
        )}>
          {NAV_LINKS.map(link => (
            <MobileNavItem key={link.href} {...link} onClick={() => setOpen(false)} />
          ))}

          <div className="border-t border-white/10 pt-3 mt-2 flex flex-col gap-2">
            {loggedIn ? (
              <Link
                href={isTutor ? '/tutor/dashboard' : '/dashboard'}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 bg-gold text-white font-semibold rounded-full px-5 py-3 text-sm min-h-[44px]"
              >
                <LayoutDashboard className="w-4 h-4" />
                {isTutor ? 'Tutor Dashboard' : 'My Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold rounded-full px-5 py-3 text-sm min-h-[44px]"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gold text-white font-semibold rounded-full px-5 py-3 text-sm min-h-[44px]"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
