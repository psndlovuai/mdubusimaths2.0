import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TutorNav } from '@/components/tutor/tutor-nav'

export default async function TutorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'TUTOR') redirect('/tutor/login')

  return (
    <div className="min-h-screen bg-cream">
      <TutorNav />
      <div className="md:pl-60 pb-20 md:pb-0">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
