import { getMyProfile } from '@/app/actions/profile'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/student/profile-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Profile' }

export default async function ProfilePage() {
  const profile = await getMyProfile()
  if (!profile) redirect('/login')

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">Edit Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Keep your details up to date
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
        <ProfileForm defaultValues={profile} />
      </div>
    </div>
  )
}
