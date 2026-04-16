import { cache } from 'react'
import { PrismaBookingRepo } from './prisma/booking-repo'
import { PrismaProfileRepo } from './prisma/profile-repo'
import { ResendMailer } from './resend/mailer'
import { SyncCalBooking } from '@/application/use-cases/sync-cal-booking'
import { CancelBooking } from '@/application/use-cases/cancel-booking'
import { ListUpcomingSessions } from '@/application/use-cases/list-upcoming-sessions'
import { ListAllBookings } from '@/application/use-cases/list-all-bookings'
import { ListStudents } from '@/application/use-cases/list-students'
import { GetDashboardStats } from '@/application/use-cases/get-dashboard-stats'
import { UpdateProfile } from '@/application/use-cases/update-profile'
import { ListStudentSessions } from '@/application/use-cases/list-student-sessions'

// cache() ensures one container instance per request (React Server Components)
export const container = cache(() => {
  const bookings    = new PrismaBookingRepo()
  const profileRepo = new PrismaProfileRepo()
  const mailer      = new ResendMailer()

  return {
    bookings,
    profileRepo,
    mailer,
    syncCalBooking:       new SyncCalBooking(bookings, mailer),
    cancelBooking:        new CancelBooking(bookings),
    listUpcomingSessions: new ListUpcomingSessions(bookings),
    listAllBookings:      new ListAllBookings(bookings),
    listStudents:         new ListStudents(bookings),
    getDashboardStats:    new GetDashboardStats(bookings),
    updateProfile:        new UpdateProfile(profileRepo),
    listStudentSessions:  new ListStudentSessions(bookings),
  }
})
