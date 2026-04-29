import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import { CancelSessionButton } from '@/components/student/cancel-session-button'
import { TYPE_PILL, TYPE_BORDER } from '@/lib/session-colors'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Sessions' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
  })
}

const SESSION_STATUS_MAP: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed',       className: 'bg-green/10 text-green border border-green/20' },
  pending:   { label: 'Pending Payment', className: 'bg-gold/10 text-gold-dark border border-gold/20' },
  cancelled: { label: 'Cancelled',       className: 'bg-muted/40 text-muted-foreground border border-border' },
  completed: { label: 'Completed',       className: 'bg-navy/10 text-navy border border-navy/20' },
}
const DEFAULT_SESSION_STATUS = SESSION_STATUS_MAP['confirmed']!

function StatusBadge({ status }: { status: string }) {
  const s = SESSION_STATUS_MAP[status] ?? DEFAULT_SESSION_STATUS
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}
      aria-label={`Status: ${s.label}`}
    >
      {s.label}
    </span>
  )
}


export default async function SessionsPage() {
  const session = await auth()
  const userId  = session!.user.id

  const c        = container()
  const sessions = await c.listStudentSessions.execute(userId)

  const now = new Date()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">My Sessions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-10 text-center text-muted-foreground">
          No sessions found. Book your first session to get started!
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {sessions.map(s => {
              const isFuture    = new Date(s.startTime) > now
              const cancellable = s.status === 'confirmed' && isFuture
              return (
                <article key={s.id} className={cn('bg-white rounded-xl shadow-card p-5 space-y-3 border-l-4', TYPE_BORDER[s.sessionType] ?? 'border-l-navy')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate">{s.subject}</p>
                      {s.topic && <p className="text-sm text-muted-foreground truncate">{s.topic}</p>}
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', TYPE_PILL[s.sessionType] ?? '')}>
                      {s.sessionTypeLabel}
                    </span>
                    <span>{formatDate(s.startTime)}</span>
                    <span>· {s.durationMin} min · {s.amountFormatted}</span>
                  </div>
                  {cancellable && (
                    <CancelSessionButton sessionId={s.id} subject={s.subject} />
                  )}
                </article>
              )
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <caption className="sr-only">Session history</caption>
              <thead className="border-b border-border bg-cream">
                <tr>
                  {['Date', 'Subject', 'Topic', 'Type', 'Duration', 'Amount', 'Status', ''].map(h => (
                    <th
                      key={h}
                      scope="col"
                      className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sessions.map(s => {
                  const isFuture    = new Date(s.startTime) > now
                  const cancellable = s.status === 'confirmed' && isFuture
                  return (
                    <tr key={s.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-4 py-3 text-ink whitespace-nowrap">{formatDate(s.startTime)}</td>
                      <td className="px-4 py-3 font-medium text-ink">{s.subject}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.topic ?? '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', TYPE_PILL[s.sessionType] ?? 'text-muted-foreground')}>
                          {s.sessionTypeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.durationMin} min</td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink">{s.amountFormatted}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        {cancellable && (
                          <CancelSessionButton sessionId={s.id} subject={s.subject} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
