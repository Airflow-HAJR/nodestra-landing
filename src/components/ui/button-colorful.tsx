import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export function ButtonColorful({
  className,
  label = 'Explore Components',
  children,
  ...props
}: ButtonColorfulProps) {
  return (
    <button
      type="button"
      className={cn(
        'group relative inline-flex items-center justify-center gap-2',
        'h-10 px-5 rounded-full overflow-hidden',
        'bg-zinc-900 dark:bg-zinc-100',
        'text-sm font-medium',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900/40',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:translate-y-px',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
          'opacity-40 group-hover:opacity-80',
          'blur transition-opacity duration-500',
        )}
      />
      <span className="relative flex items-center gap-2 text-white dark:text-zinc-900">
        <span>{children ?? label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-90" />
      </span>
    </button>
  )
}
