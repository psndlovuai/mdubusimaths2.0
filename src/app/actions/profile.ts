'use server'

import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import { prisma } from '@/infrastructure/prisma/client'

export interface UpdateProfileInput {
  firstName?:     string
  lastName?:      string
  academicLevel?: string | null
  phone?:         string | null
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
  phone:         string | null
}

export async function getMyProfile(): Promise<MyProfileData | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { firstName: true, lastName: true, email: true, academicLevel: true, phone: true },
  })
  return user ?? null
}
