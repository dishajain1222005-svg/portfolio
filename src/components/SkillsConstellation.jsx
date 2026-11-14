import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 36
const LINK_DIST = 100
const SPEED = 0.18

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Lightweight violet particle constellation for the Skills scene only.
 * Decorative; parent should keep aria-hidden.
 */
export default function SkillsConstellation({ className = '' }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let particles = []
    let reduced = prefersReducedMotion()
    let running = true

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => {
      reduced = media.matches
    }
    media.addEventListener('change', onMotionChange)

    function resize() {
      const parent = canvas.parentElement
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent?.clientWidth || window.innerWidth
      height = parent?.clientHeight || window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function seed() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      }))
    }

    function paintFrame() {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        if (!reduced) {
          a.x += a.vx
          a.y += a.vy
          if (a.x < 0 || a.x > width) a.vx *= -1
          if (a.y < 0 || a.y > height) a.vy *= -1
        }

        ctx.beginPath()
        ctx.arc(a.x, a.y, 1.35, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(124, 92, 255, 0.42)'
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.22
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(124, 92, 255, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    function draw() {
      if (!running) return
      paintFrame()
      if (reduced) return
      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    seed()
    paintFrame()
    if (!reduced) {
      rafRef.current = requestAnimationFrame(draw)
    }

    const onResize = () => {
      resize()
      if (particles.length === 0) seed()
      // Keep particles in bounds after resize
      for (const p of particles) {
        p.x = Math.min(Math.max(p.x, 0), width)
        p.y = Math.min(Math.max(p.y, 0), height)
      }
      if (reduced) paintFrame()
    }

    window.addEventListener('resize', onResize)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      media.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  )
}
