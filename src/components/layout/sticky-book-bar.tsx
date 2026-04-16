'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function StickyBookBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border px-4 py-3 safe-bottom shadow-lg">
      <Link
        href="/book"
        className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-dark text-white font-semibold rounded-full py-3.5 text-sm transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        <BookOpen className="w-5 h-5" />
        Book a Session
      </Link>
    </div>
  )
}
