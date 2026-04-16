import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:     'border-transparent bg-navy text-white',
        confirmed:   'border-transparent bg-green/20 text-green',
        pending:     'border-transparent bg-gold/20 text-gold-dark',
        cancelled:   'border-transparent bg-muted/20 text-muted',
        completed:   'border-transparent bg-navy/20 text-navy',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline:     'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
