import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { StudentSidebar } from '@/components/student/student-sidebar'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'STUDENT') redirect('/login')

  const firstName = session.user.name?.split(' ')[0] ?? 'Student'

  return (
    <div className="min-h-screen bg-cream">
      <StudentSidebar firstName={firstName} />

      {/* Offset for desktop sidebar */}
      <div className="lg:pl-60">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
