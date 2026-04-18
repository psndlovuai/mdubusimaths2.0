'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router   = useRouter()
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
    router.push('/dashboard')
  }

  return (
    <>
      <h1 className="font-display text-3xl font-medium text-navy mb-1">
        Welcome back
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Sign in to your student account
      </p>

      {/* Credentials form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
            autoComplete="current-password"
            aria-describedby={errors.password ? 'password-error' : undefined}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            placeholder="••••••••"
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {authError && (
          <p className="text-sm text-red-600 text-center" role="alert">
            {authError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold hover:bg-gold-dark text-white font-semibold rounded-full py-3 text-sm transition-colors min-h-[44px] flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New student?{' '}
        <Link href="/signup" className="text-navy font-medium hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-4 text-center">
        <Link
          href="/tutor/login"
          className="text-xs text-muted-foreground hover:text-navy transition-colors"
        >
          Tutor? Sign in here
        </Link>
      </p>
    </>
  )
}
