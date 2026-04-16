import Link from 'next/link'

const ERROR_MESSAGES: Record<string, string> = {
  Configuration:   'There is a problem with the server configuration.',
  AccessDenied:    'You do not have permission to sign in.',
  Verification:    'The sign-in link is no longer valid.',
  CredentialsSignin: 'Invalid email or password.',
  Default:         'An unexpected error occurred. Please try again.',
}

interface Props {
  searchParams: { error?: string }
}

export default function AuthErrorPage({ searchParams }: Props) {
  const code    = searchParams.error ?? 'Default'
  const message = ERROR_MESSAGES[code] ?? ERROR_MESSAGES['Default']

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="bg-white rounded-xl shadow-card p-8 max-w-md w-full text-center space-y-4">
        <h1 className="font-display text-3xl text-navy">Sign-in Error</h1>
        <p className="text-ink">{message}</p>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-gold text-white font-medium hover:bg-gold-dark transition-colors"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-navy transition-colors"
          >
            Return to home
          </Link>
        </div>
      </div>
    </div>
  )
}
