import type { NextAuthConfig } from 'next-auth'

// Edge-compatible auth config — no Prisma, no bcrypt.
// Used by middleware.ts which runs on the Vercel Edge Runtime.
// The full config (with adapter + providers) lives in auth.ts.
export const authConfig = {
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error:  '/auth/error',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string
        session.user.role = token.role as 'STUDENT' | 'TUTOR'
      }
      return session
    },
  },

  providers: [], // filled in by auth.ts
} satisfies NextAuthConfig
