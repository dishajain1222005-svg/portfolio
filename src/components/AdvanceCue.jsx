import { useEffect, useState } from 'react'

/** Click/pointer icon */
function ClickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3H5a2 2 0 0 0-2 2v4"/>
      <path d="M9 3l4 4"/>
      <path d="M15 3h4a2 2 0 0 1 2 2v4"/>
      <path d="M15 3l-4 4"/>
      <path d="M3 9v6"/>
      <path d="M21 9v6"/>
      <path d="M3 15v2a2 2 0 0 0 2 2h4"/>
      <path d="M21 15v2a2 2 0 0 1-2 2h-4"/>
      <circle cx="12" cy="14" r="3"/>
    </svg>
  )
}

export default function AdvanceCue({ hasAdvanced, onAdvance, isContact }) {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const check = () => setIsTouch(mq.matches)
    check()
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [])

  const label = isContact
    ? (isTouch ? 'Tap anywhere to start over' : 'Click anywhere to start over')
    : (isTouch ? 'Tap anywhere to continue'   : 'Click anywhere to continue')

  return (
    <button
      type="button"
      data-advance-cue
      onPointerUp={(e) => e.stopPropagation()}
      onClick={onAdvance}
      aria-label={label}
      className={`pointer-events-auto fixed left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-full px-6 backdrop-blur-sm transition-opacity duration-500 focus-visible:outline-offset-4 ${
        hasAdvanced ? 'opacity-50' : 'animate-cue-pulse'
      }`}
      style={{
        bottom: '5vh',
        height: 56,
        minWidth: 280,
        maxWidth: 360,
        border: '1px solid rgba(124,92,255,0.55)',
        background: 'rgba(18,10,51,0.65)',
        color: '#fff',
        fontSize: 17,
        fontWeight: 500,
        justifyContent: 'center',
        boxShadow: hasAdvanced ? 'none' : '0 0 24px rgba(124,92,255,0.3)',
      }}
    >
      <span style={{ color: '#A78BFA', flexShrink: 0 }}>
        <ClickIcon />
      </span>
      {label}
    </button>
  )
}
