import { getMyProfile, profileCompleteness } from '@/app/actions/profile'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/student/profile-form'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Profile' }

function CompletenessBar({ pct }: { pct: number }) {
  const complete = pct === 100
  return (
    <div className={`rounded-xl p-5 mb-6 ${complete ? 'bg-green/10 border border-green/20' : 'bg-gold/10 border border-gold/20'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {complete
            ? <CheckCircle2 className="w-4 h-4 text-green-600" />
            : <AlertCircle   className="w-4 h-4 text-gold-dark" />
          }
          <span className="text-sm font-medium text-ink">
            {complete ? 'Profile complete!' : 'Complete your profile'}
          </span>
        </div>
        <span className="text-sm font-bold text-ink">{pct}%</span>
      </div>
      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${complete ? 'bg-green-500' : 'bg-gold'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {!complete && (
        <p className="text-xs text-muted-foreground mt-2">
          A complete profile helps us match you with the right sessions and send relevant resources.
        </p>
      )}
    </div>
  )
}

export default async function ProfilePage() {
  const profile = await getMyProfile()
  if (!profile) redirect('/login')

  const pct = profileCompleteness(profile)

  return (
    <div className="max-w-2xl space-y-2">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium text-navy">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Keep your details up to date so we can serve you better
        </p>
      </div>

      <CompletenessBar pct={pct} />

      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
        <ProfileForm defaultValues={profile} />
      </div>
    </div>
  )
}
