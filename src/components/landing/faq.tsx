'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    question: 'What is the Meet & Greet and do I have to pay?',
    answer:   'The Meet & Greet is a free 15-minute online introduction call — no payment, no commitment. It\'s a chance for us to understand your goals, current level, and challenges, and for you to get a feel for the teaching style before committing to a full session.',
  },
  {
    question: 'Are all sessions online?',
    answer:   'Yes, all sessions are conducted 100% online via video call. You can join from anywhere in South Africa — all you need is a stable internet connection, a device with a camera, and something to write on. No commuting, no travel costs.',
  },
  {
    question: 'What session types are available?',
    answer:   'We offer four options: a free 15-minute Meet & Greet; a 60-minute once-off session (R150) — perfect for exam prep or a specific topic; a 2-hour group session (R400 per person) with 4–10 students on a shared topic; and a monthly package (R1,500) with unlimited 60-minute sessions and priority scheduling.',
  },
  {
    question: 'How does payment work?',
    answer:   'Payment is processed securely at checkout when you book. We accept all major credit and debit cards. Your session is only confirmed once payment is received — no risk of double-booking. The Meet & Greet is completely free with no payment required.',
  },
  {
    question: 'Can I cancel a booking?',
    answer:   'Yes, cancellations are allowed up to 12 hours before the scheduled session start time. Cancellations made within 12 hours of the session cannot be refunded. Please see our full Refund Policy for details.',
  },
  {
    question: 'What subjects and levels do you cover?',
    answer:   'We specialise in Mathematics at all levels — Grade 11 and 12 (CAPS curriculum), and university-level maths including calculus, linear algebra, probability and statistics, and differential equations. If you\'re unsure whether your level or topic is covered, start with a free Meet & Greet.',
  },
  {
    question: 'How do group sessions work?',
    answer:   'Group sessions run for 2 hours online and accommodate 4–10 students. The topic is agreed upon at booking so everyone arrives prepared. At R400 per person, they are excellent value — great for study groups or friends tackling the same exam.',
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
