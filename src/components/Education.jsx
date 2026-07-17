import { motion } from 'framer-motion'
import { GraduationCap, Calendar } from 'lucide-react'
import { education } from '../data/portfolio'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Education() {
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
          <GraduationCap size={14} />
          Education
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Academic Background</h2>
      </motion.div>

      {/* Education Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {education.map((edu, idx) => (
          <motion.div
            key={edu.school}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent/30 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="p-3 rounded-xl bg-accent-light/50 dark:bg-accent/10 flex-shrink-0">
                <GraduationCap size={22} className="text-accent" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Period */}
                <div className="flex items-center gap-1.5 text-xs text-accent font-medium mb-1.5">
                  <Calendar size={11} />
                  {edu.period}
                </div>

                {/* School */}
                <h3 className="font-semibold text-light-text dark:text-dark-text">
                  {edu.school}
                </h3>

                {/* Degree */}
                <p className="text-sm text-accent font-medium mt-0.5 mb-2">
                  {edu.degree}
                </p>

                {/* Description */}
                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
