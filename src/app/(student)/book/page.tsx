'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Clock, Calendar, Users, Video } from 'lucide-react'
import { PRICES, SESSION_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Lazy-load Cal.com embed — large bundle
const CalEmbed = dynamic(
  () => import('@calcom/embed-react').then(m => ({ default: m.default })),
  { ssr: false, loading: () => <div className="h-[600px] bg-cream rounded-xl animate-pulse" /> },
)

// Cal.com event type slugs — must match slugs created in your Cal.com dashboard
const TYPE_SLUGS: Record<string, string> = {
  meet_greet: 'meet-greet-15min',
  once_off:   'once-off-60min',
  group:      'group-120min',
  monthly:    'monthly-60min',
}

const SESSION_TYPES = [
  {
    value:       'meet_greet',
    label:       'Meet & Greet',
    description: 'Free 15-minute introduction call — no commitment',
    badge:       'Free',
    icon:        Video,
    priceKey:    'meet_greet',
  },
  {
    value:       'once_off',
    label:       'Once-off / Exam Prep',
    description: '60-minute focused one-on-one session',
    badge:       null,
    icon:        Clock,
    priceKey:    'once_off',
  },
  {
    value:       'group',
    label:       'Group Session',
    description: '2-hour session with other students (4–10 people)',
    badge:       null,
    icon:        Users,
    priceKey:    'group',
  },
  {
    value:       'monthly',
    label:       'Monthly Package',
    description: 'Unlimited sessions throughout the month',
    badge:       'Best value',
    icon:        Calendar,
    priceKey:    'monthly',
  },
]

type Step = 'type' | 'subject' | 'calendar'
const STEPS: Step[] = ['type', 'subject', 'calendar']
const STEP_LABELS: Record<Step, string> = {
  type:     'Session type',
  subject:  'Subject',
  calendar: 'Book & Pay',
}

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current)
  return (
    <nav aria-label="Booking progress" className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
              i < idx   && 'bg-green text-white',
              i === idx && 'bg-navy text-white',
              i > idx   && 'bg-border text-muted-foreground',
            )}
            aria-current={i === idx ? 'step' : undefined}
          >
            {i + 1}
          </div>
          <span className={cn('text-xs font-medium hidden sm:block', i === idx ? 'text-navy' : 'text-muted-foreground')}>
            {STEP_LABELS[step]}
          </span>
          {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        </div>
      ))}
    </nav>
  )
}

function formatPrice(cents: number) {
  if (cents === 0) return 'Free'
  return `R${(cents / 100).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`
}

// ── Step 1: Pick session type ─────────────────────────────────────────────────
function StepType({ onNext }: { onNext: (type: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-navy mb-1">Choose a session type</h1>
      <p className="text-muted-foreground text-sm mb-6">All sessions are conducted online via video call.</p>

      <div className="space-y-3 mb-8">
        {SESSION_TYPES.map(({ value, label, description, badge, icon: Icon, priceKey }) => {
          const price = PRICES[priceKey] ?? 0
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelected(value)}
              className={cn(
                'w-full text-left rounded-xl border-2 p-5 flex items-center gap-4 transition-all min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                selected === value
                  ? 'border-navy bg-navy/5'
                  : 'border-border bg-white hover:border-navy/40 hover:bg-cream',
              )}
              aria-pressed={selected === value}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                selected === value ? 'bg-navy text-white' : 'bg-cream text-navy',
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink">{label}</p>
                  {badge && (
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      price === 0
                        ? 'bg-green/10 text-green-700 border border-green/20'
                        : 'bg-gold/10 text-gold-dark border border-gold/20',
                    )}>
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn('font-bold', price === 0 ? 'text-green-700' : 'text-navy')}>
                  {formatPrice(price)}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full bg-gold hover:bg-gold-dark text-white font-semibold rounded-full py-3 text-sm transition-colors min-h-[44px] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        Continue
      </button>
    </div>
  )
}

// ── Step 2: Subject + Topic ───────────────────────────────────────────────────
function StepSubject({ sessionType, onNext, onBack }: {
  sessionType: string
  onNext: (subject: string, topic: string) => void
  onBack: () => void
}) {
  const [subject, setSubject] = useState('')
  const [topic,   setTopic]   = useState('')

  const isMeetGreet = sessionType === 'meet_greet'

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-navy mb-1">
        {isMeetGreet ? 'Tell us about yourself' : 'What do you need help with?'}
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        {isMeetGreet
          ? 'Let us know your level and what you\'re studying so we can make the most of our 15 minutes.'
          : 'Tell us the subject and specific topic so the session is focused from the start.'}
      </p>

      <div className="space-y-5 mb-8">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1.5">
            {isMeetGreet ? 'Subject / Level' : 'Subject'} <span className="text-red-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder={isMeetGreet ? 'e.g. Grade 12 Statistics, First-year Data Analysis' : 'e.g. Statistics, Probability, Data Analysis'}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-ink mb-1.5">
            {isMeetGreet ? 'Specific challenge or goal' : 'Topic'}
            <span className="text-muted-foreground font-normal"> (optional)</span>
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={isMeetGreet ? 'e.g. Struggling with regression before finals' : 'e.g. Hypothesis Testing, Regression, ANOVA'}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1.5 border border-border rounded-full px-5 py-3 text-sm font-medium text-ink hover:bg-cream transition-colors min-h-[44px]">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button type="button"
          onClick={() => subject.trim() && onNext(subject.trim(), topic.trim())}
          disabled={!subject.trim()}
          className="flex-1 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full py-3 text-sm transition-colors min-h-[44px] disabled:opacity-50">
          Continue
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Cal.com embed ─────────────────────────────────────────────────────
function StepCalendar({ sessionType, subject, topic, userName, userEmail, onBack }: {
  sessionType: string
  subject:     string
  topic:       string
  userName:    string
  userEmail:   string
  onBack:      () => void
}) {
  const slug    = TYPE_SLUGS[sessionType] ?? 'once-off-60min'
  const calUser = process.env.NEXT_PUBLIC_CAL_USERNAME ?? 'ps.ndlovu_mdubusistats'
  const calLink = `${calUser}/${slug}`
  const isFree  = sessionType === 'meet_greet'

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-navy mb-1">Pick a date & time</h1>
      <p className="text-muted-foreground text-sm mb-2">
        {isFree
          ? 'Choose a 15-minute slot for your free introduction call.'
          : 'Payment is collected securely at checkout before your session is confirmed.'}
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded-full">{SESSION_LABELS[sessionType] ?? sessionType}</span>
        <span className="text-xs bg-blue/10 text-blue px-2 py-1 rounded-full">{subject}</span>
        {topic && <span className="text-xs bg-cream text-muted-foreground border border-border px-2 py-1 rounded-full">{topic}</span>}
        <span className="text-xs bg-green/10 text-green-700 border border-green/20 px-2 py-1 rounded-full flex items-center gap-1">
          <Video className="w-3 h-3" /> Online
        </span>
      </div>

      <CalEmbed
        calLink={calLink}
        config={{
          layout: 'month_view',
          theme:  'light',
          prefill: {
            name:  userName,
            email: userEmail,
            notes: topic ? `Subject: ${subject} — Topic: ${topic}` : `Subject: ${subject}`,
          },
        }}
        style={{ width: '100%', height: '600px', border: 'none', borderRadius: '12px' }}
      />

      <button type="button" onClick={onBack}
        className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BookPage() {
  const { data: session } = useSession()
  const [sessionType, setSessionType] = useState<string | null>(null)
  const [subject,     setSubject]     = useState<string | null>(null)
  const [topic,       setTopic]       = useState<string>('')
  const [step,        setStep]        = useState<Step>('type')

  const userName  = session?.user?.name  ?? ''
  const userEmail = session?.user?.email ?? ''

  return (
    <div className="max-w-xl">
      <Link href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded">
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <StepIndicator current={step} />

      {step === 'type' && (
        <StepType onNext={type => { setSessionType(type); setStep('subject') }} />
      )}

      {step === 'subject' && sessionType && (
        <StepSubject
          sessionType={sessionType}
          onNext={(s, t) => { setSubject(s); setTopic(t); setStep('calendar') }}
          onBack={() => setStep('type')}
        />
      )}

      {step === 'calendar' && sessionType && subject && (
        <StepCalendar
          sessionType={sessionType}
          subject={subject}
          topic={topic}
          userName={userName}
          userEmail={userEmail}
          onBack={() => setStep('subject')}
        />
      )}
    </div>
  )
}
