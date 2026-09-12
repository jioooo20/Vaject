import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

/**
 * Neobrutalist section header: boxed numeral + bold label + heavy rule + black-caps title.
 */
export default function SectionHeading({ numeral, label, title, subtitle }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className="mb-[var(--space-block)]">
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center justify-center border-[3px] border-ink dark:border-ink-dark bg-accent text-black font-mono font-black text-[var(--text-mono)] px-2 py-0.5 tabular-nums">
          {numeral}
        </span>
        <span className="font-mono font-bold text-[var(--text-micro)] uppercase tracking-[0.2em] text-ink dark:text-ink-dark">
          {label}
        </span>
        <motion.span
          aria-hidden="true"
          className="flex-1 h-[3px] bg-ink dark:bg-ink-dark origin-left"
          initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>

      <motion.h2
        className="font-display font-black uppercase text-ink dark:text-ink-dark text-[length:var(--text-h1)]"
        style={{ lineHeight: 'var(--text-h1--line-height)', letterSpacing: 'var(--text-h1--letter-spacing)' }}
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <p
          className="mt-4 font-body font-medium text-[length:var(--text-body)] text-muted dark:text-muted-dark"
          style={{ maxWidth: 'var(--measure-tight)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}