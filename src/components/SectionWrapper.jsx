export default function SectionWrapper({ children, className = '' }) {
  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 ${className}`}>
      {children}
    </div>
  )
}
