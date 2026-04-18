import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import { SessionCalendar } from '@/components/student/session-calendar'
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
    <div className="space-y-6">
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

      {/* Sessions calendar */}
      <SessionCalendar sessions={sessions} />
    </div>
  )
}
