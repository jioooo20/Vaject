import { motion } from 'framer-motion'
import { User, Code, Coffee, Layers } from 'lucide-react'
import { personalData } from '../data/portfolio'
import { useScrollReveal } from '../hooks/useScrollReveal'

const stats = [
  { icon: Code, label: 'Projects', value: '6+' },
  { icon: Layers, label: 'Technologies', value: '15+' },
  { icon: Coffee, label: 'Experience', value: '2+ Years' },
]

export default function About() {
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
          <User size={14} />
          About Me
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Get to Know Me</h2>
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:col-span-2 flex justify-center"
        >
          <div className="relative w-56 h-56 sm:w-64 sm:h-64">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 rotate-6" />
            <div className="absolute inset-0 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border overflow-hidden -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
                <img
                  src={`/images/profpic.webp`}
                  alt={personalData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="lg:col-span-3 space-y-4"
        >
          {personalData.bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-light-muted dark:text-dark-muted leading-relaxed"
            >
              {paragraph}
            </p>
          ))}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-center hover:border-accent/30 transition-colors duration-200"
              >
                <stat.icon
                  size={20}
                  className="mx-auto mb-2 text-accent"
                />
                <div className="text-xl font-bold text-light-text dark:text-dark-text">
                  {stat.value}
                </div>
                <div className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
