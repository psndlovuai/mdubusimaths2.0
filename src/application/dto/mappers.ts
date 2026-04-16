import type { Session } from '@/domain/entities/session'
import type { Student } from '@/domain/entities/student'
import type { BookingDto, StudentDto } from './booking-dto'

export function toBookingDto(session: Session): BookingDto {
  return {
    id:               session.id,
    studentId:        session.studentId,
    subject:          session.subject,
    topic:            session.topic,
    sessionType:      session.type.value,
    sessionTypeLabel: session.type.label,
    startTime:        session.slot.start.toISOString(),
    durationMin:      session.slot.durationMinutes,
    amountCents:      session.price.cents,
    amountFormatted:  session.price.format(),
    status:           session.status,
    calBookingUid:    session.calBookingUid,
    createdAt:        session.createdAt.toISOString(),
  }
}

export function toStudentDto(student: Student): StudentDto {
  return {
    id:            student.id,
    email:         student.email,
    firstName:     student.firstName,
    lastName:      student.lastName,
    fullName:      student.fullName,
    academicLevel: student.academicLevel,
    phone:         student.phone,
    // totalSessions and lastSessionDate populated by callers that have session data
  }
}
