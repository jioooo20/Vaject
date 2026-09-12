import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react'
import { ArrowRight, Mail } from 'lucide-react'
import { personalData } from '../data/portfolio'
import Button from './Button'
import { useMotionPrefs } from '../hooks/useMotionPrefs'

const EASE_SETTLE = [0.16, 1, 0.3, 1]

export default function Hero() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()
  const { canHover } = useMotionPrefs()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0])

  // Portrait tilt (fine pointer only)
  const tiltX = useSpring(0, { stiffness: 120, damping: 18 })
  const tiltY = useSpring(0, { stiffness: 120, damping: 18 })

  const handlePointer = (e) => {
    if (reduced || !canHover) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    tiltY.set(px * 6)
    tiltX.set(-py * 6)
  }

  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el)
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const container = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
  }
  const item = {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_SETTLE } },
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-paper dark:bg-paper-dark border-b-[3px] border-ink dark:border-ink-dark"
    >
      {/* Hard-edged accent blocks */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-24 -left-16 w-64 h-64 bg-secondary border-[3px] border-ink dark:border-ink-dark" />
        <div className="absolute bottom-24 -right-20 w-80 h-80 bg-accent border-[3px] border-ink dark:border-ink-dark" />
      </div>

      <div className="max-w-6xl mx-auto w-full pt-28 pb-20" style={{ paddingInline: 'var(--gutter)' }}>
        <motion.div variants={container} initial="hidden" animate="visible" className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Headline — poster block, cols 1–8 */}
          <motion.div style={reduced ? undefined : { y: headlineY, opacity: fade }} className="lg:col-span-8 lg:pr-10">
            <motion.p variants={item} className="inline-block font-mono font-bold text-[var(--text-mono)] uppercase tracking-[0.2em] bg-secondary text-black border-[3px] border-ink dark:border-ink-dark px-3 py-1 mb-6">
              01 — Portfolio
            </motion.p>

            <motion.h1
              variants={item}
              className="font-display font-black uppercase text-ink dark:text-ink-dark"
              style={{ fontSize: 'var(--text-display)', lineHeight: 'var(--text-display--line-height)', letterSpacing: 'var(--text-display--letter-spacing)' }}
            >
              FULLSTACK
              <br />
              ENGINEER ⁄
            </motion.h1>

            {/* Heavy accent rule */}
            <motion.div
              variants={item}
              aria-hidden="true"
              className="h-2 w-56 bg-accent border-[3px] border-ink dark:border-ink-dark my-6"
            />

            <motion.p variants={item} className="font-display font-bold uppercase text-[length:var(--text-h2)] text-ink dark:text-ink-dark mb-6">
              {personalData.name}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3 mb-8 font-mono font-bold text-[var(--text-mono)] text-ink dark:text-ink-dark">
              <span className="px-3 py-1 border-[3px] border-ink dark:border-ink-dark bg-surface dark:bg-surface-dark">2+ years</span>
              <span className="px-3 py-1 border-[3px] border-ink dark:border-ink-dark bg-surface dark:bg-surface-dark">6 shipped</span>
              <span className="px-3 py-1 border-[3px] border-ink dark:border-ink-dark bg-surface dark:bg-surface-dark">ID · GMT+7</span>
            </motion.div>

            <motion.p variants={item} className="font-body font-medium text-[length:var(--text-body)] text-muted dark:text-muted-dark mb-10" style={{ maxWidth: 'var(--measure-tight)' }}>
              {personalData.tagline}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Button onClick={() => scrollTo('projects')} icon={ArrowRight}>View work</Button>
              <Button variant="outline" href={`mailto:${personalData.email}`} icon={Mail}>Say hello</Button>
            </motion.div>
          </motion.div>

          {/* Portrait — cols 8–12 */}
          <motion.div
            variants={item}
            className="lg:col-span-4 relative"
            style={reduced ? undefined : { y: portraitY }}
            onPointerMove={handlePointer}
            onPointerLeave={resetTilt}
          >
            <motion.div
              className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-full lg:h-[420px] mx-auto lg:mx-0 overflow-hidden border-[3px] border-ink dark:border-ink-dark shadow-[var(--shadow-brut-lg)] bg-accent"
              style={reduced || !canHover ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 800 }}
            >
              <img
                src="/images/profpic.webp"
                alt={personalData.name}
                width={800}
                height={1000}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={() => scrollTo('about')}
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.6, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark hover:bg-accent hover:text-black transition-colors focus-ring"
        aria-label="Scroll to about section"
      >
        <motion.svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M10 4 L10 16 M10 16 L5 11 M10 16 L15 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.button>
    </section>
  )
}