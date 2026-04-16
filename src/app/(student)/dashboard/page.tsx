import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import Link from 'next/link'
import { CalendarDays, ChevronRight, BookOpen, UserCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  confirmed:  { label: 'Confirmed',       className: 'bg-green/10 text-green border border-green/20' },
  pending:    { label: 'Pending Payment', className: 'bg-gold/10 text-gold-dark border border-gold/20' },
  cancelled:  { label: 'Cancelled',       className: 'bg-muted/40 text-muted-foreground border border-border' },
  completed:  { label: 'Completed',       className: 'bg-navy/10 text-navy border border-navy/20' },
}
const DEFAULT_STATUS = STATUS_MAP['confirmed']!

function statusBadge(status: string) {
  const s = STATUS_MAP[status] ?? DEFAULT_STATUS
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>
      {s.label}
    </span>
  )
}

function typeBadge(label: string) {
  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/20">
      {label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
  })
}

export default async function DashboardPage() {
  const session  = await auth()
  const userId   = session!.user.id
  const name     = session!.user.name ?? ''
  const firstName = name.split(' ')[0] ?? 'Student'

  const c        = container()
  const upcoming = await c.listUpcomingSessions.execute(userId)
  const sessions = upcoming.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">
          {greeting()}, {firstName}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString('en-ZA', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* Upcoming sessions */}
      <section aria-labelledby="upcoming-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="upcoming-heading" className="font-semibold text-ink flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-navy" />
            Upcoming Sessions
          </h2>
          {sessions.length > 0 && (
            <Link
              href="/sessions"
              className="text-sm text-blue hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-ink mb-1">No upcoming sessions yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Book your first session to get started
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-colors min-h-[44px]"
            >
              <BookOpen className="w-4 h-4" />
              Book a Session
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <article
                key={s.id}
                className="bg-white rounded-xl shadow-card p-5 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{s.subject}</p>
                  {s.topic && (
                    <p className="text-sm text-muted-foreground truncate">{s.topic}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(s.startTime)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {typeBadge(s.sessionTypeLabel)}
                  {statusBadge(s.status)}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className="font-semibold text-ink mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/book"
            className="bg-gold hover:bg-gold-dark text-white rounded-xl p-5 flex items-center gap-3 transition-colors group min-h-[44px]"
          >
            <BookOpen className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Book a Session</p>
              <p className="text-xs text-white/80">Once-off, monthly, or group</p>
            </div>
          </Link>
          <Link
            href="/sessions"
            className="bg-white hover:bg-cream text-ink rounded-xl p-5 flex items-center gap-3 shadow-card transition-colors min-h-[44px]"
          >
            <CalendarDays className="w-5 h-5 text-navy flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Session History</p>
              <p className="text-xs text-muted-foreground">View all past sessions</p>
            </div>
          </Link>
          <Link
            href="/profile"
            className="bg-white hover:bg-cream text-ink rounded-xl p-5 flex items-center gap-3 shadow-card transition-colors min-h-[44px]"
          >
            <UserCircle className="w-5 h-5 text-navy flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Edit Profile</p>
              <p className="text-xs text-muted-foreground">Update your details</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
