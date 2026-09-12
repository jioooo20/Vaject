import { motion, useReducedMotion } from 'motion/react'
import { ExternalLink, Code2 } from 'lucide-react'

/**
 * A single filmstrip slide. Fixed 440px height prevents CLS.
 * Hover/focus shifts the frame into its hard offset shadow.
 */
export default function ProjectFrame({ project }) {
  const reduced = useReducedMotion()

  return (
    <motion.a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative shrink-0 snap-start rounded-none border-[3px] border-ink dark:border-ink-dark bg-paper dark:bg-paper-dark overflow-hidden shadow-[var(--shadow-brut)] focus-ring"
      style={{ width: 'min(78vw, 340px)', height: 440 }}
      whileHover={reduced ? undefined : { x: -4, y: -4 }}
      transition={{ duration: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
      aria-label={`${project.title} — open repository`}
    >
      {/* Image / placeholder — explicit dimensions reserve space (no CLS) */}
      <div className="relative w-full aspect-[3/2] overflow-hidden bg-surface dark:bg-surface-dark border-b-[3px] border-ink dark:border-ink-dark">
        <span className="absolute inset-0 z-0 flex items-center justify-center font-display font-black uppercase text-accent dark:text-accent-dark text-lg px-3 text-center">
          {project.title}
        </span>
        <img
          src={project.image}
          alt=""
          width={600}
          height={400}
          loading="lazy"
          decoding="async"
          className="relative z-10 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>

      <div className="p-5">
        <h3 className="font-display font-black uppercase text-[length:var(--text-h2)] text-ink dark:text-ink-dark mb-2 inline-flex items-center gap-1.5">
          {project.title}
          <ExternalLink size={14} className="text-accent dark:text-accent-dark opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="font-body font-medium text-[var(--text-body-sm)] text-muted dark:text-muted-dark leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Caption bar — slides up on hover, static under reduced motion */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-wrap gap-1.5 p-4 bg-secondary border-t-[3px] border-ink dark:border-ink-dark transition-transform duration-300 ${
          reduced ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0'
        }`}
      >
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded-none font-mono font-bold text-[var(--text-micro)] uppercase border-[3px] border-ink text-black bg-paper"
          >
            {tech}
          </span>
        ))}
        <Code2 size={14} className="ml-auto text-black self-center" />
      </div>
    </motion.a>
  )
}