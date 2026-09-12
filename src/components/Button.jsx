import { useReducedMotion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { cn } from '../lib/cn'

/**
 * Neobrutalist button variants.
 * - primary: accent fill, black text, hard offset shadow that grows on hover
 * - outline: paper fill with heavy ink border
 * - ghost:  text-only until hovered, then solid secondary fill
 */
export default function Button({
  children,
  variant = 'primary',
  icon: Icon,
  href,
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  const reduced = useReducedMotion()

  const base =
    'relative inline-flex items-center gap-2 px-6 py-3 rounded-none border-[3px] font-body font-bold uppercase tracking-wider text-sm ' +
    'transition-all duration-150 focus-ring disabled:opacity-40 disabled:cursor-not-allowed'

  const push = reduced
    ? ''
    : 'hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0'

  const variants = {
    primary: cn(
      'border-ink dark:border-ink-dark bg-accent text-black shadow-[var(--shadow-brut)]',
      push,
      'hover:bg-accent-hover hover:shadow-[var(--shadow-brut-lg)] active:shadow-none'
    ),
    outline: cn(
      'border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark shadow-[var(--shadow-brut)]',
      push,
      'hover:bg-secondary hover:text-black hover:shadow-[var(--shadow-brut-lg)] active:shadow-none'
    ),
    ghost:
      'border-transparent text-ink dark:text-ink-dark hover:bg-secondary hover:text-black hover:border-ink dark:hover:border-ink-dark',
  }

  const Tag = href ? 'a' : 'button'
  const isDisabled = disabled || loading

  return (
    <Tag
      href={href}
      className={cn(base, variants[variant], className)}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon size={16} aria-hidden="true" />
      )}
      {children}
    </Tag>
  )
}