import { motion } from 'framer-motion'
import { FolderGit2, ExternalLink, Star } from 'lucide-react'
import { projects } from '../data/portfolio'
import { useScrollReveal } from '../hooks/useScrollReveal'

const techColors = {
  Laravel: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  MySQL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Blade: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Bootstrap: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Tailwind: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  PHP: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  React: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Express: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300',
  JavaScript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Vue: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Node.js': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  TypeScript: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Dart: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  Flutter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
}

export default function Projects() {
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
          <FolderGit2 size={14} />
          Projects
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Featured Work</h2>
        <p className="text-light-muted dark:text-dark-muted mt-3 max-w-md mx-auto">
          Some projects I've built and contributed to
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <motion.a
            key={project.title}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -6 }}
            className="group block p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
          >
            {/* Image Placeholder */}
            <div className="w-full h-36 rounded-xl mb-4 bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/5 flex items-center justify-center overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FolderGit2
                  size={40}
                  className="text-accent/30 dark:text-accent/20"
                />
              )}
            </div>

            {/* Title + Stars */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-light-text dark:text-dark-text group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-light-muted dark:text-dark-muted flex-shrink-0">
                <ExternalLink size={12} />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    techColors[tech] || 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
