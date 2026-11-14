import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { hero, site } from '../data/content'
import PortraitOrb from './PortraitOrb'

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const roleRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const id = window.setInterval(() => setRoleIndex((i) => (i + 1) % hero.roles.length), 3200)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const el = roleRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { el.textContent = hero.roles[roleIndex]; return }
    const tl = gsap.timeline()
    tl.to(el, { y: -10, opacity: 0, duration: 0.25, ease: 'power2.in' })
      .add(() => { el.textContent = hero.roles[roleIndex] })
      .fromTo(el, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' })
    return () => tl.kill()
  }, [roleIndex])

  return (
    <div
      aria-labelledby="hero-heading"
      className="relative z-10 flex min-h-full flex-col items-center justify-center px-5 py-24 text-center sm:px-8 lg:px-12"
    >
      {/* Giant headline behind everything */}
      <h1
        id="hero-heading"
        data-scene-heading
        className="pointer-events-none absolute top-[8%] left-1/2 z-0 w-[min(100%,1100px)] -translate-x-1/2 select-none text-center font-black leading-[0.9] tracking-[-0.04em]"
        style={{
          fontSize: 'clamp(3.5rem,14vw,9.5rem)',
          background: 'linear-gradient(135deg,#c4b5fd 0%,#ffffff 40%,#a78bfa 70%,#ede9fe 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
        aria-label={`Hi, I'm ${site.name.split(' ')[0]}`}
      >
        {hero.headline}
      </h1>

      {/* Portrait orb */}
      <div className="relative z-10 mt-[clamp(4rem,12vh,7rem)]">
        <PortraitOrb />
      </div>

      {/* Text block */}
      <div className="relative z-10 mt-8 max-w-xl">
        <p
          className="font-mono mb-3 uppercase tracking-[0.2em]"
          style={{ fontSize: 12, color: '#A78BFA' }}
        >
          {site.name}
        </p>

        <p className="mb-4" style={{ fontSize: 'clamp(17px,2.4vw,22px)', color: '#E9D5FF' }}>
          <span style={{ color: '#B9B0E0' }}>I am </span>
          <span
            ref={roleRef}
            className="font-bold italic"
            style={{ color: '#fff' }}
            aria-live="polite"
          >
            {hero.roles[0]}
          </span>
        </p>

        <p
          className="mb-8 leading-relaxed"
          style={{ fontSize: 16, color: '#B9B0E0' }}
        >
          {hero.intro}
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent('Hello from your portfolio')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-5 font-bold text-white transition focus-visible:outline-offset-4"
            style={{ fontSize: 15, border: '1px solid rgba(167,139,250,0.5)', background: 'rgba(124,92,255,0.18)' }}
          >
            {hero.cta.email}
          </a>
        </div>

        {/* Social links */}
        <nav className="mt-6 flex items-center justify-center gap-6" aria-label="Social links">
          <a
            href={site.github} target="_blank" rel="noopener noreferrer"
            className="font-mono underline-offset-4 transition hover:underline focus-visible:outline-offset-4"
            style={{ fontSize: 13, color: '#B9B0E0' }}
          >
            {hero.links.github}<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={site.linkedin} target="_blank" rel="noopener noreferrer"
            className="font-mono underline-offset-4 transition hover:underline focus-visible:outline-offset-4"
            style={{ fontSize: 13, color: '#B9B0E0' }}
          >
            {hero.links.linkedin}<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </div>
  )
}
