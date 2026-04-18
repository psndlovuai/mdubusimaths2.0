'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail } from 'lucide-react'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router   = useRouter()
  const [authError,   setAuthError]   = useState<string | null>(null)
  const [magicEmail,  setMagicEmail]  = useState('')
  const [magicSent,   setMagicSent]   = useState(false)
  const [magicLoading,setMagicLoading]= useState(false)

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

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!magicEmail) return
    setMagicLoading(true)
    await signIn('resend', { email: magicEmail, redirect: false, callbackUrl: '/dashboard' })
    setMagicSent(true)
    setMagicLoading(false)
  }

  return (
    <>
      <h1 className="font-display text-3xl font-medium text-navy mb-1">
        Welcome back
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Sign in to your student account
      </p>

      {/* Apple Sign In */}
      <button
        type="button"
        onClick={() => signIn('apple', { callbackUrl: '/dashboard' })}
        className="w-full flex items-center justify-center gap-3 bg-black hover:bg-zinc-800 text-white rounded-xl py-3 text-sm font-medium min-h-[44px] mb-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.7 0 228.3 0 148.4 0 62.2 57.8 14.1 114.3 14.1c71.6 0 121.1 46.8 164 46.8 40.8 0 103.1-49.7 179.7-49.7 68.7 0 173.8 40.5 220.5 129.2zM470.7 61.4c16-20.4 33.6-44.2 33.6-73.1 0-3.8-.6-7.7-1.3-11.5-31.4 1.3-69.5 21.1-92.7 46.8-15.4 16.7-35.2 44.2-35.2 73.7 0 4.5.6 9 1.3 11.5 2.6.6 5.8 1.3 9.0 1.3 28.8 0 63.5-19.2 85.3-48.7z"/>
        </svg>
        Continue with Apple
      </button>

      {/* Email magic link */}
      {magicSent ? (
        <div className="w-full text-center bg-green/10 border border-green/20 rounded-xl py-3 px-4 text-sm text-green-700 mb-3">
          Check your email — we sent a sign-in link to <strong>{magicEmail}</strong>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="flex gap-2 mb-3">
          <input
            type="email"
            placeholder="Email for magic link"
            value={magicEmail}
            onChange={e => setMagicEmail(e.target.value)}
            className="flex-1 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
          />
          <button
            type="submit"
            disabled={magicLoading || !magicEmail}
            className="flex items-center gap-1.5 bg-navy hover:bg-navy-dark text-white text-sm font-semibold rounded-xl px-4 min-h-[44px] transition-colors disabled:opacity-50"
          >
            {magicLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Send link
          </button>
        </form>
      )}

      <div className="relative flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or sign in with password</span>
        <div className="flex-1 h-px bg-border" />
      </div>

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
