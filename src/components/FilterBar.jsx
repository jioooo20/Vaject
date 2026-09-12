/**
 * Project category filter — hard-edged toggles, active uses solid ink fill.
 */
export default function FilterBar({ options, active, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className="flex flex-wrap gap-2 mb-8"
    >
      {options.map((filter) => {
        const isActive = active === filter
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            aria-pressed={isActive}
            className={`px-4 py-1.5 rounded-none border-[3px] border-ink dark:border-ink-dark font-body font-bold uppercase tracking-wide text-xs transition-colors duration-150 focus-ring ${
              isActive
                ? 'bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark'
                : 'bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark hover:bg-secondary hover:text-black'
            }`}
          >
            {filter}
          </button>
        )
      })}
    </div>
  )
}