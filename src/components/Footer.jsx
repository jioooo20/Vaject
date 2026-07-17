import { Heart } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-light-border dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-light-muted dark:text-dark-muted">
            Built using React + Tailwind + Framer Motion
          </div>
          <div className="text-sm text-light-muted dark:text-dark-muted">
            &copy; {year} Giovano Alkandri. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
