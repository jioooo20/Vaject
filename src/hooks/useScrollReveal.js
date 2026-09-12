import { useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

export function useScrollReveal(direction = 'up', delay = 0, distance = 60) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    clip: {},
  }

  if (prefersReducedMotion) {
    return {
      ref,
      isInView: true,
      hidden: { opacity: 1, x: 0, y: 0, clipPath: 'none' },
      visible: { opacity: 1, x: 0, y: 0, clipPath: 'none' },
    }
  }

  const hidden = { opacity: 0, ...directionMap[direction] }

  if (direction === 'clip') {
    hidden.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)'
    hidden.opacity = 1
  }

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    transition: {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }

  return { ref, isInView, hidden, visible }
}