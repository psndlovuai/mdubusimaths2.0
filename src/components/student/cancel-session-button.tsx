'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cancelBooking } from '@/app/actions/booking'
import { Loader2, X } from 'lucide-react'

interface CancelSessionButtonProps {
  sessionId: string
  subject:   string
}

export function CancelSessionButton({ sessionId, subject }: CancelSessionButtonProps) {
  const router = useRouter()
  const [open,   setOpen]   = useState(false)
  const [error,  setError]  = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleCancel() {
    setError(null)
    startTransition(async () => {
      const result = await cancelBooking(sessionId)
      if (result.error) {
        setError(result.error)
        return
      }
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors px-2 py-1 rounded hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 min-h-[36px]"
      >
        Cancel
      </button>

      {/* Dialog backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 id="cancel-dialog-title" className="font-semibold text-ink">
                Cancel session?
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-ink p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              Are you sure you want to cancel your <strong className="text-ink">{subject}</strong> session?
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Cancellations within 12 hours of the session are not permitted.
            </p>

            {error && (
              <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={pending}
                className="flex-1 border border-border rounded-full py-2.5 text-sm font-medium text-ink hover:bg-cream transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Keep session
              </button>
              <button
                onClick={handleCancel}
                disabled={pending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full py-2.5 text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                {pending && <Loader2 className="w-4 h-4 animate-spin" />}
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
