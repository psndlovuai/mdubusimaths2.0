'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  currentUrl: string | null
  initials:   string
}

export function AvatarUpload({ currentUrl, initials }: Props) {
  const [url,     setUrl]     = useState(currentUrl)
  const [pending, startTransition] = useTransition()
  const inputRef  = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    startTransition(async () => {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/avatar', { method: 'POST', body: form })
      const data = await res.json() as { url?: string; error?: string }

      if (!res.ok || data.error) {
        toast.error(data.error ?? 'Upload failed')
        return
      }
      setUrl(data.url!)
      toast.success('Profile photo updated')
    })

    // Reset so re-selecting the same file triggers onChange again
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-5">
      {/* Avatar circle */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-navy flex items-center justify-center ring-4 ring-white shadow-md">
          {url ? (
            <Image src={url} alt="Profile photo" fill className="object-cover" sizes="80px" />
          ) : (
            <span className="text-2xl font-bold text-white select-none">{initials}</span>
          )}
        </div>

        {/* Camera button overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold hover:bg-gold-dark text-white flex items-center justify-center shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
          aria-label="Upload profile photo"
        >
          {pending
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Camera className="w-3.5 h-3.5" />
          }
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFile}
        />
      </div>

      {/* Label */}
      <div>
        <p className="text-sm font-medium text-ink">Profile photo</p>
        <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or WebP — max 2 MB</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="mt-1.5 text-xs text-navy hover:underline disabled:opacity-60"
        >
          {pending ? 'Uploading…' : url ? 'Change photo' : 'Upload photo'}
        </button>
      </div>
    </div>
  )
}
