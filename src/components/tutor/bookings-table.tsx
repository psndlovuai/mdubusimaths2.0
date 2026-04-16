'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, X, Search, Check, Ban } from 'lucide-react'
import { cancelBooking, markSessionComplete } from '@/app/actions/booking'
import type { BookingDto } from '@/application/dto/booking-dto'
import { cn } from '@/lib/utils'

interface BookingsTableProps {
  bookings: BookingDto[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
  })
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  confirmed: { label: 'Confirmed',  className: 'bg-green/10 text-green border-green/20' },
  pending:   { label: 'Pending',    className: 'bg-gold/10 text-gold-dark border-gold/20' },
  cancelled: { label: 'Cancelled',  className: 'bg-muted/30 text-muted-foreground border-border' },
  completed: { label: 'Completed',  className: 'bg-navy/10 text-navy border-navy/20' },
}
const DEFAULT_STATUS = STATUS_STYLES['confirmed']!

// ── Confirm dialog ─────────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  title:       string
  description: string
  confirmLabel: string
  confirmClass: string
  onConfirm:   () => void
  onClose:     () => void
  pending:     boolean
  error:       string | null
}

function ConfirmDialog({ title, description, confirmLabel, confirmClass, onConfirm, onClose, pending, error }: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 id="confirm-dialog-title" className="font-semibold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-ink p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        {error && <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={pending}
            className="flex-1 border border-border rounded-full py-2.5 text-sm font-medium text-ink hover:bg-cream transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className={cn('flex-1 text-white rounded-full py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60', confirmClass)}
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Action cell ────────────────────────────────────────────────────────────────
function ActionCell({ booking }: { booking: BookingDto }) {
  const router = useRouter()
  const [dialog,  setDialog]  = useState<'cancel' | 'complete' | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [pending, start]      = useTransition()

  const now      = new Date()
  const isFuture = new Date(booking.startTime) > now
  const isPast   = !isFuture

  const canComplete = booking.status === 'confirmed' && isPast
  const canCancel   = booking.status === 'confirmed' && isFuture

  if (!canComplete && !canCancel) return null

  function doComplete() {
    setError(null)
    start(async () => {
      const r = await markSessionComplete(booking.id)
      if (r.error) { setError(r.error); return }
      setDialog(null)
      router.refresh()
    })
  }

  function doCancel() {
    setError(null)
    start(async () => {
      const r = await cancelBooking(booking.id)
      if (r.error) { setError(r.error); return }
      setDialog(null)
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {canComplete && (
          <button
            onClick={() => setDialog('complete')}
            className="inline-flex items-center gap-1 text-xs font-medium text-green hover:text-green border border-green/30 hover:bg-green/10 px-2 py-1.5 rounded-lg transition-colors min-h-[32px]"
          >
            <Check className="w-3 h-3" />
            Complete
          </button>
        )}
        {canCancel && (
          <button
            onClick={() => setDialog('cancel')}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors min-h-[32px]"
          >
            <Ban className="w-3 h-3" />
            Cancel
          </button>
        )}
      </div>

      {dialog === 'complete' && (
        <ConfirmDialog
          title="Mark as complete?"
          description={`Mark ${booking.studentName ?? 'this student'}'s session (${booking.subject}) as completed?`}
          confirmLabel="Mark Complete"
          confirmClass="bg-green hover:bg-green/90"
          onConfirm={doComplete}
          onClose={() => { setDialog(null); setError(null) }}
          pending={pending}
          error={error}
        />
      )}

      {dialog === 'cancel' && (
        <ConfirmDialog
          title="Cancel booking?"
          description={`Cancel ${booking.studentName ?? 'this student'}'s ${booking.subject} session? This cannot be undone.`}
          confirmLabel="Yes, cancel"
          confirmClass="bg-red-600 hover:bg-red-700"
          onConfirm={doCancel}
          onClose={() => { setDialog(null); setError(null) }}
          pending={pending}
          error={error}
        />
      )}
    </>
  )
}

// ── Main table component ───────────────────────────────────────────────────────
const STATUSES = ['All', 'confirmed', 'cancelled', 'completed'] as const
const TYPES    = ['All', 'once_off', 'monthly', 'group']        as const

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatus]   = useState<string>('All')
  const [typeFilter,   setType]     = useState<string>('All')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return bookings.filter(b => {
      if (q && !(b.studentName ?? '').toLowerCase().includes(q)) return false
      if (statusFilter !== 'All' && b.status !== statusFilter)    return false
      if (typeFilter   !== 'All' && b.sessionType !== typeFilter)  return false
      return true
    })
  }, [bookings, search, statusFilter, typeFilter])

  const TYPE_LABELS: Record<string, string> = {
    once_off: 'Once-off',
    monthly:  'Monthly',
    group:    'Group',
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white rounded-xl shadow-card p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name…"
            className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            aria-label="Search bookings"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
          className="border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
          aria-label="Filter by status"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s === 'All' ? 'All statuses' : STATUS_STYLES[s]?.label ?? s}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={e => setType(e.target.value)}
          className="border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
          aria-label="Filter by session type"
        >
          {TYPES.map(t => (
            <option key={t} value={t}>{t === 'All' ? 'All types' : TYPE_LABELS[t] ?? t}</option>
          ))}
        </select>

        <p className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {bookings.length}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">No bookings match the current filters</p>
        ) : (
          <table className="w-full text-sm min-w-[800px]">
            <caption className="sr-only">All bookings</caption>
            <thead className="border-b border-border bg-cream">
              <tr>
                {['Student', 'Subject / Topic', 'Scheduled', 'Type', 'Duration', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(b => {
                const statusStyle = STATUS_STYLES[b.status] ?? DEFAULT_STATUS
                return (
                  <tr key={b.id} className="hover:bg-cream/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                      {b.studentName ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{b.subject}</p>
                      {b.topic && <p className="text-xs text-muted-foreground">{b.topic}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(b.startTime)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {b.sessionTypeLabel}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.durationMin} min</td>
                    <td className="px-4 py-3 text-ink whitespace-nowrap">{b.amountFormatted}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border', statusStyle.className)}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ActionCell booking={b} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
