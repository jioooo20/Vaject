import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Single source of truth for motion/pointer capabilities.
 * - reduced: user prefers reduced motion
 * - canHover: device supports real hover (pointer: fine + hover)
 * - isCoarse: primary pointer is coarse (touch)
 */
export function useMotionPrefs() {
  const prefersReduced = useReducedMotion()
  const [canHover, setCanHover] = useState(false)
  const [isCoarse, setIsCoarse] = useState(false)

  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const coarseMq = window.matchMedia('(pointer: coarse)')
    const update = () => {
      setCanHover(hoverMq.matches)
      setIsCoarse(coarseMq.matches)
    }
    update()
    hoverMq.addEventListener('change', update)
    coarseMq.addEventListener('change', update)
    return () => {
      hoverMq.removeEventListener('change', update)
      coarseMq.removeEventListener('change', update)
    }
  }, [])

  return { reduced: !!prefersReduced, canHover, isCoarse }
}