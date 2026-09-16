import { GitBranch, Globe, Mail } from 'lucide-react'
import Marquee from './Marquee'

const TECH = ['REACT', 'LARAVEL', 'NESTJS', 'DOCKER', 'POSTGRES', 'LINUX']

export default function Footer() {
  const year = new Date().getFullYear()

  const socialLinks = [
    { icon: GitBranch, href: 'https://github.com/jioooo20', label: 'GitHub' },
    { icon: Globe, href: 'https://www.linkedin.com/in/giovano-alkandri-a4009b252/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:giovanoalkandri@gmail.com', label: 'Email' },
  ]

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <footer className="bg-surface dark:bg-surface-dark border-t-[3px] border-ink dark:border-ink-dark">
      <Marquee items={TECH} />
      <div className="max-w-6xl mx-auto py-12" style={{ paddingInline: 'var(--gutter)' }}>
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <a href="#home" className="flex items-center gap-2.5 focus-ring rounded-none w-fit" aria-label="Alkio home">
              <img src="/images/logos/alkio-logo-icon.png" alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
              <img src="/images/logos/alkio-name-dark-icon.png" alt="Alkio" className="h-5 w-auto object-contain dark:hidden" />
              <img src="/images/logos/alkio-name-white-icon.png" alt="" aria-hidden="true" className="hidden h-5 w-auto object-contain dark:block" />
            </a>
            <p className="font-body font-medium text-sm text-muted dark:text-muted-dark mt-3">
              Fullstack Engineer &amp; DevOps enthusiast from Indonesia.
            </p>
          </div>

          <div>
            <h4 className="font-display font-black uppercase text-sm text-ink dark:text-ink-dark mb-4">
              Navigation
            </h4>
            <nav className="space-y-2" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block font-body font-bold text-sm text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent-dark transition-colors duration-150 focus-ring rounded-none w-fit"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-display font-black uppercase text-sm text-ink dark:text-ink-dark mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-none bg-paper dark:bg-paper-dark border-[3px] border-ink dark:border-ink-dark text-ink dark:text-ink-dark hover:bg-secondary hover:text-black transition-colors duration-150 focus-ring"
                  aria-label={social.label}
                >
                  <social.icon size={16} strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-[3px] border-ink dark:border-ink-dark pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body font-medium text-xs text-muted dark:text-muted-dark">
            &copy; {year} Giovano Alkandri. All rights reserved.
          </p>
          <p className="font-body font-medium text-xs text-muted dark:text-muted-dark">
            Built with React + Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}