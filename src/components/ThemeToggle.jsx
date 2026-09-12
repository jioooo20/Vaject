import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

/**
 * Theme toggle — hard-edged square button inside the Navbar.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark hover:bg-secondary hover:text-black transition-colors duration-150 focus-ring"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
    </button>
  )
}