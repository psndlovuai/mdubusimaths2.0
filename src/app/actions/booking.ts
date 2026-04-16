'use server'

import { auth } from '@/lib/auth'
import { container } from '@/infrastructure/container'
import { BookingNotCancellableError, SessionNotFoundError } from '@/domain/errors/domain-error'

export async function markSessionComplete(sessionId: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'TUTOR') return { error: 'Unauthorised' }

  const c       = container()
  const booking = await c.bookings.findById(sessionId)
  if (!booking) return { error: 'Session not found' }
  if (booking.status !== 'confirmed') return { error: 'Only confirmed sessions can be marked complete' }

  await c.bookings.updateStatus(sessionId, 'completed')
  return {}
}

export async function cancelBooking(sessionId: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Unauthorised' }

  const c = container()

  try {
    await c.cancelBooking.execute({
      sessionId,
      userId:   session.user.id,
      userRole: session.user.role as 'STUDENT' | 'TUTOR',
    })
    return {}
  } catch (err) {
    if (err instanceof SessionNotFoundError)     return { error: 'Session not found' }
    if (err instanceof BookingNotCancellableError) return { error: 'This booking cannot be cancelled' }
    throw err
  }
}
