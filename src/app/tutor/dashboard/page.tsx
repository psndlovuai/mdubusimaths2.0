import { container } from '@/infrastructure/container'
import { toBookingDto } from '@/application/dto/mappers'
import { TUTOR_NAME } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tutor Dashboard' }

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function formatRevenue(cents: number) {
  return `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-ZA', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
  })
}

export default async function TutorDashboardPage() {
  const c = container()

  const [stats, todaySessions, allUpcoming, students] = await Promise.all([
    c.getDashboardStats.execute(),
    c.bookings.findTodaysSessions(),
    c.bookings.findAllUpcoming(),
    c.listStudents.execute(),
  ])

  const weekFromNow  = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const weekSessions = allUpcoming.filter(s => s.slot.start <= weekFromNow)

  // Build student name map
  const studentMap = new Map(students.map(s => [s.id, s.fullName]))

  const todayDtos = todaySessions.map(toBookingDto)
  const weekDtos  = weekSessions.map(toBookingDto)

  const STAT_CARDS = [
    { label: "Today's Sessions", value: stats.todayCount,    color: 'text-green' },
    { label: 'This Week',        value: stats.weekCount,     color: 'text-blue' },
    { label: 'Total Revenue',    value: formatRevenue(stats.totalRevenueCents), color: 'text-gold' },
    { label: 'Total Students',   value: stats.studentCount,  color: 'text-navy' },
  ]

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">
          {greeting()}, {TUTOR_NAME}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString('en-ZA', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* Stat cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Overview statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-card p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Today's schedule */}
      <section aria-labelledby="today-heading">
        <h2 id="today-heading" className="font-semibold text-ink mb-4">
          Today&apos;s Schedule
          {todayDtos.length > 0 && (
            <span className="ml-2 text-xs font-medium bg-green/10 text-green px-2 py-0.5 rounded-full">
              {todayDtos.length} session{todayDtos.length !== 1 ? 's' : ''}
            </span>
          )}
        </h2>

        {todayDtos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-6 text-center text-muted-foreground text-sm">
            No sessions scheduled for today
          </div>
        ) : (
          <ol className="space-y-3">
            {todayDtos.map(s => (
              <li key={s.id} className="bg-white rounded-xl shadow-card p-4 flex items-center gap-4">
                <div className="w-14 text-center flex-shrink-0">
                  <span className="text-lg font-bold text-navy">{formatTime(s.startTime)}</span>
                </div>
                <div className="w-px h-10 bg-border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">
                    {studentMap.get(s.studentId) ?? 'Unknown Student'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {s.subject}{s.topic ? ` · ${s.topic}` : ''}
                  </p>
                </div>
                <span className="hidden sm:inline-flex text-xs font-medium bg-blue/10 text-blue border border-blue/20 px-2 py-0.5 rounded-full flex-shrink-0">
                  {s.sessionTypeLabel}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Upcoming this week */}
      <section aria-labelledby="week-heading">
        <h2 id="week-heading" className="font-semibold text-ink mb-4">
          Upcoming This Week
          {weekDtos.length > 0 && (
            <span className="ml-2 text-xs font-medium bg-blue/10 text-blue px-2 py-0.5 rounded-full">
              {weekDtos.length}
            </span>
          )}
        </h2>

        {weekDtos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-6 text-center text-muted-foreground text-sm">
            No upcoming sessions this week
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <caption className="sr-only">Upcoming sessions this week</caption>
              <thead className="border-b border-border bg-cream">
                <tr>
                  {['Date & Time', 'Student', 'Subject', 'Type'].map(h => (
                    <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {weekDtos.map(s => (
                  <tr key={s.id} className="hover:bg-cream/50">
                    <td className="px-4 py-3 text-ink whitespace-nowrap">{formatDate(s.startTime)}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {studentMap.get(s.studentId) ?? 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.subject}{s.topic ? ` · ${s.topic}` : ''}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.sessionTypeLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
