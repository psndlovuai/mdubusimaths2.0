import { createHmac, timingSafeEqual } from 'crypto'
import { container } from '@/infrastructure/container'
import { prisma } from '@/infrastructure/prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function verifySignature(rawBody: Buffer, sigHeader: string, secret: string): boolean {
  const sig = sigHeader.startsWith('sha256=') ? sigHeader.slice(7) : sigHeader
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const rawBody = Buffer.from(await req.arrayBuffer())

  const sigHeader = req.headers.get('X-Cal-Signature-256') ?? ''
  const secret    = process.env.CAL_WEBHOOK_SECRET ?? ''

  if (!verifySignature(rawBody, sigHeader, secret)) {
    return Response.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody.toString('utf-8')) as Record<string, unknown>
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const triggerEvent    = payload['triggerEvent'] as string
  const bookingPayload  = (payload['payload'] ?? {}) as Record<string, unknown>
  const calUid          = bookingPayload['uid'] as string

  if (!calUid) {
    return Response.json({ ok: false, error: 'Missing uid' }, { status: 400 })
  }

  const c = container()

  // ── BOOKING_CREATED ───────────────────────────────────────────────────────
  if (triggerEvent === 'BOOKING_CREATED') {
    // Idempotency: already processed this uid
    const existing = await c.bookings.findByCalUid(calUid)
    if (existing) return Response.json({ ok: true, skipped: true })

    const attendees      = (bookingPayload['attendees'] ?? []) as Array<{ email: string; name: string }>
    const attendee       = attendees[0]
    if (!attendee) return Response.json({ ok: false, error: 'No attendee' }, { status: 400 })

    const responses      = (bookingPayload['responses'] ?? {}) as Record<string, { value: string }>
    const eventTypeSlug  = bookingPayload['eventTypeSlug'] as string
    const startTime      = bookingPayload['startTime']     as string
    const endTime        = bookingPayload['endTime']       as string

    // Find or create student account
    let student = await prisma.user.findUnique({ where: { email: attendee.email } })
    if (!student) {
      const nameParts = attendee.name.trim().split(/\s+/)
      student = await prisma.user.create({
        data: {
          email:     attendee.email,
          firstName: nameParts[0] ?? attendee.name,
          lastName:  nameParts.slice(1).join(' ') || '—',
          role:      'STUDENT',
        },
      })

      // Fire-and-forget welcome email (failure must not crash booking)
      c.mailer.send({
        to:         attendee.email,
        templateId: 'welcome',
        props: {
          studentName: attendee.name,
          bookUrl:     `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/book`,
        },
      }).catch(() => {})
    }

    await c.syncCalBooking.execute({
      calUid,
      start:          new Date(startTime),
      end:            new Date(endTime),
      attendeeEmail:  attendee.email,
      attendeeName:   attendee.name,
      eventTypeSlug,
      studentId:      student.id,
      subject:        responses['subject']?.value  ?? 'Mathematics',
      topic:          responses['topic']?.value    ?? null,
    })

    return Response.json({ ok: true })
  }

  // ── BOOKING_CANCELLED ─────────────────────────────────────────────────────
  if (triggerEvent === 'BOOKING_CANCELLED') {
    const existing = await c.bookings.findByCalUid(calUid)
    if (!existing) return Response.json({ ok: true, skipped: true })

    await c.bookings.updateStatus(existing.id, 'cancelled')
    return Response.json({ ok: true })
  }

  // Any other trigger — acknowledge silently
  return Response.json({ ok: true, skipped: true })
}
