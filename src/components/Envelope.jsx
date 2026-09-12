import { Mail, Send, Code2, Globe } from 'lucide-react'
import { personalData } from '../data/portfolio'

const rows = [
  { icon: Mail, label: 'Email', value: personalData.email, href: `mailto:${personalData.email}`, external: false },
  { icon: Globe, label: 'LinkedIn', value: 'Giovano Alkandri', href: personalData.linkedin, external: true },
  { icon: Code2, label: 'GitHub', value: '@jioooo20', href: personalData.github, external: true },
]

/**
 * Contact "letter" — hard-edged bordered panel of direct channels.
 */
export default function Envelope() {
  return (
    <div className="relative mx-auto" style={{ maxWidth: '42rem' }}>
      <div className="rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark shadow-[var(--shadow-brut-lg)] px-6 sm:px-10 py-4">
        <div className="divide-y-[3px] divide-ink dark:divide-ink-dark">
          {rows.map((row) => (
            <a
              key={row.label}
              href={row.href}
              target={row.external ? '_blank' : undefined}
              rel={row.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-4 py-4 group focus-ring rounded-none"
            >
              <span className="p-2.5 rounded-none border-[3px] border-ink dark:border-ink-dark bg-accent text-black shrink-0">
                <row.icon size={18} strokeWidth={2.5} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-mono font-bold text-[var(--text-micro)] uppercase tracking-[0.14em] text-muted dark:text-muted-dark">
                  {row.label}
                </span>
                <span className="block font-body font-bold text-[var(--text-body-sm)] text-ink dark:text-ink-dark truncate">
                  {row.value}
                </span>
              </span>
              <Send size={16} strokeWidth={2.5} className="text-ink dark:text-ink-dark opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}