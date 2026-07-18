import { FolderGit2, ExternalLink } from 'lucide-react'
import { projects, techColors } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import SectionWrapper from './SectionWrapper'
import Card from './Card'

export default function Projects() {
  return (
    <SectionWrapper>
      <SectionHeader
        icon={FolderGit2}
        label="Projects"
        title="Featured Work"
        subtitle="Some projects I've built and contributed to"
      />

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <Card
            key={project.title}
            as="a"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            whileHover={{ y: -6 }}
          >
            {/* Image */}
            <div className="w-full h-36 rounded-xl mb-4 bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/5 flex items-center justify-center overflow-hidden">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/5">
                  <span className="text-accent/40 font-bold text-lg text-center px-2">
                    {project.title}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
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
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
