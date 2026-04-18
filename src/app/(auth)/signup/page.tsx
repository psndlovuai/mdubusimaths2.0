'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { registerStudent, registerSchema } from '@/app/actions/auth'

type FormValues = z.infer<typeof registerSchema>

const ACADEMIC_LEVELS = [
  { value: 'grade_11',      label: 'Grade 11' },
  { value: 'grade_12',      label: 'Grade 12' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'postgraduate',  label: 'Postgraduate' },
]

export default function SignupPage() {
  const router   = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    const result = await registerStudent(values)
    if (result.error) {
      setServerError(result.error)
      return
    }
    const signInResult = await signIn('credentials', {
      email:    values.email,
      password: values.password,
      redirect: false,
    })
    if (signInResult?.error) {
      setServerError('Account created! Please sign in.')
      return
    }
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <>
      <h1 className="font-display text-3xl font-medium text-navy mb-1">
        Create an account
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Start your mathematics journey today
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-ink mb-1.5">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
              placeholder="Thabo"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-ink mb-1.5">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
              placeholder="Mokoena"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p id="lastName-error" className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            placeholder="you@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            placeholder="At least 8 characters"
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="academicLevel" className="block text-sm font-medium text-ink mb-1.5">
            Academic level
          </label>
          <select
            id="academicLevel"
            aria-describedby={errors.academicLevel ? 'level-error' : undefined}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px] appearance-none"
            {...register('academicLevel')}
            defaultValue=""
          >
            <option value="" disabled>Select your level</option>
            {ACADEMIC_LEVELS.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          {errors.academicLevel && (
            <p id="level-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.academicLevel.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-600 text-center" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold hover:bg-gold-dark text-white font-semibold rounded-full py-3 text-sm transition-colors min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-navy font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
