import { useEffect, useRef } from 'react'
import { hero } from '../data/content'

const MAX_TILT = 8

export default function PortraitOrb() {
  const orbRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const el = orbRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    function onMove(e) {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = (e.clientX - cx) / (rect.width / 2)
      const ny = (e.clientY - cy) / (rect.height / 2)
      targetX = Math.max(-1, Math.min(1, nx)) * MAX_TILT
      targetY = Math.max(-1, Math.min(1, ny)) * -MAX_TILT
    }

    function onLeave() {
      targetX = 0
      targetY = 0
    }

    function tick() {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      el.style.transform = `perspective(900px) rotateX(${currentY}deg) rotateY(${currentX}deg)`
      frameRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    frameRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={orbRef}
      className="relative mx-auto aspect-square w-[min(72vw,340px)] will-change-transform sm:w-[380px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Rotating teal–violet ring */}
      <div
        className="animate-spin-slow ring-gradient absolute inset-0 rounded-full p-[3px]"
        aria-hidden="true"
        style={{
          filter: 'drop-shadow(0 0 18px rgba(46, 230, 214, 0.35))',
        }}
      >
        <div className="h-full w-full rounded-full bg-bg" />
      </div>

      {/* Portrait */}
      <div className="absolute inset-[10px] overflow-hidden rounded-full bg-surface">
        <img
          src={hero.portrait.src}
          alt={hero.portrait.alt}
          width={380}
          height={380}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            const fallback = e.currentTarget.nextElementSibling
            if (fallback) fallback.hidden = false
          }}
        />
        <div
          hidden
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#12141c] to-[#1a1530] font-serif text-5xl italic text-silver-bright"
          aria-hidden="true"
        >
          DJ
        </div>
      </div>

      {/* Orbiting tech chips */}
      <ul className="absolute inset-0 list-none p-0" aria-label="Core technologies">
        {hero.chips.map((chip, i) => {
          const start = `${(360 / hero.chips.length) * i}deg`
          return (
            <li
              key={chip.id}
              className="animate-orbit absolute top-1/2 left-1/2"
              style={{
                '--orbit-start': start,
                '--orbit-radius': 'min(42vw, 210px)',
                marginLeft: '-1.4rem',
                marginTop: '-1.4rem',
              }}
            >
              <span className="font-mono inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0c0e14]/90 text-[11px] font-medium tracking-wide text-silver shadow-[0_0_0_1px_rgba(124,92,255,0.25)] backdrop-blur-sm">
                {chip.label}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
