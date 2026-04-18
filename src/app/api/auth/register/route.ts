import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/infrastructure/prisma/client'

const schema = z.object({
  firstName:     z.string().min(1, 'First name is required'),
  lastName:      z.string().min(1, 'Last name is required'),
  email:         z.string().email('Enter a valid email address'),
  password:      z.string().min(8, 'Password must be at least 8 characters'),
  phone:         z.string().min(1, 'Phone number is required'),
  academicLevel: z.string().min(1, 'Please select an academic level'),
  school:        z.string().optional(),
  subjects:      z.string().optional(),
  preferredMode: z.enum(['online', 'in_person', 'both']).optional(),
  location:      z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    const {
      firstName, lastName, email, password,
      phone, academicLevel, school, subjects, preferredMode, location,
    } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashed,
        role: 'STUDENT',
        phone:         phone         || null,
        academicLevel: academicLevel || null,
        school:        school        || null,
        subjects:      subjects      || null,
        preferredMode: preferredMode || null,
        location:      location      || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json(
      { error: 'Could not create account. Please try again.' },
      { status: 500 },
    )
  }
}
