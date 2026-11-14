/**
 * Orb — the core white glowing circle used in Experience, Projects, and Skills.
 *
 * Props:
 *   size       — CSS width/height value (clamp string)
 *   featured   — boolean; 8% larger glow + slightly larger default
 *   dimmed     — boolean; 25% opacity when another orb is open
 *   bursting   — boolean; hides the orb during burst animation
 *   float      — { duration, delay } for the idle float animation
 *   onClick    — called on click (after stopPropagation on pointerup)
 *   onPointerUp — stop-propagation handler passed from parent
 *   innerRef   — ref forwarded to the button element
 *   ariaLabel  — accessible label
 *   ariaExpanded — aria-expanded state
 *   children   — content (icon + title + description)
 */
export default function Orb({
  size,
  featured = false,
  dimmed = false,
  bursting = false,
  float,
  onClick,
  onPointerUp,
  innerRef,
  ariaLabel,
  ariaExpanded,
  children,
  className = '',
}) {
  const baseGlow = featured
    ? '0 0 80px rgba(139,92,246,0.65), 0 0 160px rgba(124,92,255,0.35), inset 0 0 50px rgba(255,255,255,0.65)'
    : '0 0 60px rgba(139,92,246,0.55), 0 0 140px rgba(124,92,255,0.30), inset 0 0 40px rgba(255,255,255,0.55)'

  return (
    <button
      ref={innerRef}
      type="button"
      onClick={onClick}
      onPointerUp={onPointerUp}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      className={`orb bubble-anchor absolute rounded-full cursor-pointer
        focus-visible:outline-none
        transition-opacity duration-300
        ${dimmed ? 'opacity-25 pointer-events-none' : 'opacity-100'}
        ${className}`}
      style={{
        width:  size,
        height: size,
        transform: 'translate(-50%,-50%)',
        /* Orb fill — spec §5 */
        background: 'radial-gradient(circle at 35% 25%, #FFFFFF 0%, #EFE8FF 30%, #CDBBFF 70%, #A98BFF 100%)',
        border: '1.5px solid rgba(255,255,255,0.80)',
        boxShadow: baseGlow,
        /* Float animation */
        animationName: float ? 'bubble-float' : 'none',
        animationDuration: float ? `${float.duration}s` : undefined,
        animationDelay: float ? `${-float.delay}s` : undefined,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
        opacity: bursting ? 0 : undefined,
      }}
    >
      {/* Highlight crescent — top-left inside the orb */}
      <span
        className="pointer-events-none absolute rounded-full"
        aria-hidden="true"
        style={{
          top: '8%',
          left: '10%',
          width: '42%',
          height: '32%',
          background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Content */}
      <span className="relative flex h-full w-full flex-col items-center justify-center gap-1 px-4 text-center select-none">
        {children}
      </span>
    </button>
  )
}

/** Icon slot inside an Orb — 44–50 px, violet #4A2FD0, stroke 2.5 */
export function OrbIcon({ children }) {
  return (
    <span
      className="mb-0.5 flex shrink-0 items-center justify-center"
      aria-hidden="true"
      style={{
        width: 'clamp(36px,5vmin,50px)',
        height: 'clamp(36px,5vmin,50px)',
        color: '#4A2FD0',
        filter: 'drop-shadow(0 0 4px rgba(74,47,208,0.5))',
      }}
    >
      {children}
    </span>
  )
}

/** Title slot inside an Orb — bold, #1B0F45 */
export function OrbTitle({ children, featured }) {
  return (
    <span
      className="font-bold leading-tight"
      style={{
        fontSize: featured ? 'clamp(17px,2.2vmin,26px)' : 'clamp(14px,1.9vmin,22px)',
        color: '#1B0F45',
        maxWidth: '90%',
      }}
    >
      {children}
    </span>
  )
}

/** Description slot inside an Orb — medium weight, #3D2C75 */
export function OrbDesc({ children }) {
  return (
    <span
      className="font-medium leading-snug"
      style={{
        fontSize: 'clamp(11px,1.3vmin,15px)',
        color: '#3D2C75',
        maxWidth: '88%',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {children}
    </span>
  )
}
