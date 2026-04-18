'use client'

import { useState, useTransition } from 'react'
import { signOut } from 'next-auth/react'
import { Loader2, Trash2, X } from 'lucide-react'

export function DeleteAccountButton({ email }: { email: string }) {
  const [open,    setOpen]    = useState(false)
  const [confirm, setConfirm] = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/account', { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? 'Could not delete account. Please try again.')
        return
      }
      await signOut({ callbackUrl: '/' })
    })
  }

  const confirmed = confirm.trim().toLowerCase() === email.trim().toLowerCase()

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setConfirm(''); setError(null) }}
        className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 min-h-[44px]"
      >
        <Trash2 className="w-4 h-4" />
        Delete my account
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 id="delete-dialog-title" className="font-semibold text-ink text-lg">
                  Delete your account?
                </h2>
                <p className="text-sm text-muted-foreground mt-1">This action is permanent and cannot be undone.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-ink p-1 rounded"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 text-sm text-red-700 space-y-1">
              <p className="font-semibold">This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-0.5 text-red-600">
                <li>Your account and login access</li>
                <li>All your session history</li>
                <li>All your profile information</li>
              </ul>
              <p className="mt-2 text-red-700">Active bookings will not be automatically cancelled — please cancel them first or contact PS on WhatsApp.</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-ink mb-1.5">
                Type your email to confirm:
                <span className="ml-1 font-normal text-muted-foreground">{email}</span>
              </label>
              <input
                type="email"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder={email}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[44px]"
                autoComplete="off"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="flex-1 border border-border rounded-full py-3 text-sm font-medium text-ink hover:bg-cream transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!confirmed || pending}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-full py-3 text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2"
              >
                {pending
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting…</>
                  : <><Trash2 className="w-4 h-4" />Delete account</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
