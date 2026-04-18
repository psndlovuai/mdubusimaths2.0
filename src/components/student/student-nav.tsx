'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, X, BookOpen, LayoutDashboard, Clock, User, LogOut, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { SOCIAL_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sessions',  label: 'Sessions',  icon: Clock },
  { href: '/profile',   label: 'Profile',   icon: User },
]

interface StudentNavProps {
  firstName: string
}

export function StudentNav({ firstName }: StudentNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/dashboard" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
            <Logo variant="on-light" className="h-8 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Student navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-cream text-navy'
                    : 'text-muted-foreground hover:text-ink hover:bg-cream',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* WhatsApp shortcut */}
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-full px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              aria-label="Message PS on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp PS
            </a>

            {/* Book session */}
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-white text-sm font-semibold rounded-full px-4 py-2 transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            >
              <BookOpen className="w-4 h-4" />
              Book Session
            </Link>

            <span className="hidden md:block text-sm text-muted-foreground pl-1">
              Hi, {firstName}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-ink hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
            className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1"
            aria-label="Mobile student navigation"
          >
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]',
                  pathname === href ? 'bg-cream text-navy' : 'text-muted-foreground hover:text-ink hover:bg-cream',
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gold hover:bg-cream min-h-[44px]"
            >
              <BookOpen className="w-4 h-4" />
              Book Session
            </Link>

            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-green hover:bg-cream min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp PS
            </a>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-muted-foreground hover:text-ink hover:bg-cream min-h-[44px] w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign out ({firstName})
            </button>
          </nav>
        )}
      </header>
    </>
  )
}
