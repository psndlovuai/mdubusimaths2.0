'use client'
import Image from 'next/image'
import { useThemeContrast } from '@/hooks/use-theme-contrast'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'auto' | 'on-light' | 'on-dark'
  className?: string
  priority?: boolean
}

export function Logo({ variant = 'auto', className, priority }: LogoProps) {
  const detected = useThemeContrast()
  const mode = variant === 'auto'
    ? (detected === 'dark' ? 'on-dark' : 'on-light')
    : variant

  return (
    <Image
      src={mode === 'on-dark' ? '/logo-monochrome.svg' : '/logo.svg'}
      alt="Mdubusi Mathematics"
      width={140}
      height={40}
      priority={priority}
      className={cn(
        'transition-opacity duration-200',
        mode === 'on-dark' && 'brightness-0 invert',
        className,
      )}
    />
  )
}
