import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/infrastructure/prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from '@/lib/auth.config'

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),

  providers: [
    // ── Google Sign In ─────────────────────────────────────────────────────
    Google({
      clientId:     process.env.AUTH_GOOGLE_ID     ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),

    // ── Email magic link via Resend ───────────────────────────────────────
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from:   process.env.RESEND_FROM_EMAIL ?? 'hello@mdubusimaths.com',
    }),

    // ── Email + password ──────────────────────────────────────────────────
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user?.password) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return {
          id:    user.id,
          email: user.email,
          name:  `${user.firstName} ${user.lastName}`.trim(),
          role:  user.role,
        }
      },
    }),
  ],

  events: {
    // Assign STUDENT role + parse name when a new OAuth/email user is created
    async createUser({ user }) {
      if (!user.id) return
      const nameParts  = (user.name ?? '').split(' ')
      const firstName  = nameParts[0]  ?? ''
      const lastName   = nameParts.slice(1).join(' ')
      await prisma.user.update({
        where: { id: user.id },
        data:  { role: 'STUDENT', firstName, lastName },
      })
    },
  },
})
