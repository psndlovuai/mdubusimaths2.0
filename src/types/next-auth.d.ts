import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'STUDENT' | 'TUTOR'
    }
  }

  interface User {
    role?: 'STUDENT' | 'TUTOR'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'STUDENT' | 'TUTOR'
  }
}
