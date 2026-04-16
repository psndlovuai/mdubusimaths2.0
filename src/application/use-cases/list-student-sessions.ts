import type { IBookingRepo } from '@/domain/ports/booking-repo'
import type { BookingDto } from '../dto/booking-dto'
import { toBookingDto } from '../dto/mappers'

export class ListStudentSessions {
  constructor(private readonly bookings: IBookingRepo) {}

  async execute(studentId: string): Promise<BookingDto[]> {
    const sessions = await this.bookings.findHistoryByStudent(studentId)
    // Newest first
    return sessions.map(toBookingDto).sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
  }
}
