/**
 * Shared section shell — applies the spec's --gutter and --space-section rhythm.
 * Replaces the ad-hoc px/py duplication in every section component.
 */
export default function Page({ children, className = '', width = 'default' }) {
  const widths = {
    default: 'max-w-6xl',
    wide: 'max-w-7xl',
    narrow: 'max-w-3xl',
  }

  return (
    <div
      className={`${widths[width]} mx-auto py-[var(--space-section)] ${className}`}
      style={{ paddingInline: 'var(--gutter)' }}
    >
      {children}
    </div>
  )
}