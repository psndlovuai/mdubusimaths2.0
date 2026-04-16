import type { IBookingRepo } from '@/domain/ports/booking-repo'
import type { IMailer } from '@/domain/ports/mailer'
import { Session } from '@/domain/entities/session'
import { Money } from '@/domain/value-objects/money'
import { SessionType } from '@/domain/value-objects/session-type'
import { TimeSlot } from '@/domain/value-objects/time-slot'
import { randomUUID } from 'crypto'
import { PRICES } from '@/lib/constants'

export interface SyncCalBookingInput {
  calUid: string
  start: Date
  end: Date
  attendeeEmail: string
  attendeeName: string
  eventTypeSlug: string
  studentId: string
  subject: string
  topic: string | null
}

export interface SyncCalBookingOutput {
  sessionId: string
}

export class SyncCalBooking {
  constructor(
    private readonly bookings: IBookingRepo,
    private readonly mailer: IMailer,
  ) {}

  async execute(input: SyncCalBookingInput): Promise<SyncCalBookingOutput> {
    const type = SessionType.fromSlug(input.eventTypeSlug)
    const slot = new TimeSlot(input.start, input.end)
    const priceCents = PRICES[type.value]
    if (priceCents === undefined) throw new Error(`No price for session type: ${type.value}`)
    const price = Money.fromCents(priceCents)

    const session = new Session(
      randomUUID(),
      input.studentId,
      type,
      input.subject,
      input.topic,
      slot,
      price,
      'confirmed',
      input.calUid,
      new Date(),
    )
    await this.bookings.save(session)

    await Promise.allSettled([
      this.mailer.send({
        to: input.attendeeEmail,
        templateId: 'booking-confirmation',
        props: {
          studentName: input.attendeeName,
          subject: input.subject,
          topic: input.topic,
          sessionType: type.label,
          startTime: input.start.toISOString(),
          price: price.format(),
        },
      }),
      this.mailer.send({
        to: process.env.TUTOR_EMAIL ?? '',
        templateId: 'tutor-new-booking-alert',
        props: {
          studentName: input.attendeeName,
          studentEmail: input.attendeeEmail,
          subject: input.subject,
          topic: input.topic,
          sessionType: type.label,
          startTime: input.start.toISOString(),
        },
      }),
    ])

    return { sessionId: session.id }
  }
}
