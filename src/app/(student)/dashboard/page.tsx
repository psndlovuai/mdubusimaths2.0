import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import { SessionCalendar } from '@/components/student/session-calendar'
import { BookOpen, TrendingUp, CalendarCheck } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const session   = await auth()
  const userId    = session!.user.id
  const name      = session!.user.name ?? ''
  const firstName = name.split(' ')[0] ?? 'Student'

  const sessions = await container().listStudentSessions.execute(userId)

  const now       = new Date()
  const upcoming  = sessions.filter(s => s.status === 'confirmed' && new Date(s.startTime) > now)
  const completed = sessions.filter(s => s.status === 'completed')

  const nextSession = upcoming[0]
  const nextLabel   = nextSession
    ? new Date(nextSession.startTime).toLocaleDateString('en-ZA', {
        weekday: 'short', day: 'numeric', month: 'short',
        timeZone: 'Africa/Johannesburg',
      })
    : null

  return (
    <div className="space-y-6">
      {/* ── Greeting banner ── */}
      <div className="relative bg-navy rounded-2xl px-6 py-7 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gold/20" />
        <div className="absolute -bottom-8 right-16 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
            {new Date().toLocaleDateString('en-ZA', {
              weekday: 'long', day: 'numeric', month: 'long',
              timeZone: 'Africa/Johannesburg',
            })}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-white">
            {greeting()}, {firstName}
          </h1>
          {nextLabel ? (
            <p className="text-white/70 text-sm mt-1">
              Next session: <span className="text-white font-medium">{nextLabel}</span>
            </p>
          ) : (
            <p className="text-white/70 text-sm mt-1">No upcoming sessions — book one below</p>
          )}
        </div>

        {/* Book CTA inside banner */}
        <Link
          href="/book"
          className="relative mt-5 inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Book a session
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl shadow-card px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-5 h-5 text-gold-dark" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy leading-none">{upcoming.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Upcoming</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-navy" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy leading-none">{completed.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Completed</p>
          </div>
        </div>
      </div>

      {/* ── Sessions calendar ── */}
      <SessionCalendar sessions={sessions} />
    </div>
  )
}
