'use server'

import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import { prisma } from '@/infrastructure/prisma/client'

export interface UpdateProfileInput {
  firstName?:     string
  lastName?:      string
  academicLevel?: string | null
  school?:        string | null
  subjects?:      string | null
  phone?:         string | null
  whatsapp?:      string | null
  bio?:           string | null
  marketingOptin?: boolean
}

export async function updateProfile(data: UpdateProfileInput): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Unauthorised' }

  const c = container()

  await c.updateProfile.execute({
    userId: session.user.id,
    data,
  })

  return {}
}

export interface MyProfileData {
  firstName:     string
  lastName:      string
  email:         string
  academicLevel: string | null
  school:        string | null
  subjects:      string | null
  phone:         string | null
  whatsapp:      string | null
  bio:           string | null
  marketingOptin: boolean
}

export async function getMyProfile(): Promise<MyProfileData | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: {
      firstName:     true,
      lastName:      true,
      email:         true,
      academicLevel: true,
      school:        true,
      subjects:      true,
      phone:         true,
      whatsapp:      true,
      bio:           true,
      marketingOptin: true,
    },
  })
  return user ?? null
}

/** Returns 0-100 indicating how complete the student's profile is */
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
