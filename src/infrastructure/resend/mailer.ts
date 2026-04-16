import { render } from '@react-email/render'
import type { IMailer } from '@/domain/ports/mailer'
import { getResendClient } from './client'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { BookingConfirmation } from '@/emails/BookingConfirmation'
import { TutorNewBookingAlert } from '@/emails/TutorNewBookingAlert'
import { prisma } from '../prisma/client'

const templates = {
  'welcome': WelcomeEmail,
  'booking-confirmation': BookingConfirmation,
  'tutor-new-booking-alert': TutorNewBookingAlert,
} as const

export class ResendMailer implements IMailer {
  async send({ to, templateId, props }: Parameters<IMailer['send']>[0]) {
    const Template = templates[templateId]
    const html = await render(Template(props as never))

    let resendId: string | undefined
    let error: string | undefined

    try {
      const res = await getResendClient().emails.send({
        from: `Mdubusi Mathematics <${process.env.RESEND_FROM_EMAIL ?? 'hello@mdubusimaths.com'}>`,
        to,
        replyTo: process.env.RESEND_REPLY_TO ?? undefined,
        subject: subjectFor(templateId, props),
        html,
      })
      resendId = res.data?.id
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : String(err)
      console.error(JSON.stringify({ level: 'error', scope: 'resend', templateId, to, error }))
      // Email failure must never crash a booking
    }

    await prisma.emailLog.create({
      data: {
        recipient: to,
        template: templateId,
        resendId,
        status: error ? 'failed' : 'sent',
        error,
      },
    })
  }
}

function subjectFor(id: string, props: Record<string, unknown>): string {
  switch (id) {
    case 'welcome':                 return 'Welcome to Mdubusi Mathematics'
    case 'booking-confirmation':    return `Booking Confirmed: ${props['subject'] ?? ''}`
    case 'tutor-new-booking-alert': return `New Booking: ${props['studentName'] ?? ''} — ${props['subject'] ?? ''}`
    default:                        return 'Mdubusi Mathematics'
  }
}
