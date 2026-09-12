import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPrefs } from './useMotionPrefs'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initializes Lenis smooth scroll and wires it into GSAP ScrollTrigger.
 * Disabled entirely when the user prefers reduced motion.
 */
export function useSmoothScroll() {
  const { reduced } = useMotionPrefs()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Expose for anchor links
    window.__lenis = lenis

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [reduced])
}