import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** 'on-light' = full-colour horizontal (for white/cream bg)
   *  'on-dark'  = monochrome horizontal (for navy bg, CSS inverts to white) */
  variant?: 'on-light' | 'on-dark'
  /** 'horizontal' = full wordmark (default) | 'mark' = badge only */
  shape?: 'horizontal' | 'mark'
  className?: string
  priority?: boolean
}

export function Logo({
  variant = 'on-light',
  shape = 'horizontal',
  className,
  priority,
}: LogoProps) {
  const src =
    shape === 'mark'
      ? '/logo-mark.svg'
      : variant === 'on-dark'
        ? '/logo-monochrome.svg'
        : '/logo.svg'

  const { w, h } = shape === 'mark'
    ? { w: 40, h: 40 }
    : { w: 176, h: 48 }

  return (
    <Image
      src={src}
      alt="Mdubusi Statistics"
      width={w}
      height={h}
      priority={priority}
      className={cn(
        'transition-opacity duration-200',
        variant === 'on-dark' && 'brightness-0 invert',
        className,
      )}
    />
  )
}
