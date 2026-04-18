'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/infrastructure/prisma/client'

export const registerSchema = z.object({
  firstName:     z.string().min(1, 'First name is required'),
  lastName:      z.string().min(1, 'Last name is required'),
  email:         z.string().email('Enter a valid email address'),
  password:      z.string().min(8, 'Password must be at least 8 characters'),
  academicLevel: z.string().min(1, 'Please select an academic level'),
})

export type RegisterInput = z.infer<typeof registerSchema>

export interface RegisterResult {
  error?: string
}

export async function registerStudent(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? 'Invalid input' }
  }

  const { firstName, lastName, email, password, academicLevel } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: 'An account with this email already exists' }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashed,
      academicLevel,
      role: 'STUDENT',
    },
  })

  // User created — client will call signIn() from next-auth/react
  return {}
}
