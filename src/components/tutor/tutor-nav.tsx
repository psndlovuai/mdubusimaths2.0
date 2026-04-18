'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, CalendarDays, Users, Settings, LogOut,
} from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/tutor/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/tutor/bookings',     label: 'All Bookings',  icon: CalendarDays },
  { href: '/tutor/students',     label: 'Students',      icon: Users },
  { href: '/tutor/availability', label: 'Availability',  icon: Settings },
]

export function TutorNav() {
  const pathname = usePathname()

  function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const active = pathname === href || pathname.startsWith(`${href}/`)
    return (
      <Link
        href={href}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px]',
          active
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/10',
        )}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-60 bg-navy z-30 px-4 py-6"
        aria-label="Tutor navigation"
      >
        {/* Logo */}
        <div className="mb-8 px-3">
          <Logo variant="on-dark" className="h-8 w-auto mb-1" />
          <p className="text-xs text-white/40 mt-1">Tutor Portal</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/tutor/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Sign out
        </button>
      </aside>

      {/* ── Mobile bottom nav ──────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-navy border-t border-white/10 flex items-center justify-around px-2 safe-bottom"
        aria-label="Mobile tutor navigation"
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-3 rounded-xl text-xs font-medium transition-colors min-h-[56px] min-w-[60px] justify-center',
                active ? 'text-white' : 'text-white/50 hover:text-white',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
