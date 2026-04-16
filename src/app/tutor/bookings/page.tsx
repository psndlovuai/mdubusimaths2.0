import { container } from '@/infrastructure/container'
import { BookingsTable } from '@/components/tutor/bookings-table'
import type { Metadata } from 'next'
import type { BookingDto } from '@/application/dto/booking-dto'

export const metadata: Metadata = { title: 'All Bookings' }

export default async function TutorBookingsPage() {
  const c = container()

  const [bookings, students] = await Promise.all([
    c.listAllBookings.execute(),
    c.listStudents.execute(),
  ])

  // Enrich bookings with student names
  const studentMap = new Map(students.map(s => [s.id, { name: s.fullName, email: s.email }]))

  const enriched: BookingDto[] = bookings.map(b => ({
    ...b,
    studentName:  studentMap.get(b.studentId)?.name  ?? 'Unknown Student',
    studentEmail: studentMap.get(b.studentId)?.email ?? '',
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-navy">All Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {bookings.length} total session{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      <BookingsTable bookings={enriched} />
    </div>
  )
}
