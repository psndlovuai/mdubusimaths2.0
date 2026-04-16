import {
  Html, Head, Body, Container, Heading, Text, Button, Hr, Section, Row, Column,
} from '@react-email/components'
import { BRAND_NAME, TUTOR_NAME, SUPPORT_EMAIL } from '@/lib/constants'

interface BookingConfirmationProps {
  studentName?: string
  subject?: string
  topic?: string | null
  sessionType?: string
  startTime?: string
  price?: string
  dashboardUrl?: string
}

export function BookingConfirmation({
  studentName = 'Student',
  subject = 'Mathematics',
  topic = null,
  sessionType = 'Once-off (60 min)',
  startTime = '',
  price = 'R150.00',
  dashboardUrl = 'http://localhost:3000/dashboard',
}: BookingConfirmationProps) {
  const formattedDate = startTime
    ? new Date(startTime).toLocaleString('en-ZA', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
      })
    : ''

  const detailRows: { label: string; value: string; color?: string }[] = [
    { label: 'Subject',       value: subject },
    ...(topic ? [{ label: 'Topic', value: topic }] : []),
    { label: 'Session type',  value: sessionType },
    { label: 'Date & time',   value: formattedDate },
    { label: 'Tutor',         value: TUTOR_NAME },
    { label: 'Amount paid',   value: price, color: '#2A7D27' },
  ]

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#F8F4EA', padding: '40px 0', margin: 0 }}>
        <Container style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', maxWidth: 560 }}>

          {/* Navy header bar */}
          <Section style={{ backgroundColor: '#1B3A6B', padding: '24px 32px' }}>
            <Text style={{ color: '#fff', fontWeight: 700, fontSize: 20, margin: 0, letterSpacing: '-0.3px' }}>
              {BRAND_NAME}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, margin: '2px 0 0' }}>
              Expert Mathematics Tutoring · South Africa
            </Text>
          </Section>

          {/* Confirmation badge */}
          <Section style={{ backgroundColor: '#F0FAF0', padding: '16px 32px', borderBottom: '1px solid #D4EDDA' }}>
            <Text style={{ color: '#2A7D27', fontWeight: 700, fontSize: 14, margin: 0 }}>
              ✓ Booking confirmed · Payment received
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 32px 8px' }}>
            <Heading style={{ color: '#1B3A6B', fontSize: 26, margin: '0 0 16px', fontWeight: 700 }}>
              You&apos;re booked, {studentName}!
            </Heading>
            <Text style={{ color: '#3D3D3D', fontSize: 16, lineHeight: 1.65, margin: '0 0 24px' }}>
              Great news — your session is confirmed and your payment has been received.
              Here&apos;s a summary of what you&apos;ve booked:
            </Text>

            {/* Details table */}
            <Section style={{ backgroundColor: '#F8F4EA', borderRadius: 8, padding: '20px 24px', margin: '0 0 24px' }}>
              {detailRows.map(({ label, value, color }) => (
                <Row key={label} style={{ marginBottom: 10 }}>
                  <Column style={{ width: '40%' }}>
                    <Text style={{ color: '#888', fontSize: 13, margin: 0 }}>{label}</Text>
                  </Column>
                  <Column style={{ width: '60%' }}>
                    <Text style={{ color: color ?? '#1A1A1A', fontWeight: label === 'Subject' || label === 'Amount paid' ? 700 : 400, margin: 0, fontSize: 14 }}>
                      {value}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Cal.com note */}
            <Section style={{ backgroundColor: '#EEF3FB', borderRadius: 8, padding: '14px 18px', margin: '0 0 28px' }}>
              <Text style={{ color: '#1B3A6B', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                <strong>Add to your calendar:</strong> You should have received a calendar invite from Cal.com.
                Check your inbox (or spam folder) and click <em>Accept</em> to add it to Google Calendar, Apple Calendar, or Outlook.
              </Text>
            </Section>

            <Button
              href={dashboardUrl}
              style={{
                backgroundColor: '#1B3A6B',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 9999,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-block',
              }}
            >
              View My Dashboard
            </Button>
          </Section>

          <Hr style={{ margin: '28px 32px 20px', borderColor: '#e5e7eb' }} />

          {/* Footer */}
          <Section style={{ padding: '0 32px 32px' }}>
            <Text style={{ color: '#aaa', fontSize: 12, margin: 0 }}>
              Need to reschedule or cancel? Visit your{' '}
              <a href={dashboardUrl} style={{ color: '#1B3A6B' }}>dashboard</a>{' '}
              at least 24 hours before the session. For anything else, email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: '#C9A84C' }}>{SUPPORT_EMAIL}</a>
            </Text>
            <Text style={{ color: '#ccc', fontSize: 11, margin: '6px 0 0' }}>
              {BRAND_NAME} · South Africa
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default BookingConfirmation
