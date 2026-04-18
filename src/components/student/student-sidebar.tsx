'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  LayoutDashboard, Clock, BookOpen, MessageCircle,
  User, Settings, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { SOCIAL_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/sessions',  label: 'Sessions',    icon: Clock },
  { href: '/book',      label: 'Book Session', icon: BookOpen },
  { href: '/profile',   label: 'Profile',     icon: User },
  { href: '/settings',  label: 'Settings',    icon: Settings },
]

interface Props { firstName: string; avatarUrl?: string | null; initials?: string }

export function StudentSidebar({ firstName, avatarUrl, initials }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function closeMobile() { setMobileOpen(false) }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/60">
        <Link href="/dashboard" onClick={closeMobile} className="focus-visible:outline-none">
          <Logo variant="on-light" className="h-8 w-auto" />
        </Link>
      </div>

      {/* User greeting */}
      <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-navy flex items-center justify-center flex-shrink-0 ring-2 ring-gold/30">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={firstName} width={36} height={36} className="object-cover w-full h-full" />
          ) : (
            <span className="text-xs font-bold text-white select-none">{initials ?? firstName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground leading-none mb-0.5">Hi there,</p>
          <p className="font-semibold text-ink text-sm truncate">{firstName}</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Student navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={closeMobile}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px]',
                active
                  ? 'bg-navy text-white'
                  : 'text-muted-foreground hover:text-ink hover:bg-cream',
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          )
        })}

        {/* WhatsApp — external link */}
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#25D366] hover:bg-[#25D366]/10 transition-colors min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          WhatsApp PS
        </a>
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-border/60">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-ink hover:bg-cream transition-colors w-full min-h-[44px]"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-border shadow-sm fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-border shadow-sm flex items-center justify-between px-4 h-14">
        <Link href="/dashboard" className="focus-visible:outline-none">
          <Logo variant="on-light" className="h-7 w-auto" />
        </Link>
        <button
          className="p-2 rounded-lg text-muted-foreground hover:text-ink hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
