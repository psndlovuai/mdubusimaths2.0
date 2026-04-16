import Link from 'next/link'
import { Logo } from '@/components/layout/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-md" aria-label="Mdubusi Mathematics — home">
            <Logo variant="on-light" className="h-12 w-auto" priority />
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
