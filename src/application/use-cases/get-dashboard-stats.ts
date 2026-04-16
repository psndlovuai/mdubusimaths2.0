import type { IBookingRepo } from '@/domain/ports/booking-repo'
import type { DashboardStatsDto } from '../dto/booking-dto'

export class GetDashboardStats {
  constructor(private readonly bookings: IBookingRepo) {}

  async execute(): Promise<DashboardStatsDto> {
    const [todaysSessions, allUpcoming, allStudents] = await Promise.all([
      this.bookings.findTodaysSessions(),
      this.bookings.findAllUpcoming(),
      this.bookings.findAllStudents(),
    ])

    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const weekSessions = allUpcoming.filter(s => s.slot.start <= weekFromNow)

    const totalRevenueCents = allUpcoming.reduce((sum, s) => sum + s.price.cents, 0)

    return {
      todayCount:        todaysSessions.length,
      weekCount:         weekSessions.length,
      totalRevenueCents,
      studentCount:      allStudents.length,
    }
  }
}
