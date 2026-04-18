import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import { SessionCalendar } from '@/components/student/session-calendar'
import Link from 'next/link'
import { BookOpen, UserCircle, MessageCircle } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const session   = await auth()
  const userId    = session!.user.id
  const name      = session!.user.name ?? ''
  const firstName = name.split(' ')[0] ?? 'Student'

  const sessions = await container().listStudentSessions.execute(userId)

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">
          {greeting()}, {firstName}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString('en-ZA', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Book next session */}
        <Link
          href="/book"
          className="flex items-center gap-4 bg-gold hover:bg-gold-dark text-white rounded-xl p-5 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Book Next Session</p>
            <p className="text-xs text-white/75 mt-0.5">Once-off, group, or monthly</p>
          </div>
        </Link>

        {/* WhatsApp PS */}
        <a
          href={SOCIAL_LINKS.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl p-5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Message PS on WhatsApp</p>
            <p className="text-xs text-white/75 mt-0.5">+27 83 381 9069</p>
          </div>
        </a>

        {/* Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-4 bg-navy hover:bg-navy-dark text-white rounded-xl p-5 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <UserCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">My Profile</p>
            <p className="text-xs text-white/75 mt-0.5">Info, policies & settings</p>
          </div>
        </Link>
      </div>

      {/* Sessions calendar */}
      <SessionCalendar sessions={sessions} />
    </div>
  )
}
