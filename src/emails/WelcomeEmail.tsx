import {
  Html, Head, Body, Container, Heading, Text, Button, Hr, Section,
} from '@react-email/components'
import { BRAND_NAME, TUTOR_NAME, SUPPORT_EMAIL } from '@/lib/constants'

interface WelcomeEmailProps {
  studentName?: string
  bookUrl?: string
}

export function WelcomeEmail({
  studentName = 'Student',
  bookUrl = 'http://localhost:3000/book',
}: WelcomeEmailProps) {
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

          {/* Body */}
          <Section style={{ padding: '36px 32px 8px' }}>
            <Heading style={{ color: '#1B3A6B', fontSize: 26, margin: '0 0 20px', fontWeight: 700 }}>
              Welcome aboard, {studentName}!
            </Heading>
            <Text style={{ color: '#3D3D3D', fontSize: 16, lineHeight: 1.65, margin: '0 0 14px' }}>
              Hi {studentName}, I&apos;m {TUTOR_NAME} and I&apos;m excited to help you master Mathematics.
              Whether you&apos;re tackling Grade 11 or 12 finals, or pushing through university-level courses,
              you&apos;re in the right place.
            </Text>
            <Text style={{ color: '#3D3D3D', fontSize: 16, lineHeight: 1.65, margin: '0 0 28px' }}>
              Book your first session below — once-off, monthly package, or group session, whichever works best for you.
            </Text>

            <Button
              href={bookUrl}
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
              Book My First Session
            </Button>
          </Section>

          {/* What to expect */}
          <Section style={{ padding: '28px 32px', backgroundColor: '#F8F4EA', margin: '28px 32px', borderRadius: 8 }}>
            <Text style={{ color: '#1B3A6B', fontWeight: 700, fontSize: 14, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              What to expect
            </Text>
            {[
              'Personalised sessions tailored to your syllabus and pace',
              'Clear, step-by-step explanations — no jargon',
              'Session notes and past-paper practice included',
              'Flexible scheduling — book and reschedule through your dashboard',
            ].map((item, i) => (
              <Text key={i} style={{ color: '#3D3D3D', fontSize: 14, lineHeight: 1.6, margin: '0 0 6px' }}>
                ✓ {item}
              </Text>
            ))}
          </Section>

          <Hr style={{ margin: '8px 32px 20px', borderColor: '#e5e7eb' }} />

          {/* Footer */}
          <Section style={{ padding: '0 32px 32px' }}>
            <Text style={{ color: '#aaa', fontSize: 12, margin: 0 }}>
              Questions? Reply to this email or contact us at{' '}
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

export default WelcomeEmail
