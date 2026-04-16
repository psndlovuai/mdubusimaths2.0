import type { Session } from '../entities/session'
import type { Student } from '../entities/student'

export interface IBookingRepo {
  // Student-scoped
  findById(id: string): Promise<Session | null>
  findUpcomingByStudent(studentId: string): Promise<Session[]>
  findHistoryByStudent(studentId: string): Promise<Session[]>

  // Tutor-scoped (all data)
  findAllUpcoming(): Promise<Session[]>
  findAllStudents(): Promise<Student[]>
  findSessionsByStudent(studentId: string): Promise<Session[]>
  findTodaysSessions(): Promise<Session[]>

  // Tutor-scoped (all data, all statuses)
  findAll(): Promise<Session[]>
  findSessionCounts(): Promise<Record<string, number>>  // studentId → count

  // Cal.com
  findByCalUid(calUid: string): Promise<Session | null>

  // Writes
  save(session: Session): Promise<void>
  updateStatus(id: string, status: Session['status']): Promise<void>
}
