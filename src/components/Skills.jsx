import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Code2, Database, Server, Wrench, ChevronDown } from 'lucide-react'
import { skills } from '../data/portfolio'
import Page from './Page'
import SectionHeading from './SectionHeading'

const categoryIcons = {
  Frontend: Code2,
  Backend: Server,
  Database: Database,
  'DevOps & Tools': Wrench,
}

// All drawers open by default
const DEFAULT_OPEN = new Set(['Frontend', 'Backend', 'Database', 'DevOps & Tools'])

function Drawer({ category, isOpen, onToggle }) {
  const reduced = useReducedMotion()
  const Icon = categoryIcons[category.category] || Code2
  const panelId = `drawer-${category.category.replace(/[^a-z]/gi, '-').toLowerCase()}`

  return (
    <div className="rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark shadow-[var(--shadow-brut)] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group w-full flex items-center gap-3 px-5 py-4 text-left focus-ring relative"
      >
        {/* Left accent stripe grows on open/hover */}
        <span
          aria-hidden="true"
          className={`absolute left-0 top-0 bottom-0 bg-accent dark:bg-accent-dark transition-all duration-200 ${isOpen ? 'w-2' : 'w-1 group-hover:w-2'}`}
        />
        <Icon
          size={18}
          strokeWidth={2.5}
          className="text-ink dark:text-ink-dark ml-2"
        />
        <span className="font-display font-black uppercase text-[length:var(--text-h3)] text-ink dark:text-ink-dark flex-1">
          {category.category}
        </span>
        <span className="font-mono font-bold text-[var(--text-micro)] text-muted dark:text-muted-dark tabular-nums">
          ({category.items.length})
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          className={`text-ink dark:text-ink-dark transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={reduced ? { height: 'auto' } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { height: 'auto' } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 px-5 pb-5 border-t-[3px] border-ink dark:border-ink-dark pt-5">
              {category.items.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduced ? 0 : i * 0.04, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="px-3 py-1.5 rounded-none font-mono font-bold text-xs uppercase border-[3px] border-ink dark:border-ink-dark text-ink dark:text-ink-dark bg-surface dark:bg-surface-dark"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Skills() {
  const [openSet, setOpenSet] = useState(() => new Set(DEFAULT_OPEN))

  const toggle = (category) => {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <Page>
      <SectionHeading numeral="03" label="Skills" title="Tech stack" />

      <div className="grid sm:grid-cols-2 gap-5">
        {skills.map((category) => (
          <Drawer
            key={category.category}
            category={category}
            isOpen={openSet.has(category.category)}
            onToggle={() => toggle(category.category)}
          />
        ))}
      </div>
    </Page>
  )
}