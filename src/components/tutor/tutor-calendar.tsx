'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Video, Clock, Users, Calendar, User } from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { TYPE_DOT, TYPE_BORDER, TYPE_PILL, LEGEND } from '@/lib/session-colors'
import type { BookingDto } from '@/application/dto/booking-dto'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function sessionIcon(type: string) {
  if (type === 'group')      return <Users className="w-3.5 h-3.5" />
  if (type === 'meet_greet') return <Video className="w-3.5 h-3.5" />
  return <Clock className="w-3.5 h-3.5" />
}

interface Props { sessions: BookingDto[] }

export function TutorCalendar({ sessions }: Props) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  // Calendar grid
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )
  while (cells.length % 7 !== 0) cells.push(null)

  // Group sessions by YYYY-MM-DD
  const byDate: Record<string, BookingDto[]> = {}
  for (const s of sessions) {
    const d   = new Date(s.startTime)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    if (!byDate[key]) byDate[key] = []
    byDate[key].push(s)
  }

  // Upcoming confirmed sessions sorted ascending
  const upcoming = sessions
    .filter(s => s.status === 'confirmed' && new Date(s.startTime) > today)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return (
    <div className="space-y-6">
      {/* ── Calendar grid ── */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="font-semibold text-ink">{MONTHS[month]} {year}</h2>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full hover:bg-cream flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map(d => (
            <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return (
              <div key={`blank-${i}`} className="h-16 border-b border-r border-border/50 last:border-r-0 bg-cream/30" />
            )
            const key         = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
            const daySessions = byDate[key] ?? []
            const isToday     = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

            return (
              <div
                key={key}
                className={cn(
                  'h-16 p-1 border-b border-r border-border/50 last:border-r-0 flex flex-col',
                  isToday && 'bg-gold/5',
                )}
              >
                <span className={cn(
                  'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full self-start',
                  isToday ? 'bg-gold text-white' : 'text-ink',
                )}>
                  {day}
                </span>
                {/* Show up to 3 coloured dots, then a +N overflow */}
                <div className="flex flex-wrap gap-0.5 mt-0.5 px-0.5">
                  {daySessions.slice(0, 3).map(s => (
                    <span
                      key={s.id}
                      className={cn('w-2 h-2 rounded-full flex-shrink-0', TYPE_DOT[s.sessionType] ?? 'bg-navy')}
                      title={`${s.sessionTypeLabel}${s.studentName ? ` — ${s.studentName}` : ''}`}
                    />
                  ))}
                  {daySessions.length > 3 && (
                    <span className="text-[9px] text-muted-foreground leading-none self-center">
                      +{daySessions.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-border flex flex-wrap gap-4">
          {LEGEND.map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn('w-2.5 h-2.5 rounded-full', TYPE_DOT[key])} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Upcoming sessions list ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <Calendar className="w-4 h-4 text-navy" />
            Upcoming Sessions
            {upcoming.length > 0 && (
              <span className="text-xs font-medium bg-navy/10 text-navy px-2 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </h2>
          <Link href="/tutor/bookings" className="text-xs text-navy hover:underline">
            View all
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-ink mb-1">No upcoming sessions</p>
            <p className="text-sm text-muted-foreground">Sessions booked by students will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcoming.map(s => (
              <article
                key={s.id}
                className={cn(
                  'bg-white rounded-xl shadow-card p-4 flex items-start gap-4 border-l-4',
                  TYPE_BORDER[s.sessionType] ?? 'border-l-navy',
                )}
              >
                {/* Date block */}
                <div className="flex-shrink-0 w-12 text-center">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">
                    {new Date(s.startTime).toLocaleDateString('en-ZA', { month: 'short', timeZone: 'Africa/Johannesburg' })}
                  </p>
                  <p className="text-2xl font-bold text-navy leading-none">
                    {new Date(s.startTime).getDate()}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatTime(s.startTime)}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Student name */}
                  {s.studentName && (
                    <div className="flex items-center gap-1 mb-0.5">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs font-semibold text-ink truncate">{s.studentName}</p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground truncate">
                    {s.subject}{s.topic ? ` · ${s.topic}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1', TYPE_PILL[s.sessionType] ?? '')}>
                      {sessionIcon(s.sessionType)}
                      {s.sessionTypeLabel}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Video className="w-3 h-3" /> Online
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
