import ProjectVisual from './ProjectVisual'

/**
 * Active project detail panel — visual, copy, facts, links, prev/next.
 */
export default function ProjectDetail({
  project,
  reduced,
  animKey,
  featuredLabel,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
}) {
  return (
    <div
      id={`project-panel-${project.id}`}
      role="tabpanel"
      aria-labelledby={`project-tab-${project.id}`}
      className="project-detail relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg"
    >
      <div
        key={animKey}
        className={`project-detail-inner flex h-full min-h-0 flex-col ${
          reduced ? '' : 'project-detail-enter'
        }`}
      >
        <div className="project-detail-visual relative mb-3 h-[40%] min-h-[120px] shrink-0 overflow-hidden rounded-md border border-white/10 lg:mb-4">
          <ProjectVisual project={project} />
          {project.featured && (
            <span className="font-mono absolute top-2 right-2 rounded border border-violet/40 bg-bg/70 px-2 py-0.5 text-[10px] tracking-[0.14em] text-violet uppercase backdrop-blur-sm">
              {featuredLabel}
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
          <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[clamp(1.25rem,2.4vw,1.65rem)] font-semibold tracking-[-0.02em] text-silver-bright">
              {project.title}
            </h3>
          </div>
          <p className="mb-2 text-[16px] text-silver">{project.tagline}</p>
          <p className="mb-3 text-[16px] leading-relaxed text-muted lg:mb-4">
            {project.detail}
          </p>

          <ul className="mb-3 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono rounded-md border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[12px] tracking-wide text-silver"
              >
                {tag}
              </li>
            ))}
          </ul>

          <ul
            className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3"
            aria-label="Key facts"
          >
            {project.facts.map((fact) => (
              <li
                key={fact}
                className="rounded-md border border-white/10 bg-bg/40 px-2.5 py-2 text-[13px] leading-snug text-silver-bright sm:text-[14px]"
              >
                {fact}
              </li>
            ))}
          </ul>

          <div className="mb-4 flex flex-wrap gap-2">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-3 text-[14px] text-silver-bright transition hover:border-violet/50 hover:text-white focus-visible:outline-offset-4"
            >
              GitHub
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-md bg-violet/90 px-3 text-[14px] font-medium text-white transition hover:brightness-110 focus-visible:outline-offset-4"
              >
                Live site
              </a>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border border-white/12 px-3 text-[13px] text-silver transition hover:border-violet/40 hover:text-white focus-visible:outline-offset-4"
              aria-label={prevLabel}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Prev</span>
            </button>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border border-white/12 px-3 text-[13px] text-silver transition hover:border-violet/40 hover:text-white focus-visible:outline-offset-4"
              aria-label={nextLabel}
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
