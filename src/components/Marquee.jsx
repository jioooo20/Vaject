import { useReducedMotion } from 'motion/react'

/**
 * Infinite mono ticker above the footer — solid secondary band, black text.
 * Under reduced motion renders as a single static centered line.
 */
export default function Marquee({ items }) {
  const reduced = useReducedMotion()
  const text = items.join('  ·  ') + '  ·  '

  if (reduced) {
    return (
      <div className="border-b-[3px] border-ink dark:border-ink-dark bg-secondary py-3 overflow-hidden">
        <p className="text-center font-mono font-black text-[var(--text-mono)] uppercase text-black">
          {items.join(' · ')}
        </p>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="border-b-[3px] border-ink dark:border-ink-dark bg-secondary py-3 overflow-hidden select-none"
    >
      <div className="marquee-track font-mono font-black text-[var(--text-mono)] uppercase text-black">
        <span className="px-2">{text}</span>
        <span className="px-2">{text}</span>
      </div>
    </div>
  )
}