import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'

/**
 * 4px accent rule pinned to the nav's bottom edge.
 * Hidden entirely under reduced motion (purely decorative).
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-[4px] bg-accent dark:bg-accent-dark origin-left"
      style={{ scaleX }}
    />
  )
}