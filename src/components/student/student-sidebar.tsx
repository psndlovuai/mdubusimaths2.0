'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  LayoutDashboard, Clock, BookOpen, MessageCircle,
  User, Settings, LogOut, Menu, X, ChevronRight, MoreHorizontal,
} from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { SOCIAL_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const MAIN_NAV = [
  { href: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/sessions',  label: 'Sessions',     icon: Clock },
  { href: '/book',      label: 'Book Session', icon: BookOpen },
]

const BOTTOM_NAV = [
  { href: '/profile',  label: 'Profile',  icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface Props { firstName: string; avatarUrl?: string | null; initials?: string; email?: string }

export function StudentSidebar({ firstName, avatarUrl, initials, email }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [popupOpen, setPopupOpen]   = useState(false)

  function closeMobile() { setMobileOpen(false) }

  function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
    return (
      <Link
        href={href}
        onClick={closeMobile}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px]',
          active ? 'bg-navy text-white' : 'text-muted-foreground hover:text-ink hover:bg-cream',
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        {label}
        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
      </Link>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/60">
        <Link href="/dashboard" onClick={closeMobile} className="focus-visible:outline-none">
          <Logo variant="on-light" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Student navigation">
        {MAIN_NAV.map(item => <NavLink key={item.href} {...item} />)}

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

      {/* Bottom user strip */}
      <div className="border-t border-border/60 px-3 py-3 bg-cream/50 relative">
        {/* Popup menu */}
        {popupOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setPopupOpen(false)} aria-hidden="true" />
            <div className="absolute bottom-full left-3 right-3 mb-2 z-20 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
              {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => { setPopupOpen(false); closeMobile() }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-ink hover:bg-cream transition-colors"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              ))}
              <div className="border-t border-border/60" />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Sign out
              </button>
            </div>
          </>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-navy flex items-center justify-center flex-shrink-0 ring-2 ring-white">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={firstName} width={32} height={32} className="object-cover w-full h-full" />
            ) : (
              <span className="text-[11px] font-bold text-white select-none">{initials ?? firstName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink truncate">{firstName}</p>
            {email && <p className="text-[10px] text-muted-foreground truncate">{email}</p>}
          </div>
          <button
            onClick={() => setPopupOpen(o => !o)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-ink hover:bg-border/40 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Account menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
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

      {/* ── Mobile drawer ── */}
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
