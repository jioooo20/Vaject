import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowUp } from 'lucide-react'

/**
 * Back-to-top — hard-edged accent square with offset shadow.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-none border-[3px] border-ink dark:border-ink-dark bg-accent text-black shadow-[var(--shadow-brut)] hover:shadow-[var(--shadow-brut-lg)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 focus-ring"
          aria-label="Back to top"
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}