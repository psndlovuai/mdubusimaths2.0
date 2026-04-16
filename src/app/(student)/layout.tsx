import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { StudentNav } from '@/components/student/student-nav'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'STUDENT') redirect('/login')

  const firstName = session.user.name?.split(' ')[0] ?? 'Student'

  return (
    <div className="min-h-screen bg-cream">
      <StudentNav firstName={firstName} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
