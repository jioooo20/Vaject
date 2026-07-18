import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function SectionHeader({ icon: Icon, label, title, subtitle }) {
  const { ref, isInView, hidden, visible } = useScrollReveal('up', 0, 40)

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={isInView ? visible : hidden}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light/50 dark:bg-accent/10 text-accent text-sm font-medium mb-4">
        {Icon && <Icon size={14} />}
        {label}
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold">{title}</h2>
      {subtitle && (
        <p className="text-light-muted dark:text-dark-muted mt-3 max-w-md mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
