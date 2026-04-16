'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'
import { BRAND_NAME } from '@/lib/constants'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

// Override the shared auth layout for the tutor page — full navy background
export default function TutorLoginPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setAuthError(null)
    const result = await signIn('credentials', {
      email:    values.email,
      password: values.password,
      redirect: false,
    })
    if (result?.error) {
      setAuthError('Invalid email or password')
      return
    }
    router.push('/tutor/dashboard')
  }

  return (
    // Full-bleed navy override — positioned to cover the card from the parent layout
    <div className="-mx-8 -my-10 bg-navy rounded-xl px-8 py-10 min-h-[520px] flex flex-col">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors mb-8 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to main site
      </Link>

      {/* Wordmark */}
      <div className="flex items-center gap-2 mb-10">
        <span aria-hidden="true" className="block w-2.5 h-2.5 bg-green rotate-45 flex-shrink-0" />
        <span className="font-display text-xl font-medium text-white leading-none">{BRAND_NAME}</span>
      </div>

      <div className="flex-1">
        <h1 className="font-display text-3xl font-medium text-white mb-2">
          Tutor Portal
        </h1>
        <p className="text-white/70 text-sm mb-8">
          Sign in to manage your sessions and students
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
              placeholder="you@mdubusimaths.com"
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {authError && (
            <p className="text-sm text-red-400 text-center" role="alert">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold-dark text-white font-semibold rounded-full py-3 text-sm transition-colors min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign in to portal
          </button>
        </form>
      </div>
    </div>
  )
}
