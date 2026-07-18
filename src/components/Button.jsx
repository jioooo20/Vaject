export default function Button({ children, variant = 'primary', icon: Icon, href, ...props }) {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  const variants = {
    primary:
      'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/25 hover:shadow-accent/40',
    outline:
      'border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium hover:bg-light-border/50 dark:hover:bg-dark-border/50',
    ghost:
      'border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:border-accent/50',
  }

  const Tag = href ? 'a' : 'button'

  return (
    <Tag href={href} className={`${base} ${variants[variant]}`} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </Tag>
  )
}
