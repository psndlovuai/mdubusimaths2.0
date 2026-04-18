import { getMyProfile } from '@/app/actions/profile'
import { profileCompleteness } from '@/lib/profile-utils'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/student/profile-form'
import { DeleteAccountButton } from '@/components/student/delete-account-button'
import { CheckCircle2, AlertCircle, FileText, ShieldCheck, RefreshCw, ExternalLink, Info } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Profile' }

// ── Profile completeness bar ──────────────────────────────────────────────────
function CompletenessBar({ pct }: { pct: number }) {
  const complete = pct === 100
  return (
    <div className={`rounded-xl p-5 ${complete ? 'bg-green/10 border border-green/20' : 'bg-gold/10 border border-gold/20'}`}>
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
          Fill in your contact details, school, and subjects to complete your profile.
        </p>
      )}
    </div>
  )
}

// ── Policy documents ──────────────────────────────────────────────────────────
const DOCUMENTS = [
  {
    icon:     FileText,
    title:    'Refund Policy',
    subtitle: 'Cancellations & refunds',
    href:     '/policies/refund',
  },
  {
    icon:     ShieldCheck,
    title:    'Privacy Policy',
    subtitle: 'How we use your data',
    href:     '/policies/privacy',
  },
  {
    icon:     RefreshCw,
    title:    'Terms of Service',
    subtitle: 'Rules & conditions',
    href:     '/policies/terms',
  },
  {
    icon:     Info,
    title:    'About Mdubusi Mathematics',
    subtitle: 'Our tutoring approach',
    href:     '/',
  },
]

function DocumentsSection() {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
      <h2 className="font-semibold text-ink mb-1">Documents & Policies</h2>
      <p className="text-xs text-muted-foreground mb-5">Important information about your account and sessions.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DOCUMENTS.map(({ icon: Icon, title, subtitle, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 border border-border rounded-xl p-4 hover:bg-cream hover:border-navy/30 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0 group-hover:bg-navy/15 transition-colors">
              <Icon className="w-4 h-4 text-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink">{title}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── Danger zone ───────────────────────────────────────────────────────────────
function DangerZone({ email }: { email: string }) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 border border-red-100">
      <h2 className="font-semibold text-red-700 mb-1">Danger Zone</h2>
      <p className="text-xs text-muted-foreground mb-5">
        Irreversible actions. Please read carefully before proceeding.
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-100 rounded-xl bg-red-50/50">
        <div>
          <p className="text-sm font-medium text-ink">Delete my account</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Permanently removes your account, profile, and all session history. This cannot be undone.
          </p>
        </div>
        <DeleteAccountButton email={email} />
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProfilePage() {
  const [authSession, profile] = await Promise.all([auth(), getMyProfile()])
  if (!profile || !authSession?.user) redirect('/login')

  const pct = profileCompleteness(profile)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your details, review policies, and control your account.
        </p>
      </div>

      <CompletenessBar pct={pct} />

      {/* Profile form */}
      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
        <h2 className="font-semibold text-ink mb-5">Personal & Academic Details</h2>
        <ProfileForm defaultValues={profile} />
      </div>

      {/* Documents & policies */}
      <DocumentsSection />

      {/* Danger zone */}
      <DangerZone email={profile.email} />
    </div>
  )
}
