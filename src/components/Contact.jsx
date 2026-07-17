import { motion } from 'framer-motion'
import { Mail, ExternalLink, Download, Send, Globe, Code2 } from 'lucide-react'
import { personalData } from '../data/portfolio'
import { useScrollReveal } from '../hooks/useScrollReveal'

const contactLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: personalData.email,
    href: `mailto:${personalData.email}`,
  },
  {
    icon: Globe,
    label: 'LinkedIn',
    value: 'Giovano Alkandri',
    href: personalData.linkedin,
  },
  {
    icon: Code2,
    label: 'GitHub',
    value: '@jioooo20',
    href: personalData.github,
  },
]

export default function Contact() {
  const { ref, isInView, hidden, visible } = useScrollReveal('up', 0, 40)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      {/* Section Header */}
      <motion.div
        ref={ref}
        initial={hidden}
        animate={isInView ? visible : hidden}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light/50 dark:bg-accent/10 text-accent text-sm font-medium mb-4">
          <Send size={14} />
          Contact
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Get in Touch</h2>
        <p className="text-light-muted dark:text-dark-muted mt-3 max-w-md mx-auto">
          Have a question, project idea, or just want to say hi? Let's connect.
        </p>
      </motion.div>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
        {contactLinks.map((link, idx) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.label !== 'Email' ? '_blank' : undefined}
            rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-accent-light/50 dark:bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
              <link.icon size={22} className="text-accent" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-light-text dark:text-dark-text">
                {link.value}
              </div>
              <div className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {link.label}
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Download CV */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex justify-center"
      >
        <a
          href={personalData.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40"
        >
          <Download size={16} />
          Download CV / Resume
        </a>
      </motion.div>
    </div>
  )
}
