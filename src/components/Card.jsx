import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = true, as = 'div', ...props }) {
  const Component = as === 'a' ? motion.a : motion.div

  return (
    <Component
      className={`p-6 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        hover ? 'hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
