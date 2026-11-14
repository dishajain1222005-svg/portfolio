import { forwardRef } from 'react'

/**
 * Full-viewport scene wrapper. Only the active scene receives pointer events.
 */
const SceneShell = forwardRef(function SceneShell(
  {
    id,
    label,
    children,
    className = '',
    showBack = false,
    onBack,
    initiallyActive = false,
  },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      data-scene={id}
      aria-label={label}
      aria-hidden={initiallyActive ? 'false' : 'true'}
      tabIndex={-1}
      className={`scene-shell absolute inset-0 overflow-x-hidden outline-none ${
        className.includes('overflow-hidden')
          ? ''
          : 'overflow-y-auto'
      } ${className}`}
      style={{
        visibility: initiallyActive ? 'visible' : 'hidden',
        pointerEvents: initiallyActive ? 'auto' : 'none',
      }}
    >
      {showBack && (
        <button
          type="button"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            onBack?.({
              originX: rect.left + rect.width / 2,
              originY: rect.top + rect.height / 2,
            })
          }}
          className="absolute top-[4.75rem] left-4 z-20 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/10 bg-surface/80 text-silver-bright backdrop-blur-sm transition hover:border-violet/40 hover:text-white focus-visible:outline-offset-4 sm:left-6"
          aria-label="Go back to previous scene"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <div data-scene-content className="relative z-10 min-h-full h-full">
        {children}
      </div>
    </section>
  )
})

export default SceneShell
