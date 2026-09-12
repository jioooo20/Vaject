import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Calendar, MapPin, ChevronDown } from 'lucide-react'
import { experiences } from '../data/portfolio'
import Page from './Page'
import SectionHeading from './SectionHeading'

function IndexCard({ exp, index }) {
  const [expanded, setExpanded] = useState(false)
  const reduced = useReducedMotion()
  const isCurrent = index === 0

  const toggle = () => setExpanded((v) => !v)
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ alignSelf: 'start' }}
    >
      <div
        className="relative rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark p-6 shadow-[var(--shadow-brut)] cursor-pointer focus-ring transition-shadow duration-200 hover:shadow-[var(--shadow-brut-lg)]"
        onClick={toggle}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        {/* Current stamp */}
        {isCurrent && (
          <span className="absolute -top-3 right-4 inline-block px-2 py-0.5 border-[3px] border-ink dark:border-ink-dark bg-secondary text-black font-mono text-[10px] font-black uppercase tracking-widest">
            Current
          </span>
        )}

        <div className="flex items-center gap-2 font-mono font-bold text-[var(--text-mono)] text-accent dark:text-accent-dark mb-2">
          <Calendar size={12} aria-hidden="true" />
          {exp.period}
        </div>

        <h3 className="font-display font-black uppercase text-[length:var(--text-h2)] text-ink dark:text-ink-dark">
          {exp.role}
        </h3>

        <div className="flex items-center gap-2 font-body font-medium text-[var(--text-body-sm)] text-muted dark:text-muted-dark mt-1 mb-3">
          <MapPin size={12} aria-hidden="true" />
          {exp.company} — {exp.location}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={reduced ? { height: 'auto' } : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? { height: 'auto' } : { height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 pt-4 border-t-[3px] border-ink dark:border-ink-dark">
                {exp.descriptions.map((desc, i) => (
                  <li key={i} className="flex items-start gap-2.5 font-body font-medium text-[var(--text-body-sm)] text-muted dark:text-muted-dark leading-relaxed">
                    <span className="mt-[6px] w-2 h-2 shrink-0 bg-accent border border-ink dark:border-ink-dark" aria-hidden="true" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1 mt-4 text-ink dark:text-ink-dark">
          <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
          <span className="font-mono font-bold text-xs uppercase tracking-wider">{expanded ? 'Collapse' : 'Read more'}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <Page>
      <SectionHeading numeral="04" label={`Experience · ${experiences.length} pins`} title="Track record" />

      <div className="relative border-[3px] border-ink dark:border-ink-dark bg-surface dark:bg-surface-dark p-6 sm:p-10">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {experiences.map((exp, idx) => (
            <IndexCard key={idx} exp={exp} index={idx} />
          ))}
        </div>
      </div>
    </Page>
  )
}