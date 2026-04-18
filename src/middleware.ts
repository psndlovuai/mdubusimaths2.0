import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const isLoggedIn = !!session

  // Tutor routes — skip the login page itself to avoid redirect loops
  if (nextUrl.pathname.startsWith('/tutor') && nextUrl.pathname !== '/tutor/login') {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/tutor/login', req.url))
    if (session?.user.role !== 'TUTOR') return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.next()
  }

  // Student dashboard routes
  if (
    nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname.startsWith('/sessions')  ||
    nextUrl.pathname.startsWith('/profile')   ||
    nextUrl.pathname.startsWith('/book')
  ) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', req.url))
    if (session?.user.role !== 'STUDENT') return NextResponse.redirect(new URL('/tutor/dashboard', req.url))
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sessions/:path*',
    '/profile/:path*',
    '/book/:path*',
    '/tutor/:path*',
  ],
}
