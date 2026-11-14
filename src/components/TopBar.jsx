import { useEffect, useId, useState } from 'react'
import { site } from '../data/content'

/** Four-point sparkle icon */
function Sparkle({ size = 18 }) {
  const h = size / 2, q = size / 4.5
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <path d={`M${h},0 Q${h + q},${h} ${h},${size} Q${h - q},${h} ${h},0`} fill="#A78BFA"/>
      <path d={`M0,${h} Q${h},${h + q} ${size},${h} Q${h},${h - q} 0,${h}`} fill="#A78BFA"/>
    </svg>
  )
}

/** Paper-plane icon for Contact me button */
function PaperPlane() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

export default function TopBar({
  scenes,
  activeIndex,
  onNavigate,
  onContact,
  isTransitioning,
  muted,
  onToggleMute,
  showBack = false,
  onBack,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const progress = `${activeIndex + 1} / ${scenes.length}`

  useEffect(() => { setMenuOpen(false) }, [activeIndex])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); setMenuOpen(false) }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [menuOpen])

  function handleNav(index, e) {
    if (isTransitioning) return
    const rect = e.currentTarget.getBoundingClientRect()
    onNavigate(index, {
      originX: rect.left + rect.width / 2,
      originY: rect.top + rect.height / 2,
      reverse: index < activeIndex,
    })
    setMenuOpen(false)
  }

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      style={{
        height: 66,
        borderBottom: '1px solid rgba(167,139,250,0.25)',
        background: 'transparent',
      }}
    >
      <div className="pointer-events-auto flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">

        {/* Back arrow — only when not on hero */}
        {showBack && (
          <button
            type="button"
            disabled={isTransitioning}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              onBack?.({ originX: rect.left + rect.width / 2, originY: rect.top + rect.height / 2 })
            }}
            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full transition focus-visible:outline-offset-4"
            style={{ border: '1px solid rgba(167,139,250,0.35)', color: '#A78BFA' }}
            aria-label="Go back to previous scene"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* Logo — sparkle + name */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNav(0, e) }}
          className="flex shrink-0 items-center gap-2 no-underline focus-visible:outline-offset-4"
          style={{ letterSpacing: '0.04em' }}
        >
          <Sparkle size={18} />
          <span className="text-[14px] font-bold text-white tracking-[0.04em] uppercase">
            {site.name}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="ml-4 hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Scenes">
          {scenes.map((scene, i) => {
            const active = i === activeIndex
            return (
              <button
                key={scene.id}
                type="button"
                disabled={isTransitioning}
                onClick={(e) => handleNav(i, e)}
                aria-current={active ? 'true' : undefined}
                className="rounded-full px-3.5 py-1.5 text-[15px] font-medium transition focus-visible:outline-offset-2"
                style={active ? {
                  color: '#fff',
                  border: '1px solid rgba(167,139,250,0.7)',
                  background: 'rgba(124,92,255,0.18)',
                } : {
                  color: '#B9B0E0',
                  border: '1px solid transparent',
                  background: 'transparent',
                }}
              >
                {scene.label}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {/* Scene counter pill */}
          <div
            className="hidden font-mono text-[13px] tabular-nums sm:flex items-center px-3 py-1 rounded-full"
            style={{ border: '1px solid rgba(167,139,250,0.4)', color: '#B9B0E0' }}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="sr-only">Scene </span>{progress}
          </div>

          {/* Mute toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full transition focus-visible:outline-offset-4"
            style={{ border: '1px solid rgba(167,139,250,0.3)', color: '#B9B0E0' }}
            aria-label={muted ? 'Unmute' : 'Mute'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>

          {/* Contact me — violet gradient pill with paper-plane icon */}
          <button
            type="button"
            disabled={isTransitioning}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              onContact({ originX: rect.left + rect.width / 2, originY: rect.top + rect.height / 2 })
            }}
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[14px] font-bold text-white transition focus-visible:outline-offset-4"
            style={{
              background: 'linear-gradient(135deg, #7C5CFF 0%, #A78BFA 100%)',
              boxShadow: '0 0 18px rgba(124,92,255,0.4)',
            }}
          >
            <PaperPlane />
            Contact me
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full lg:hidden focus-visible:outline-offset-4"
            style={{ border: '1px solid rgba(167,139,250,0.35)', color: '#B9B0E0' }}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(o => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {menuOpen
                ? <path d="M6 6l12 12M18 6L6 18"/>
                : <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id={menuId}
          className="pointer-events-auto px-4 py-4 backdrop-blur-xl lg:hidden"
          style={{
            background: 'rgba(18,10,51,0.97)',
            borderBottom: '1px solid rgba(167,139,250,0.2)',
          }}
        >
          <nav className="flex flex-col gap-1" aria-label="Scenes mobile">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                type="button"
                disabled={isTransitioning}
                onClick={(e) => handleNav(i, e)}
                aria-current={i === activeIndex ? 'true' : undefined}
                className="rounded-xl px-4 py-3 text-left text-[15px] font-medium transition"
                style={i === activeIndex
                  ? { background: 'rgba(124,92,255,0.2)', color: '#fff', border: '1px solid rgba(167,139,250,0.4)' }
                  : { color: '#B9B0E0', border: '1px solid transparent' }}
              >
                {scene.label}
              </button>
            ))}
            <button
              type="button"
              disabled={isTransitioning}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                onContact({ originX: rect.left + rect.width / 2, originY: rect.top + rect.height / 2 })
                setMenuOpen(false)
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#7C5CFF,#A78BFA)', boxShadow: '0 0 18px rgba(124,92,255,0.4)' }}
            >
              <PaperPlane /> Contact me
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
