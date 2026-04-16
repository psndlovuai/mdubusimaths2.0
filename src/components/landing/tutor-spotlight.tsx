'use client'

import { motion } from 'framer-motion'
import { AnimatedSection } from '@/components/ui/animated-section'
import { TUTOR_NAME } from '@/lib/constants'

const FLOAT_SYMBOLS = [
  { s: '∫',    x: '8%',  y: '14%', size: '2.6rem', dur: 4.2, delay: 0   },
  { s: '∑',    x: '72%', y: '10%', size: '2.2rem', dur: 3.8, delay: 0.6 },
  { s: 'π²',   x: '14%', y: '68%', size: '2rem',   dur: 5.0, delay: 1.2 },
  { s: '√x',   x: '65%', y: '64%', size: '1.8rem', dur: 4.5, delay: 0.3 },
  { s: 'Δ',    x: '44%', y: '22%', size: '2.4rem', dur: 3.5, delay: 1.7 },
  { s: 'dy/dx',x: '54%', y: '72%', size: '1.3rem', dur: 4.8, delay: 0.9 },
  { s: 'e=mc²',x: '76%', y: '42%', size: '1.2rem', dur: 5.2, delay: 2.1 },
  { s: 'θ',    x: '30%', y: '50%', size: '2rem',   dur: 3.9, delay: 1.4 },
]

function AnimatedMathPanel() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Main dark card */}
      <div className="absolute inset-0 bg-navy rounded-3xl overflow-hidden">

        {/* Floating math symbols */}
        {FLOAT_SYMBOLS.map(({ s, x, y, size, dur, delay }) => (
          <motion.span
            key={s}
            className="absolute font-mono text-gold/20 select-none pointer-events-none"
            style={{ left: x, top: y, fontSize: size }}
            animate={{ y: ['0px', '-14px', '0px'] }}
            transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            {s}
          </motion.span>
        ))}

        {/* Slow-rotating outer ring */}
        <motion.div
          className="absolute inset-6 rounded-full border border-gold/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />

        {/* Counter-rotating inner ring */}
        <motion.div
          className="absolute inset-16 rounded-full border border-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />

        {/* Pulsing centre glow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-gold/10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.span
            className="font-display text-5xl font-semibold text-gold leading-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'backOut' }}
          >
            PS
          </motion.span>
          <motion.span
            className="text-white/40 text-xs tracking-[0.3em] uppercase mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Ndlovu
          </motion.span>
        </div>
      </div>

      {/* Green availability dot */}
      <motion.div
        className="absolute bottom-5 right-5 w-4 h-4 bg-green rounded-full border-2 border-cream z-20"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </div>
  )
}

export function TutorSpotlight() {
  return (
    <section id="about" aria-labelledby="tutor-heading" className="bg-cream py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* Animated visual — replaces static photo circle */}
          <AnimatedSection className="flex justify-center md:justify-end">
            <AnimatedMathPanel />
          </AnimatedSection>

          {/* Bio */}
          <AnimatedSection delay={0.15}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-0.5 bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">Meet Your Tutor</span>
            </div>

            <h2 id="tutor-heading" className="font-display text-4xl md:text-5xl font-medium text-navy mb-2">
              {TUTOR_NAME}
            </h2>

            <p className="text-muted-foreground text-sm mb-6">
              BSc Mathematics (cum laude) · PGCE Education · 5+ years private tutoring
            </p>

            <blockquote className="border-l-4 border-gold pl-5 mb-6">
              <p className="text-ink text-lg leading-relaxed italic">
                &ldquo;Mathematics is not about memorising formulas — it&apos;s about developing
                logical thinking and problem-solving skills that last a lifetime.&rdquo;
              </p>
            </blockquote>

            <div className="space-y-3 text-muted-foreground">
              <p>
                With a passion for making mathematics accessible, {TUTOR_NAME} specialises
                in breaking down complex concepts into clear, manageable steps. Every
                student learns differently, and sessions are tailored to meet each
                student&apos;s unique pace and learning style.
              </p>
              <p>
                From high school algebra to university-level calculus, the focus is always
                on deep understanding — not just passing the next test.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Grade 11 & 12', 'University Maths', 'Exam Preparation', 'Statistics', 'Calculus'].map(tag => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-navy/10 text-navy px-3 py-1.5 rounded-full border border-navy/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  )
}
