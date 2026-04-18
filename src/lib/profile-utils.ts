import type { MyProfileData } from '@/app/actions/profile'

/** Returns 0–100 indicating how complete the student's profile is */
export function profileCompleteness(profile: MyProfileData): number {
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.phone || profile.whatsapp,
    profile.academicLevel,
    profile.school,
    profile.subjects,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}
