import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { useMotionPrefs } from '../hooks/useMotionPrefs'

/**
 * Spring-following square outline rendered in a single fixed layer.
 * transform-only updates via MotionValues (never React state per mousemove).
 * Rendered only on pointer:fine and when motion is not reduced.
 */
export default function CursorCompanion() {
  const { reduced, canHover, isCoarse } = useMotionPrefs()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 200, damping: 24 })
  const springY = useSpring(y, { stiffness: 200, damping: 24 })
  const [overInteractive, setOverInteractive] = useState(false)

  useEffect(() => {
    if (reduced || !canHover || isCoarse) return

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target
      const interactive = target?.closest?.('a, button, [role="button"], input, textarea, select')
      setOverInteractive(Boolean(interactive))
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, canHover, isCoarse, x, y])

  if (reduced || !canHover || isCoarse) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-none border-[3px] border-ink dark:border-ink-dark bg-accent/20"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: overInteractive ? 48 : 28,
        height: overInteractive ? 48 : 28,
        opacity: overInteractive ? 1 : 0.5,
      }}
      transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
    />
  )
}