import {
  Html, Head, Body, Container, Heading, Text, Button, Hr, Section, Row, Column,
} from '@react-email/components'
import { BRAND_NAME } from '@/lib/constants'

interface TutorNewBookingAlertProps {
  studentName?: string
  studentEmail?: string
  studentPhone?: string | null
  subject?: string
  topic?: string | null
  sessionType?: string
  startTime?: string
  tutorDashboardUrl?: string
}

export function TutorNewBookingAlert({
  studentName = 'Student',
  studentEmail = '',
  studentPhone = null,
  subject = 'Statistics',
  topic = null,
  sessionType = 'Once-off (60 min)',
  startTime = '',
  tutorDashboardUrl = 'http://localhost:3000/tutor/dashboard',
}: TutorNewBookingAlertProps) {
  const formattedDate = startTime
    ? new Date(startTime).toLocaleString('en-ZA', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg',
      })
    : ''

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
              Tutor Dashboard Alert
            </Text>
          </Section>

          {/* Alert badge */}
          <Section style={{ backgroundColor: '#FFF8E7', padding: '14px 32px', borderBottom: '1px solid #F0D98B' }}>
            <Text style={{ color: '#8A6200', fontWeight: 700, fontSize: 14, margin: 0 }}>
              New paid booking received — action may be required
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 32px 8px' }}>
            <Heading style={{ color: '#1B3A6B', fontSize: 24, margin: '0 0 16px', fontWeight: 700 }}>
              New Booking: {sessionType}
            </Heading>
            <Text style={{ color: '#3D3D3D', fontSize: 16, lineHeight: 1.65, margin: '0 0 24px' }}>
              A student has booked and paid for a session. Here&apos;s the full summary:
            </Text>

            {/* Student contact */}
            <Section style={{ backgroundColor: '#EEF3FB', borderRadius: 8, padding: '16px 20px', margin: '0 0 16px' }}>
              <Text style={{ color: '#1B3A6B', fontWeight: 700, fontSize: 13, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Student Contact
              </Text>
              <Row style={{ marginBottom: 6 }}>
                <Column style={{ width: '35%' }}>
                  <Text style={{ color: '#888', fontSize: 13, margin: 0 }}>Name</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={{ color: '#1A1A1A', fontWeight: 700, margin: 0, fontSize: 14 }}>{studentName}</Text>
                </Column>
              </Row>
              <Row style={{ marginBottom: 6 }}>
                <Column style={{ width: '35%' }}>
                  <Text style={{ color: '#888', fontSize: 13, margin: 0 }}>Email</Text>
                </Column>
                <Column style={{ width: '65%' }}>
                  <Text style={{ margin: 0, fontSize: 14 }}>
                    <a href={`mailto:${studentEmail}`} style={{ color: '#1B3A6B' }}>{studentEmail}</a>
                  </Text>
                </Column>
              </Row>
              {studentPhone && (
                <Row>
                  <Column style={{ width: '35%' }}>
                    <Text style={{ color: '#888', fontSize: 13, margin: 0 }}>Phone</Text>
                  </Column>
                  <Column style={{ width: '65%' }}>
                    <Text style={{ margin: 0, fontSize: 14 }}>
                      <a href={`tel:${studentPhone}`} style={{ color: '#1B3A6B' }}>{studentPhone}</a>
                    </Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Session details */}
            <Section style={{ backgroundColor: '#F8F4EA', borderRadius: 8, padding: '16px 20px', margin: '0 0 28px' }}>
              <Text style={{ color: '#1B3A6B', fontWeight: 700, fontSize: 13, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Session Details
              </Text>
              {[
                { label: 'Subject',      value: subject },
                ...(topic ? [{ label: 'Topic', value: topic }] : []),
                { label: 'Session type', value: sessionType },
                { label: 'Date & time',  value: formattedDate },
              ].map(({ label, value }) => (
                <Row key={label} style={{ marginBottom: 8 }}>
                  <Column style={{ width: '35%' }}>
                    <Text style={{ color: '#888', fontSize: 13, margin: 0 }}>{label}</Text>
                  </Column>
                  <Column style={{ width: '65%' }}>
                    <Text style={{ color: '#1A1A1A', margin: 0, fontSize: 14, fontWeight: label === 'Date & time' ? 700 : 400 }}>{value}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Button
              href={tutorDashboardUrl}
              style={{
                backgroundColor: '#C9A84C',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 9999,
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-block',
              }}
            >
              Open Tutor Dashboard
            </Button>
          </Section>

          <Hr style={{ margin: '28px 32px 20px', borderColor: '#e5e7eb' }} />

          <Section style={{ padding: '0 32px 32px' }}>
            <Text style={{ color: '#ccc', fontSize: 11, margin: 0 }}>
              {BRAND_NAME} · Automated alert — do not reply
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default TutorNewBookingAlert
