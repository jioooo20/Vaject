import { motion } from 'framer-motion'
import { ArrowDown, Download, ExternalLink } from 'lucide-react'
import { personalData } from '../data/portfolio'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export default function Hero() {
  const handleScroll = () => {
    const el = document.getElementById('projects')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 dark:bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
        >
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.p
              variants={itemVariants}
              className="text-accent font-medium text-sm sm:text-base tracking-wider uppercase mb-4"
            >
              Hello, I'm
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-accent via-accent-hover to-accent bg-clip-text text-transparent">
                {personalData.name}
              </span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-accent-light/50 dark:bg-accent/10 text-accent font-medium text-sm sm:text-base">
                {personalData.role}
              </span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-light-muted dark:text-dark-muted text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-4"
            >
              {personalData.tagline}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-light-muted dark:text-dark-muted text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Building scalable backends, crafting clean APIs, and learning to secure them all.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={handleScroll}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40"
              >
                View Projects
                <ExternalLink size={16} />
              </button>

              <a
                href={`mailto:${personalData.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-all duration-200"
              >
                Contact Me
              </a>

              <a
                href={personalData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted font-medium hover:text-light-text dark:hover:text-dark-text hover:border-accent/50 transition-all duration-200"
              >
                <Download size={16} />
                Resume
              </a>
            </motion.div>
          </div>

          {/* Avatar / Illustration */}
          <motion.div
            variants={itemVariants}
            className="flex-shrink-0"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-accent/20 dark:border-accent/10 animate-[spin_20s_linear_infinite]" style={{ borderTopColor: '#14b8a6' }} />
              <div className="absolute inset-4 rounded-full border-2 border-accent/10 dark:border-accent/5 animate-[spin_15s_linear_infinite_reverse]" style={{ borderBottomColor: '#0d9488' }} />

              {/* Avatar placeholder */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 dark:from-accent/15 dark:to-accent/5 flex items-center justify-center overflow-hidden">
                <img
                  src={`/images/profpic.webp`}
                  alt={personalData.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={handleScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-light-muted dark:text-dark-muted hover:text-accent transition-colors duration-200"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  )
}
