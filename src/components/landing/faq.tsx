'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    question: 'How do I book a session?',
    answer:   'Create a free account, choose your session type (once-off, monthly, or group), select a date and time from the available slots, and complete payment. Your booking is confirmed immediately after payment.',
  },
  {
    question: 'How does payment work?',
    answer:   'Payment is processed securely through Cal.com at the time of booking. We accept all major payment methods including credit/debit cards. Your booking is only confirmed once payment has been received — so there is no risk of double-booking.',
  },
  {
    question: 'Can I cancel a booking?',
    answer:   'Yes, cancellations are allowed up to 12 hours before the scheduled session start time. Cancellations within 12 hours of the session cannot be refunded. Please refer to our full Cancellation and Refund policies for complete details.',
  },
  {
    question: 'What subjects do you cover?',
    answer:   'We specialise in Mathematics at all levels — Pure Maths, Applied Maths, Statistics, and related subjects. For Grade 11 and 12 students we follow the CAPS curriculum. For university students we cover calculus, linear algebra, differential equations, and more.',
  },
  {
    question: 'What levels do you teach?',
    answer:   'We teach Grade 11, Grade 12 (NSC), and university-level mathematics including first-year calculus, linear algebra, probability and statistics, and real analysis. If you are unsure whether your level is covered, feel free to reach out before booking.',
  },
  {
    question: 'How do group sessions work?',
    answer:   'Group sessions accommodate up to 6 students and run for 2 hours. They are ideal for peer learning and exam preparation on a specific topic. Each group session is focused on a set topic agreed upon at booking. At R800 per session, they offer excellent value for multiple students studying the same content.',
  },
]

function FaqItem({ question, answer, isOpen, onToggle }: {
  question: string
  answer:   string
  isOpen:   boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded group"
        aria-expanded={isOpen}
      >
        <span className={cn('font-medium text-[15px] transition-colors', isOpen ? 'text-navy' : 'text-ink group-hover:text-navy')}>
          {question}
        </span>
        <ChevronDown
          className={cn('w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-300', isOpen && 'rotate-180 text-gold')}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section aria-labelledby="faq-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 id="faq-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know before booking your first session.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-card px-6 md:px-8">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
