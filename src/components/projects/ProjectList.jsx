/**
 * Accessible project tab list — vertical on desktop, snap tabs on mobile.
 */
export default function ProjectList({
  items,
  activeId,
  onSelect,
  tablistRef,
  featuredLabel,
}) {
  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label="Projects"
      aria-orientation="vertical"
      className="project-tablist flex w-full gap-2 overflow-x-auto overflow-y-hidden scroll-smooth lg:max-h-full lg:flex-col lg:gap-1 lg:overflow-x-hidden lg:overflow-y-auto lg:[scroll-snap-type:none]"
    >
      {items.map((item, index) => {
        const selected = item.id === activeId
        const num = String(index + 1).padStart(2, '0')

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`project-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`project-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            data-project-id={item.id}
            onClick={() => onSelect(item.id)}
            className={`project-tab group relative flex min-h-11 shrink-0 snap-center flex-col justify-center rounded-md px-3 py-2.5 text-left transition-[transform,color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-offset-4 lg:min-h-0 lg:w-full lg:snap-align-none ${
              selected
                ? 'project-tab--active border-l-[3px] border-l-violet bg-violet/10 text-silver-bright shadow-[0_0_24px_rgba(124,92,255,0.18)]'
                : 'border-l-[3px] border-l-transparent text-muted hover:translate-x-1 hover:text-silver'
            }`}
          >
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] tracking-[0.14em] text-violet/80">
                {num}
              </span>
              <span className="text-[15px] font-medium lg:text-[16px]">
                {item.title}
              </span>
              {item.featured && (
                <span className="font-mono hidden text-[9px] tracking-[0.12em] text-violet uppercase sm:inline">
                  {featuredLabel}
                </span>
              )}
            </span>
            <span className="mt-0.5 line-clamp-1 text-[13px] text-muted group-hover:text-silver/80 lg:text-[14px]">
              {item.tagline}
            </span>
            <span className="font-mono mt-1 text-[10px] tracking-wide text-violet/70">
              {item.stackLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
