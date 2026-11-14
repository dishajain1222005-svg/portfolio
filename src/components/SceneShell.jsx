import { forwardRef } from 'react'

/**
 * Full-viewport scene wrapper.
 * Click-to-advance is handled at the SceneManager level by inspecting e.target.
 * No back button here — it lives in the TopBar.
 */
const SceneShell = forwardRef(function SceneShell(
  { id, label, children, className = '', initiallyActive = false },
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
        className.includes('overflow-hidden') ? '' : 'overflow-y-auto'
      } ${className}`}
      style={{
        visibility:    initiallyActive ? 'visible' : 'hidden',
        pointerEvents: initiallyActive ? 'auto'    : 'none',
      }}
    >
      <div data-scene-content className="relative z-10 min-h-full h-full">
        {children}
      </div>
    </section>
  )
})

export default SceneShell
