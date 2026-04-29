import { container } from '@/infrastructure/container'
import { toBookingDto } from '@/application/dto/mappers'
import { TutorCalendar } from '@/components/tutor/tutor-calendar'
import { TUTOR_NAME } from '@/lib/constants'
import { greeting, formatTime } from '@/lib/utils'
import { TrendingUp, CalendarCheck, Users, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tutor Dashboard' }

function formatRevenue(cents: number) {
  return `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`
}

export default async function TutorDashboardPage() {
  const c = container()

  const [stats, todaySessions, allSessions, students] = await Promise.all([
    c.getDashboardStats.execute(),
    c.bookings.findTodaysSessions(),
    c.bookings.findAll(),
    c.listStudents.execute(),
  ])

  // Build student name map
  const studentMap = new Map(students.map(s => [s.id, s.fullName]))

  // Enrich DTOs with student names
  const allDtos = allSessions.map(s => ({
    ...toBookingDto(s),
    studentName: studentMap.get(s.studentId) ?? 'Unknown',
  }))

  const todayDtos = todaySessions.map(s => ({
    ...toBookingDto(s),
    studentName: studentMap.get(s.studentId) ?? 'Unknown',
  }))

  const STAT_CARDS = [
    { label: "Today",         value: stats.todayCount,                    icon: CalendarCheck, color: 'text-green-600',  bg: 'bg-green-50' },
    { label: "This Week",     value: stats.weekCount,                     icon: TrendingUp,    color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: "Revenue",       value: formatRevenue(stats.totalRevenueCents), icon: DollarSign, color: 'text-amber-600',  bg: 'bg-amber-50' },
    { label: "Students",      value: stats.studentCount,                  icon: Users,         color: 'text-navy',       bg: 'bg-navy/10' },
  ]

  return (
    <div className="space-y-8">
      {/* ── Greeting banner ── */}
      <div className="relative bg-navy rounded-2xl px-6 py-7 overflow-hidden">
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
            {greeting()}, {TUTOR_NAME.split(' ')[0]}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {stats.todayCount === 0
              ? 'No sessions today — enjoy the break'
              : `${stats.todayCount} session${stats.todayCount !== 1 ? 's' : ''} scheduled today`}
          </p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl shadow-card p-5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold leading-none ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Today's schedule ── */}
      {todayDtos.length > 0 && (
        <section>
          <h2 className="font-semibold text-ink mb-3 flex items-center gap-2">
            Today&apos;s Schedule
            <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              {todayDtos.length} session{todayDtos.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <ol className="space-y-2">
            {todayDtos.map(s => (
              <li key={s.id} className="bg-white rounded-xl shadow-card p-4 flex items-center gap-4">
                <div className="w-14 text-center flex-shrink-0">
                  <span className="text-lg font-bold text-navy">{formatTime(s.startTime)}</span>
                </div>
                <div className="w-px h-10 bg-border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{s.studentName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {s.subject}{s.topic ? ` · ${s.topic}` : ''}
                  </p>
                </div>
                <span className="hidden sm:inline-flex text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full flex-shrink-0">
                  {s.sessionTypeLabel}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Calendar ── */}
      <TutorCalendar sessions={allDtos} />
    </div>
  )
}
