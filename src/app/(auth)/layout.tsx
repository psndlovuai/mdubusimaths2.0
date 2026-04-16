import Link from 'next/link'
import { BRAND_NAME } from '@/lib/constants'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / wordmark */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md">
            {/* Green diamond accent */}
            <span
              aria-hidden="true"
              className="block w-3 h-3 bg-green rotate-45 mb-1"
            />
            <span className="font-display text-2xl font-medium text-navy leading-none">
              {BRAND_NAME}
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-card px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  )
}
