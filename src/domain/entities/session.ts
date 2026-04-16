import type { Money } from '../value-objects/money'
import type { SessionType } from '../value-objects/session-type'
import type { TimeSlot } from '../value-objects/time-slot'

export type SessionStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export class Session {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly type: SessionType,
    public readonly subject: string,
    public readonly topic: string | null,
    public readonly slot: TimeSlot,
    public readonly price: Money,
    public status: SessionStatus,
    public readonly calBookingUid: string | null,  // Cal.com booking UID
    public readonly createdAt: Date,
  ) {}

  canBeCancelledBy(userId: string, role: 'student' | 'tutor', now: Date): boolean {
    if (role === 'tutor') return this.status !== 'completed'
    if (this.studentId !== userId) return false
    if (this.status !== 'confirmed') return false
    const hoursUntilStart = (this.slot.start.getTime() - now.getTime()) / 36e5
    return hoursUntilStart >= 12  // 12-hour cancellation window for students
  }

  markConfirmed(): void {
    if (this.status !== 'pending') throw new Error(`Cannot confirm session in status ${this.status}`)
    this.status = 'confirmed'
  }

  markCancelled(): void {
    if (this.status === 'completed') throw new Error('Cannot cancel a completed session')
    this.status = 'cancelled'
  }

  markCompleted(): void {
    if (this.status !== 'confirmed') throw new Error(`Cannot complete session in status ${this.status}`)
    this.status = 'completed'
  }
}
