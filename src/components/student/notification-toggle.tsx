'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NotificationToggle({ defaultChecked }: { defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = !checked
    setChecked(next)
    startTransition(async () => {
      await updateProfile({ marketingOptin: next })
    })
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {pending && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={toggle}
        disabled={pending}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60',
          checked ? 'bg-navy' : 'bg-border',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  )
}
