import type { IBookingRepo } from '@/domain/ports/booking-repo'
import type { StudentDto } from '../dto/booking-dto'
import { toStudentDto } from '../dto/mappers'

export class ListStudents {
  constructor(private readonly bookings: IBookingRepo) {}

  async execute(): Promise<StudentDto[]> {
    const [students, counts] = await Promise.all([
      this.bookings.findAllStudents(),
      this.bookings.findSessionCounts(),
    ])
    return students.map(s => ({
      ...toStudentDto(s),
      totalSessions: counts[s.id] ?? 0,
    }))
  }
}
