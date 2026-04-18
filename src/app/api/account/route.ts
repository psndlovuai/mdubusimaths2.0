import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/infrastructure/prisma/client'

export const runtime = 'nodejs'

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const userId = session.user.id

  try {
    // Cascade: accounts, sessions, auth_sessions are all onDelete: Cascade
    // so deleting the user row removes everything
    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[delete-account]', err)
    return NextResponse.json(
      { error: 'Could not delete account. Please try again.' },
      { status: 500 },
    )
  }
}
