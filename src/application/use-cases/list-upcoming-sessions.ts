import type { IBookingRepo } from '@/domain/ports/booking-repo'
import type { BookingDto } from '../dto/booking-dto'
import { toBookingDto } from '../dto/mappers'

export class ListUpcomingSessions {
  constructor(private readonly bookings: IBookingRepo) {}

  async execute(studentId: string): Promise<BookingDto[]> {
    const sessions = await this.bookings.findUpcomingByStudent(studentId)
    return sessions.map(toBookingDto)
  }
}
