import type { IBookingRepo } from '@/domain/ports/booking-repo'
import type { BookingDto } from '../dto/booking-dto'
import { toBookingDto } from '../dto/mappers'

export class ListAllBookings {
  constructor(private readonly bookings: IBookingRepo) {}

  async execute(): Promise<BookingDto[]> {
    const sessions = await this.bookings.findAll()
    return sessions.map(toBookingDto)
  }
}
