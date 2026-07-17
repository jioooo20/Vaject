import { useMotionValue, useSpring, useInView } from 'framer-motion'
import { useRef } from 'react'

export function useScrollReveal(direction = 'up', delay = 0, distance = 60) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  const hidden = { opacity: 0, ...directionMap[direction] }

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }

  return { ref, isInView, hidden, visible }
}
