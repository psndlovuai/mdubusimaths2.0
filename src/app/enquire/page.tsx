'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle, Mail, Phone, MapPin } from 'lucide-react'
import { submitEnquiry } from '@/app/actions/enquiry'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const SUBJECTS = [
  'Meet & Greet (Free intro call)',
  'Once-off / Exam Prep Session',
  'Group Session',
  'Monthly Package',
  'Grade 11 Mathematics',
  'Grade 12 Mathematics',
  'University Mathematics',
  'Pricing & Packages',
  'Other',
]

export default function EnquirePage() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const [form, setForm] = useState({
    name:    '',
    email:   '',
    phone:   '',
    subject: '',
    message: '',
  })

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await submitEnquiry(form)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* Page header */}
        <div className="bg-navy py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-gold" />
              <span className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">Get in Touch</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-medium text-white">
              Enquire Now
            </h1>
            <p className="text-white/60 mt-3 max-w-xl text-lg">
              Have a question about sessions, pricing, or scheduling? Fill in the form
              and we&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Contact info sidebar ── */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-semibold text-navy text-lg mb-5">Contact Details</h2>
                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                      <a href="mailto:info@mdubusimaths.com" className="text-navy font-medium text-sm hover:underline">
                        info@mdubusimaths.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">WhatsApp</p>
                      <a href="https://wa.me/27833819069" className="text-navy font-medium text-sm hover:underline">
                        +27 83 381 9069
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                      <p className="text-navy font-medium text-sm">South Africa</p>
                      <p className="text-muted-foreground text-xs">Sessions conducted online</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-navy rounded-2xl p-7">
                <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">Response time</p>
                <p className="text-white font-display text-3xl font-medium mb-1">Within 24 hrs</p>
                <p className="text-white/50 text-sm">We reply to all enquiries on business days.</p>
              </div>
            </aside>

            {/* ── Enquiry form ── */}
            <div className="lg:col-span-2">
              {success ? (
                <div className="bg-white rounded-2xl shadow-card p-10 flex flex-col items-center text-center h-full justify-center min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 text-green" />
                  </div>
                  <h2 className="font-display text-3xl font-medium text-navy mb-3">Enquiry Sent!</h2>
                  <p className="text-muted-foreground max-w-sm mb-8">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold rounded-full px-8 py-3 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-card p-8 space-y-5"
                >
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                        Email Address <span className="text-gold">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
                        Phone / WhatsApp <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+27 00 000 0000"
                        value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1.5">
                        Subject <span className="text-gold">*</span>
                      </label>
                      <select
                        id="subject"
                        required
                        value={form.subject}
                        onChange={e => set('subject', e.target.value)}
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition"
                      >
                        <option value="">Select a subject…</option>
                        {SUBJECTS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-ink mb-1.5">
                      Message <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      placeholder="Tell us what you need help with, your grade/level, any specific topics, or questions about pricing…"
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-destructive text-sm bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-full py-4 text-base transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  >
                    <Send className="w-4 h-4" />
                    {isPending ? 'Sending…' : 'Send Enquiry'}
                  </button>

                  <p className="text-xs text-center text-muted-foreground">
                    Your enquiry is sent directly to{' '}
                    <span className="text-navy font-medium">info@mdubusimaths.com</span>.
                    We&apos;ll reply within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
