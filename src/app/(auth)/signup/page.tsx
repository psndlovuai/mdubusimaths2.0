'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle } from 'lucide-react'

const schema = z.object({
  // ── Account
  firstName:     z.string().min(1, 'First name is required'),
  lastName:      z.string().min(1, 'Last name is required'),
  email:         z.string().email('Enter a valid email address'),
  password:      z.string().min(8, 'Password must be at least 8 characters'),
  // ── Profile
  phone:         z.string().min(1, 'Phone number is required'),
  academicLevel: z.string().min(1, 'Please select your academic level'),
  school:        z.string().optional(),
  subjects:      z.string().optional(),
  preferredMode: z.enum(['online', 'in_person', 'both']).default('online'),
  location:      z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const ACADEMIC_LEVELS = [
  { value: 'grade_11',      label: 'Grade 11' },
  { value: 'grade_12',      label: 'Grade 12' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'postgraduate',  label: 'Postgraduate' },
]

const inputCls = 'w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] bg-white'

export default function SignupPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success,     setSuccess]     = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { preferredMode: 'online' },
    })

  const mode = watch('preferredMode')

  async function onSubmit(values: FormValues) {
    setServerError(null)
    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error ?? 'Could not create account. Please try again.')
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center py-6 gap-4">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <h2 className="font-display text-2xl font-medium text-navy">Account created!</h2>
        <p className="text-muted-foreground text-sm">Taking you to sign in…</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="font-display text-3xl font-medium text-navy mb-1">Create an account</h1>
      <p className="text-muted-foreground text-sm mb-6">Start your mathematics journey today</p>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="w-full flex items-center justify-center gap-3 border border-border bg-white hover:bg-cream text-ink rounded-xl py-3 text-sm font-medium min-h-[44px] mb-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or sign up with email</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

        {/* ── Account details ───────────────────────────────────────────── */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account details</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-ink mb-1.5">First name</label>
              <input id="firstName" type="text" autoComplete="given-name" placeholder="Thabo"
                className={inputCls} {...register('firstName')} />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-ink mb-1.5">Last name</label>
              <input id="lastName" type="text" autoComplete="family-name" placeholder="Mokoena"
                className={inputCls} {...register('lastName')} />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">Email address</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
              className={inputCls} {...register('email')} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters"
              className={inputCls} {...register('password')} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">Phone number</label>
            <input id="phone" type="tel" autoComplete="tel" placeholder="+27 82 000 0000"
              className={inputCls} {...register('phone')} />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>
        </div>

        {/* ── Academic profile ──────────────────────────────────────────── */}
        <div className="space-y-4 pt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Academic profile</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="academicLevel" className="block text-sm font-medium text-ink mb-1.5">Academic level</label>
              <select id="academicLevel" defaultValue=""
                className={`${inputCls} appearance-none`}
                {...register('academicLevel')}>
                <option value="" disabled>Select level</option>
                {ACADEMIC_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              {errors.academicLevel && <p className="mt-1 text-xs text-red-600">{errors.academicLevel.message}</p>}
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-ink mb-1.5">
                School / University <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <input id="school" type="text" placeholder="e.g. Eduvos, Wits, UCT"
                className={inputCls} {...register('school')} />
            </div>
          </div>

          <div>
            <label htmlFor="subjects" className="block text-sm font-medium text-ink mb-1.5">
              Subjects you need help with <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input id="subjects" type="text" placeholder="e.g. Mathematics, Physical Sciences, Calculus"
              className={inputCls} {...register('subjects')} />
          </div>
        </div>

        {/* ── Session preference ────────────────────────────────────────── */}
        <div className="space-y-4 pt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session preference</p>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">How would you like to learn?</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'online',    label: 'Online' },
                { value: 'in_person', label: 'In-person' },
                { value: 'both',      label: 'Both' },
              ] as const).map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-center gap-2 border-2 rounded-xl py-3 text-sm font-medium cursor-pointer transition-all ${
                    mode === opt.value
                      ? 'border-navy bg-navy/5 text-navy'
                      : 'border-border bg-white text-muted-foreground hover:border-navy/40'
                  }`}
                >
                  <input type="radio" className="sr-only" value={opt.value} {...register('preferredMode')} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {(mode === 'in_person' || mode === 'both') && (
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-ink mb-1.5">
                Your area / city
              </label>
              <input id="location" type="text" placeholder="e.g. Johannesburg, Pretoria, Cape Town"
                className={inputCls} {...register('location')} />
              <p className="mt-1 text-xs text-muted-foreground">
                Helps us find nearby in-person session options
              </p>
            </div>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600 text-center" role="alert">{serverError}</p>}

        <button type="submit" disabled={isSubmitting}
          className="w-full bg-gold hover:bg-gold-dark text-white font-semibold rounded-full py-3 text-sm transition-colors min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-navy font-medium hover:underline">Sign in</Link>
      </p>
    </>
  )
}
