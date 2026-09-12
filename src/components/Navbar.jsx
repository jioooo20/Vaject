import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/portfolio'
import ThemeToggle from './ThemeToggle'
import ScrollProgress from './ScrollProgress'

const mark = (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" fill="var(--color-accent)" stroke="currentColor" strokeWidth="3" />
  </svg>
)

function NavLink({ link, active }) {
  return (
    <a
      href={link.href}
      className={`font-body font-bold uppercase tracking-wide text-xs px-2.5 py-1.5 border-[3px] rounded-none transition-colors duration-150 focus-ring ${
        active
          ? 'border-ink dark:border-ink-dark bg-secondary text-black'
          : 'border-transparent text-ink dark:text-ink-dark hover:border-ink dark:hover:border-ink-dark'
      }`}
      aria-current={active ? 'true' : undefined}
    >
      {link.name}
    </a>
  )
}

export default function Navbar({ activeSection }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)

  // Focus trap + inert while mobile menu is open
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return
    if (open) {
      main.setAttribute('inert', '')
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
      document.addEventListener('keydown', onKey)
      return () => {
        main.removeAttribute('inert')
        document.removeEventListener('keydown', onKey)
      }
    }
    main.removeAttribute('inert')
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[9998] bg-paper dark:bg-paper-dark border-b-[3px] border-ink dark:border-ink-dark"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto" style={{ paddingInline: 'var(--gutter)' }}>
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2.5 focus-ring rounded-none" aria-label="Vaject home">
            <span className="text-ink dark:text-ink-dark">{mark}</span>
            <span className="font-display font-black uppercase text-lg text-ink dark:text-ink-dark">
              Vaject
            </span>
          </a>

          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => (
              <NavLink key={link.name} link={link} active={activeSection === link.href.slice(1)} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={toggleRef}
              onClick={() => (open ? closeMenu() : setOpen(true))}
              className="md:hidden p-2 rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark hover:bg-secondary hover:text-black transition-colors focus-ring"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
            </button>
          </div>
        </div>
      </div>

      <ScrollProgress />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-paper dark:bg-paper-dark border-b-[3px] border-ink dark:border-ink-dark"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="block font-body font-bold uppercase tracking-wide text-sm text-ink dark:text-ink-dark border-[3px] border-ink dark:border-ink-dark px-3 py-2 hover:bg-secondary hover:text-black transition-colors focus-ring"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}