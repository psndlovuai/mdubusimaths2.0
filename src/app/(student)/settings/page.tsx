import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMyProfile } from '@/app/actions/profile'
import { DeleteAccountButton } from '@/components/student/delete-account-button'
import { NotificationToggle } from '@/components/student/notification-toggle'
import { Bell, Lock, Trash2, ShieldCheck, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const [authSession, profile] = await Promise.all([auth(), getMyProfile()])
  if (!profile || !authSession?.user) redirect('/login')

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your notifications, security, and account preferences.
        </p>
      </div>

      {/* ── Notifications ── */}
      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-navy" />
          <h2 className="font-semibold text-ink">Notifications</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Choose which emails and messages you would like to receive.
        </p>

        <div className="space-y-4">
          {/* Session reminders — always on */}
          <div className="flex items-center justify-between gap-4 py-3 border-b border-border/60">
            <div>
              <p className="text-sm font-medium text-ink">Session reminders</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Emails 24 hours and 1 hour before your session.
              </p>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green/10 border border-green/20 px-2.5 py-1 rounded-full">
              Always on
            </span>
          </div>

          {/* Marketing opt-in */}
          <div className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Study tips & announcements</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Occasional emails with study tips, new services, and updates.
              </p>
            </div>
            <NotificationToggle defaultChecked={profile.marketingOptin} />
          </div>
        </div>
      </div>

      {/* ── Security ── */}
      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-navy" />
          <h2 className="font-semibold text-ink">Security</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Manage your password and account security.
        </p>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-border rounded-xl">
            <div>
              <p className="text-sm font-medium text-ink">Password</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Send a password reset link to {profile.email}
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="flex items-center gap-2 text-sm font-medium text-navy hover:underline shrink-0"
            >
              Reset password
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-cream/50">
            <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your password is securely hashed. We never store it in plain text.
            </p>
          </div>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 border border-red-100">
        <div className="flex items-center gap-2 mb-1">
          <Trash2 className="w-4 h-4 text-red-600" />
          <h2 className="font-semibold text-red-700">Danger Zone</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Irreversible actions — please read carefully before proceeding.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-100 rounded-xl bg-red-50/50">
          <div>
            <p className="text-sm font-medium text-ink">Delete my account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently removes your account, profile, and all session history.
            </p>
          </div>
          <DeleteAccountButton email={profile.email} />
        </div>
      </div>
    </div>
  )
}
