import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { experiences } from '../data/portfolio'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Experience() {
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
          <Briefcase size={14} />
          Experience
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Where I've Worked</h2>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-3xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-light-border dark:bg-dark-border md:-translate-x-px" />

        {experiences.map((exp, idx) => {
          const isLeft = idx % 2 === 0

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative mb-10 md:mb-16 ${
                isLeft ? 'md:pr-12 md:text-right md:ml-0' : 'md:pl-12 md:ml-auto'
              } md:w-1/2 pl-8 md:pl-0`}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute top-1 w-3.5 h-3.5 rounded-full border-2 border-accent bg-light-surface dark:bg-dark-surface ${
                  isLeft
                    ? 'md:right-0 md:translate-x-1/2'
                    : 'md:left-0 md:-translate-x-1/2'
                } -left-[7px] md:left-auto`}
              />

              {/* Card */}
              <div className="p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent/30 transition-all duration-300">
                <div className="flex items-center gap-2 text-accent text-xs font-medium mb-2">
                  <Calendar size={12} />
                  {exp.period}
                  <span className="px-2 py-0.5 rounded-full bg-accent-light/50 dark:bg-accent/10 text-accent text-[10px] font-medium">
                    {exp.type}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  {exp.role}
                </h3>

                <div className="flex items-center gap-2 text-sm text-light-muted dark:text-dark-muted mt-1 mb-3">
                  <MapPin size={12} />
                  {exp.company} — {exp.location}
                </div>

                <ul className={`space-y-1.5 ${isLeft ? 'md:text-right' : ''}`}>
                  {exp.descriptions.map((desc, i) => (
                    <li
                      key={i}
                      className="text-sm text-light-muted dark:text-dark-muted leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-accent mt-1 flex-shrink-0">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
