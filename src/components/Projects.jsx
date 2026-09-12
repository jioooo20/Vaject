import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, FolderGit2 } from 'lucide-react'
import { projects } from '../data/portfolio'
import Page from './Page'
import SectionHeading from './SectionHeading'
import FilterBar from './FilterBar'
import ProjectFrame from './ProjectFrame'

const filterOptions = ['All', 'Laravel', 'React', 'Node/DevOps']

function getFilterKey(project) {
  const tech = project.tech.join(' ')
  if (tech.includes('Laravel') || tech.includes('PHP') || tech.includes('Blade')) return 'Laravel'
  if (tech.includes('React') || tech.includes('Vue')) return 'React'
  return 'Node/DevOps'
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [progress, setProgress] = useState(0)
  const stripRef = useRef(null)
  const reduced = useReducedMotion()

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => getFilterKey(p) === activeFilter)

  // rAF-throttled passive scroll listener for the progress rule
  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = el.scrollWidth - el.clientWidth
        setProgress(max > 0 ? el.scrollLeft / max : 0)
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [filtered.length])

  // Reset scroll on filter change
  useEffect(() => {
    stripRef.current?.scrollTo({ left: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [activeFilter, reduced])

  const scrollByFrame = useCallback((dir) => {
    const el = stripRef.current
    if (!el) return
    const amount = dir * Math.min(el.clientWidth * 0.8, 380)
    el.scrollBy({ left: amount, behavior: reduced ? 'auto' : 'smooth' })
  }, [reduced])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByFrame(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByFrame(-1) }
    else if (e.key === 'Home') { e.preventDefault(); stripRef.current?.scrollTo({ left: 0 }) }
    else if (e.key === 'End') {
      e.preventDefault()
      const el = stripRef.current
      if (el) el.scrollTo({ left: el.scrollWidth })
    }
  }

  return (
    <Page width="wide">
      <SectionHeading numeral="05" label={`Projects · ${projects.length} frames`} title="Selected work" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterBar options={filterOptions} active={activeFilter} onChange={setActiveFilter} />
        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => scrollByFrame(-1)}
            className="p-2 rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark hover:bg-secondary hover:text-black transition-colors focus-ring"
            aria-label="Scroll gallery left"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollByFrame(1)}
            className="p-2 rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark hover:bg-secondary hover:text-black transition-colors focus-ring"
            aria-label="Scroll gallery right"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="bg-paper dark:bg-paper-dark border-[3px] border-ink dark:border-ink-dark p-8 text-center shadow-[var(--shadow-brut)] max-w-sm">
            <FolderGit2 size={28} strokeWidth={2.5} className="mx-auto text-ink dark:text-ink-dark mb-3" />
            <p className="font-mono font-bold text-[var(--text-mono)] uppercase text-muted dark:text-muted-dark">
              No projects in this drawer yet.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Filmstrip region — keyboard scrollable */}
          <div
            ref={stripRef}
            role="region"
            aria-label="Project gallery"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="filmstrip flex gap-6 overflow-x-auto pb-6 focus-ring"
            style={{
              scrollSnapType: reduced ? 'none' : 'x mandatory',
              touchAction: 'pan-x pan-y',
            }}
          >
            {filtered.map((project) => (
              <ProjectFrame key={project.title} project={project} />
            ))}
          </div>

          {/* Progress rule */}
          <div className="mt-2 h-3 w-full border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark relative" aria-hidden="true">
            <div
              className="absolute inset-y-0 left-0 bg-accent dark:bg-accent-dark transition-[width] duration-100"
              style={{ width: `${Math.max(progress * 100, 4)}%` }}
            />
          </div>
        </>
      )}
    </Page>
  )
}