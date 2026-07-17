import { motion } from 'framer-motion'
import { Code2, Database, Server, Wrench } from 'lucide-react'
import { skills } from '../data/portfolio'
import { useScrollReveal } from '../hooks/useScrollReveal'

const categoryIcons = {
  Frontend: Code2,
  Backend: Server,
  Database: Database,
  'DevOps & Tools': Wrench,
}

const techColors = {
  React: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  'Laravel Blade': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  'Tailwind CSS': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  Bootstrap: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  Vue: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Laravel: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  Express: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  NestJS: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  MariaDB: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  MySQL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'SQL Server': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  PostgreSQL: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  'Linux (Debian/Ubuntu)': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  Docker: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  'Networking (Mikrotik/Cisco)': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  Git: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
}

export default function Skills() {
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
          <Code2 size={14} />
          Skills
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Tech Stack</h2>
        <p className="text-light-muted dark:text-dark-muted mt-3 max-w-md mx-auto">
          Technologies I work with on a daily basis
        </p>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((category, catIdx) => {
          const Icon = categoryIcons[category.category] || Code2
          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className="p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-light-border dark:border-dark-border">
                <div className="p-2 rounded-lg bg-accent-light/50 dark:bg-accent/10">
                  <Icon size={18} className="text-accent" />
                </div>
                <h3 className="font-semibold text-sm text-light-text dark:text-dark-text">
                  {category.category}
                </h3>
              </div>

              {/* Skills as Tags */}
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      techColors[skill] || 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
