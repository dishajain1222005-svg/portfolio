import { useEffect, useRef } from 'react'
import CampusConnectVisual from './CampusConnectVisual'

function trapFocus(el) {
  const sel = 'button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'
  const handler = (e) => {
    if (e.key !== 'Tab') return
    const all = [...el.querySelectorAll(sel)]
    const first = all[0]; const last = all[all.length - 1]
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus() } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first?.focus() } }
  }
  el.addEventListener('keydown', handler)
  return () => el.removeEventListener('keydown', handler)
}

export default function ProjectPanel({ project, onClose, closeBtnRef }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const el = panelRef.current; if (!el) return
    return trapFocus(el)
  }, [])

  const Visual = () => {
    if (project.visual === 'wifi') return <CampusConnectVisual />
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#12141c,#1a1530,#0c0e14)' }}>
        <span className="pointer-events-none select-none font-serif italic text-[clamp(4rem,14vw,7rem)] leading-none text-white/[0.07]">
          {project.monogram}
        </span>
      </div>
    )
  }

  return (
    /* Backdrop — data-interactive so SceneManager's hit-test skips it,
       but onPointerUp stops propagation so it doesn't double-trigger the
       SceneManager's advance-on-empty. Clicking the backdrop closes the panel. */
    <div
      data-interactive
      className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(7,8,12,0.80)', backdropFilter: 'blur(6px)' }}
      onPointerUp={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose() }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        data-interactive
        className="project-panel relative flex max-h-[80vh] w-full max-w-[min(720px,92vw)] flex-col overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(155deg,color-mix(in srgb,#7c5cff 10%,#0e1016),#0e1016 42%)',
          border: '1px solid color-mix(in srgb,#7c5cff 40%,transparent)',
          boxShadow: '0 0 60px color-mix(in srgb,#7c5cff 20%,transparent)',
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        {/* Visual header */}
        <div className="relative h-[180px] shrink-0 overflow-hidden rounded-t-2xl sm:h-[220px]">
          <Visual />
          {project.featured && (
            <span className="font-mono absolute top-3 right-3 rounded border border-violet/40 bg-bg/70 px-2 py-0.5 text-[10px] tracking-[0.14em] text-violet uppercase backdrop-blur-sm">
              Featured
            </span>
          )}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-bg/70 px-3 py-1.5 text-[13px] text-silver-bright backdrop-blur-sm transition hover:border-violet/50 hover:text-white focus-visible:outline-offset-4"
            aria-label="Back to bubbles"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <h3 className="mb-1 text-[clamp(1.3rem,2.8vw,1.75rem)] font-semibold tracking-[-0.02em] text-silver-bright">
            {project.title}
          </h3>
          <p className="mb-3 text-[16px] text-silver">{project.tagline}</p>
          <p className="mb-4 text-[16px] leading-relaxed text-muted">{project.detail}</p>

          <ul className="mb-4 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.tags.map((tag) => (
              <li key={tag} className="font-mono rounded-md border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[12px] tracking-wide text-silver">
                {tag}
              </li>
            ))}
          </ul>

          <ul className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Key facts">
            {project.facts.map((fact) => (
              <li key={fact} className="rounded-md border border-white/10 bg-bg/40 px-3 py-2 text-[14px] leading-snug text-silver-bright">
                {fact}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-4 text-[14px] text-silver-bright transition hover:border-violet/50 hover:text-white focus-visible:outline-offset-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-md bg-violet px-4 text-[14px] font-medium text-white transition hover:brightness-110 focus-visible:outline-offset-4">
                Live site
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
