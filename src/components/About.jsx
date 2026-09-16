import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { personalData } from '../data/portfolio'
import Page from './Page'
import SectionHeading from './SectionHeading'
import { useCountUp } from '../hooks/useCountUp'

const stats = [
  { label: 'Projects', value: 6, suffix: '+' },
  { label: 'Technologies', value: 15, suffix: '+' },
  { label: 'Years', value: 2, suffix: '+' },
]

function StatCounter({ value, suffix, label }) {
  const ref = useCountUp(value)
  return (
    <>
      <div className="font-display font-black text-[length:var(--text-h2)] text-ink dark:text-ink-dark tabular-nums">
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <div className="font-mono font-bold text-[var(--text-micro)] uppercase tracking-[0.14em] text-muted dark:text-muted-dark mt-1">
        {label}
      </div>
    </>
  )
}

export default function About() {
  const portraitRef = useRef(null)
  const inView = useInView(portraitRef, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <Page>
      <SectionHeading numeral="02" label="About" title="The operator" />

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Portrait — framed block */}
        <motion.div
          ref={portraitRef}
          className="lg:col-span-4 relative mx-auto w-56 sm:w-64"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-paper dark:bg-paper-dark border-[3px] border-ink dark:border-ink-dark shadow-[var(--shadow-brut-lg)]">
            <img
              src="/images/profpic.webp"
              alt={personalData.name}
              width={600}
              height={700}
              loading="lazy"
              decoding="async"
              className="w-full aspect-[6/7] object-cover border-b-[3px] border-ink dark:border-ink-dark"
            />
            <p className="px-3 py-2.5 text-center font-mono font-bold text-[var(--text-micro)] uppercase tracking-widest text-black bg-secondary">
              based in Malang
            </p>
          </div>
        </motion.div>

        {/* Bio */}
        <div className="lg:col-span-8 space-y-5">
          {personalData.bio.map((paragraph, i) => (
            <motion.p
              key={i}
              className={`font-body text-[length:var(--text-body)] ${
                i === 0
                  ? 'font-bold text-ink dark:text-ink-dark'
                  : 'font-medium text-muted dark:text-muted-dark'
              }`}
              style={{ maxWidth: 'var(--measure)' }}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {paragraph}
            </motion.p>
          ))}

          <div className="flex flex-wrap gap-5 pt-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="border-[3px] border-ink dark:border-ink-dark bg-surface dark:bg-surface-dark px-5 py-4 shadow-[var(--shadow-brut)]"
              >
                <StatCounter {...s} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}