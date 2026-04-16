import type { IBookingRepo } from '@/domain/ports/booking-repo'
import { BookingNotCancellableError, SessionNotFoundError } from '@/domain/errors/domain-error'

export interface CancelBookingInput {
  sessionId: string
  userId: string
  userRole: 'STUDENT' | 'TUTOR'
}

export class CancelBooking {
  constructor(private readonly bookings: IBookingRepo) {}

  async execute(input: CancelBookingInput): Promise<void> {
    const session = await this.bookings.findById(input.sessionId)
    if (!session) throw new SessionNotFoundError(`Session ${input.sessionId} not found`)

    // Domain method expects lowercase role
    const role = input.userRole.toLowerCase() as 'student' | 'tutor'
    if (!session.canBeCancelledBy(input.userId, role, new Date())) {
      throw new BookingNotCancellableError('This booking cannot be cancelled')
    }

    session.markCancelled()
    await this.bookings.updateStatus(session.id, 'cancelled')
  }
}
