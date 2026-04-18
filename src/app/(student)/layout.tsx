import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { StudentSidebar } from '@/components/student/student-sidebar'
import { prisma } from '@/infrastructure/prisma/client'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'STUDENT') redirect('/login')

  const firstName = session.user.name?.split(' ')[0] ?? 'Student'

  // Fetch avatar from DB (not in JWT token)
  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { avatarUrl: true, firstName: true, lastName: true, email: true },
  })
  const avatarUrl = user?.avatarUrl ?? null
  const initials  = `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase() || firstName.charAt(0).toUpperCase()
  const email     = user?.email ?? session.user.email ?? ''

  return (
    <div className="min-h-screen bg-cream">
      <StudentSidebar firstName={firstName} avatarUrl={avatarUrl} initials={initials} email={email} />

      {/* Offset for desktop sidebar */}
      <div className="lg:pl-60">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
