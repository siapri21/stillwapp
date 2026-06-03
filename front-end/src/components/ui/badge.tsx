import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--sw-pink)] text-white',
        secondary: 'border-transparent bg-emerald-500 text-white',
        outline: 'border-black/10 text-[var(--sw-muted)]',
        accent: 'border-transparent bg-[var(--sw-yellow)] text-black',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
