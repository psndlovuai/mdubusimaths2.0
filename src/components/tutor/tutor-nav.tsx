'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, CalendarDays, Users, Settings,
  LogOut, Menu, X, ChevronRight, MoreHorizontal,
} from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/tutor/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/tutor/bookings',     label: 'All Bookings', icon: CalendarDays },
  { href: '/tutor/students',     label: 'Students',     icon: Users },
  { href: '/tutor/availability', label: 'Availability', icon: Settings },
]

interface Props { tutorName: string }

export function TutorNav({ tutorName }: Props) {
  const pathname    = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [popupOpen,  setPopupOpen]  = useState(false)

  function closeMobile() { setMobileOpen(false) }

  function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const active = pathname === href || pathname.startsWith(`${href}/`)
    return (
      <Link
        href={href}
        onClick={closeMobile}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px]',
          active
            ? 'bg-white/15 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/10',
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        {label}
        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
      </Link>
    )
  }

  const initials = tutorName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Logo variant="on-dark" className="h-8 w-auto" />
        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Tutor Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Tutor navigation">
        {NAV_ITEMS.map(item => <NavLink key={item.href} {...item} />)}
      </nav>

      {/* Bottom user strip */}
      <div className="border-t border-white/10 px-3 py-3 bg-white/5 relative">
        {/* Popup */}
        {popupOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setPopupOpen(false)} aria-hidden="true" />
            <div className="absolute bottom-full left-3 right-3 mb-2 z-20 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
              <Link
                href="/tutor/availability"
                onClick={() => { setPopupOpen(false); closeMobile() }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-ink hover:bg-cream transition-colors"
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                Availability
              </Link>
              <div className="border-t border-border/60" />
              <button
                onClick={() => signOut({ callbackUrl: '/tutor/login' })}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Sign out
              </button>
            </div>
          </>
        )}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0 ring-2 ring-white/20">
            <span className="text-[11px] font-bold text-white select-none">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{tutorName}</p>
            <p className="text-[10px] text-white/50">Tutor</p>
          </div>
          <button
            onClick={() => setPopupOpen(o => !o)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
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
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-60 z-30" aria-label="Tutor navigation">
        {sidebarContent}
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden sticky top-0 z-40 bg-navy border-b border-white/10 shadow-sm flex items-center justify-between px-4 h-14">
        <Logo variant="on-dark" className="h-7 w-auto" />
        <button
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
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
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col shadow-xl">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
