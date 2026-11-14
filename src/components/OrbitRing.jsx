import { useEffect, useRef } from 'react'

/**
 * SVG orbit ellipse with decorative glowing dots and a travelling dot.
 * Purely decorative — pointer-events:none.
 * Hidden on mobile (<1024px) via CSS.
 */
export default function OrbitRing({ cx = '50%', cy = '51%', rx = '37%', ry = '29%' }) {
  const dotRef = useRef(null)
  const rafRef = useRef(0)
  const angleRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const dot = dotRef.current
    if (!dot) return

    const W = window.innerWidth
    const H = window.innerHeight

    // Parse rx/ry as px from % strings
    const getRx = () => parseFloat(rx) / 100 * W
    const getRy = () => parseFloat(ry) / 100 * H
    const getCx = () => parseFloat(cx) / 100 * W
    const getCy = () => parseFloat(cy) / 100 * H

    const SPEED = (2 * Math.PI) / (30 * 60) // full loop in 30 s at 60 fps

    function tick() {
      angleRef.current += SPEED
      const a = angleRef.current
      const x = getCx() + getRx() * Math.cos(a)
      const y = getCy() + getRy() * Math.sin(a)
      dot.setAttribute('cx', x)
      dot.setAttribute('cy', y)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [cx, cy, rx, ry])

  // Static decorative dots at fixed angles on the ring
  const DOT_ANGLES = [0, 55, 110, 170, 220, 285, 330].map(d => d * Math.PI / 180)

  return (
    <svg
      className="orbit-ring pointer-events-none absolute inset-0 h-full w-full hidden lg:block"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    >
      <defs>
        <filter id="orbit-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="orbit-stroke" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#A78BFA"/>
          <stop offset="50%"  stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#6D4AFF"/>
        </linearGradient>
      </defs>

      {/* Glow duplicate (thicker, blurred) */}
      <ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill="none"
        stroke="rgba(167,139,250,0.18)"
        strokeWidth="8"
        filter="url(#orbit-glow)"
      />

      {/* Main stroke */}
      <ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill="none"
        stroke="url(#orbit-stroke)"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Static dots on the ring */}
      {DOT_ANGLES.map((angle, i) => (
        <Dot key={i} angle={angle} cx={cx} cy={cy} rx={rx} ry={ry} large={i === 0} />
      ))}

      {/* Travelling dot */}
      <circle
        ref={dotRef}
        r="5"
        fill="#A78BFA"
        filter="url(#orbit-glow)"
        opacity="0.9"
      />
    </svg>
  )
}

/** A static decorative dot rendered at a given angle on the ellipse */
function Dot({ angle, cx, cy, rx, ry, large }) {
  // Compute position in % — we use a foreignObject trick or just re-render on resize.
  // Since we can't easily do % math in SVG without JS, we position with a small inline SVG.
  // Use SVG animateTransform at a fixed position derived from percentage.
  // Simplest: render as a <use> with a transform.
  // We'll use a CSS calc approach via style.
  const x = `calc(${cx} + ${rx} * ${Math.cos(angle).toFixed(4)})`
  const y = `calc(${cy} + ${ry} * ${Math.sin(angle).toFixed(4)})`

  // For pure SVG with % we need to reference by percentages differently.
  // The cleanest way: render dots using SVG's own % positioning capability.
  // SVG cx/cy as percentage works when the viewBox is not set (uses viewport units).
  // So we can just pass the computed % directly:
  const pxCx = typeof window !== 'undefined' ? (parseFloat(cx) / 100 * window.innerWidth  + parseFloat(rx) / 100 * window.innerWidth  * Math.cos(angle)) : 0
  const pxCy = typeof window !== 'undefined' ? (parseFloat(cy) / 100 * window.innerHeight + parseFloat(ry) / 100 * window.innerHeight * Math.sin(angle)) : 0

  return (
    <circle
      cx={pxCx}
      cy={pxCy}
      r={large ? 5 : 3.5}
      fill={large ? '#E9D5FF' : '#A78BFA'}
      opacity={large ? 0.95 : 0.7}
      filter={large ? 'url(#orbit-glow)' : undefined}
    />
  )
}
