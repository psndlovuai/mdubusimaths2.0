import type { IBookingRepo } from '@/domain/ports/booking-repo'
import { Session } from '@/domain/entities/session'
import { Student } from '@/domain/entities/student'
import { Money } from '@/domain/value-objects/money'
import { SessionType } from '@/domain/value-objects/session-type'
import { TimeSlot } from '@/domain/value-objects/time-slot'
import { prisma } from './client'
import type { Session as PrismaSession, User as PrismaUser } from '@prisma/client'

export class PrismaBookingRepo implements IBookingRepo {
  async save(session: Session): Promise<void> {
    await prisma.session.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        studentId: session.studentId,
        sessionType: session.type.value.toUpperCase() as 'MEET_GREET' | 'ONCE_OFF' | 'MONTHLY' | 'GROUP',
        subject: session.subject,
        topic: session.topic,
        scheduledAt: session.slot.start,
        durationMin: session.slot.durationMinutes,
        amountCents: session.price.cents,
        status: session.status.toUpperCase() as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
        calBookingUid: session.calBookingUid,
      },
      update: {
        status: session.status.toUpperCase() as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
      },
    })
  }

  async findById(id: string): Promise<Session | null> {
    const row = await prisma.session.findUnique({ where: { id } })
    return row ? mapRow(row) : null
  }

  async findUpcomingByStudent(studentId: string): Promise<Session[]> {
    const rows = await prisma.session.findMany({
      where: { studentId, scheduledAt: { gte: new Date() }, status: 'CONFIRMED' },
      orderBy: { scheduledAt: 'asc' },
      take: 10,
    })
    return rows.map(mapRow)
  }

  async findHistoryByStudent(studentId: string): Promise<Session[]> {
    const rows = await prisma.session.findMany({
      where: { studentId },
      orderBy: { scheduledAt: 'desc' },
    })
    return rows.map(mapRow)
  }

  async findAllUpcoming(): Promise<Session[]> {
    const rows = await prisma.session.findMany({
      where: { scheduledAt: { gte: new Date() }, status: 'CONFIRMED' },
      orderBy: { scheduledAt: 'asc' },
    })
    return rows.map(mapRow)
  }

  async findAllStudents(): Promise<Student[]> {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
    })
    return users.map(mapUser)
  }

  async findSessionsByStudent(studentId: string): Promise<Session[]> {
    return this.findHistoryByStudent(studentId)
  }

  async findTodaysSessions(): Promise<Session[]> {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const rows = await prisma.session.findMany({
      where: { scheduledAt: { gte: start, lte: end }, status: 'CONFIRMED' },
      orderBy: { scheduledAt: 'asc' },
    })
    return rows.map(mapRow)
  }

  async findAll(): Promise<Session[]> {
    const rows = await prisma.session.findMany({ orderBy: { scheduledAt: 'desc' } })
    return rows.map(mapRow)
  }

  async findSessionCounts(): Promise<Record<string, number>> {
    const groups = await prisma.session.groupBy({
      by: ['studentId'],
      _count: { id: true },
    })
    return Object.fromEntries(groups.map(g => [g.studentId, g._count.id]))
  }

  async findByCalUid(calUid: string): Promise<Session | null> {
    const row = await prisma.session.findUnique({ where: { calBookingUid: calUid } })
    return row ? mapRow(row) : null
  }

  async updateStatus(id: string, status: Session['status']): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: { status: status.toUpperCase() as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' },
    })
  }
}

function mapRow(row: PrismaSession): Session {
  return new Session(
    row.id,
    row.studentId,
    new SessionType(row.sessionType.toLowerCase() as 'meet_greet' | 'once_off' | 'monthly' | 'group'),
    row.subject,
    row.topic,
    new TimeSlot(
      row.scheduledAt,
      new Date(row.scheduledAt.getTime() + row.durationMin * 60000),
    ),
    Money.fromCents(row.amountCents),
    row.status.toLowerCase() as 'confirmed' | 'cancelled' | 'completed',
    row.calBookingUid,
    row.createdAt,
  )
}

function mapUser(user: PrismaUser): Student {
  return new Student(
    user.id,
    user.email,
    user.firstName,
    user.lastName,
    user.academicLevel,
    user.phone,
    user.createdAt,
  )
}
