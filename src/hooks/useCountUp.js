import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

/**
 * Counts a numeric value up from 0 when the element enters the viewport.
 * Writes to a ref'd element to avoid React re-renders per frame.
 * Respects prefers-reduced-motion by rendering the final value immediately.
 */
export function useCountUp(target, { duration = 900 } = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()
  const value = useMotionValue(0)
  const spring = useSpring(value, { duration, bounce: 0 })

  useEffect(() => {
    if (!ref.current) return
    if (reduced) {
      ref.current.textContent = String(target)
      return
    }
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = String(Math.round(latest))
    })
    return unsubscribe
  }, [spring, target, reduced])

  useEffect(() => {
    if (isInView && !reduced) value.set(target)
  }, [isInView, value, target, reduced])

  return ref
}