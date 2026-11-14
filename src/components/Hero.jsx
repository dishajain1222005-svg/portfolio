import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { hero, site, scenes } from '../data/content'
import PortraitOrb from './PortraitOrb'

export default function Hero({ onEnter }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const roleRef = useRef(null)
  const nextLabel = scenes[1]?.label ?? 'About'

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % hero.roles.length)
    }, 3200)

    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const el = roleRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.textContent = hero.roles[roleIndex]
      return
    }

    const tl = gsap.timeline()
    tl.to(el, { y: -10, opacity: 0, duration: 0.25, ease: 'power2.in' })
      .add(() => {
        el.textContent = hero.roles[roleIndex]
      })
      .fromTo(
        el,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
      )

    return () => tl.kill()
  }, [roleIndex])

  function handleEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    onEnter?.({
      originX: rect.left + rect.width / 2,
      originY: rect.top + rect.height / 2,
    })
  }

  return (
    <div
      aria-labelledby="hero-heading"
      className="relative z-10 flex min-h-full flex-col justify-center px-5 py-24 sm:px-8 lg:px-12"
    >
      <h1
        id="hero-heading"
        data-scene-heading
        className="text-metallic pointer-events-none absolute top-[8%] left-1/2 z-0 w-[min(100%,1100px)] -translate-x-1/2 text-center text-[clamp(3.5rem,14vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] select-none"
        aria-label={`Hi, I'm ${site.name.split(' ')[0]}`}
      >
        {hero.headline}
      </h1>

      <div className="relative z-10 mx-auto mt-[clamp(4rem,12vh,7rem)] flex w-full max-w-5xl flex-col items-center gap-10 lg:mt-[clamp(5rem,14vh,8rem)]">
        <PortraitOrb />

        <div className="max-w-xl text-center">
          <p className="font-mono mb-3 text-[12px] tracking-[0.18em] text-violet uppercase">
            {site.name}
          </p>

          <p className="mb-4 text-[clamp(1.15rem,2.4vw,1.45rem)] text-silver-bright">
            <span className="text-muted">I am </span>
            <span
              ref={roleRef}
              className="font-serif inline-block italic"
              aria-live="polite"
            >
              {hero.roles[0]}
            </span>
          </p>

          <p className="mb-8 text-[17px] leading-relaxed text-muted">{hero.intro}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleEnter}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-violet px-5 text-[15px] font-medium text-white transition hover:brightness-110 focus-visible:outline-offset-4"
              aria-label={`Enter next scene: ${nextLabel}`}
            >
              {hero.cta.enter}
            </button>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 bg-transparent px-5 text-[15px] font-medium text-silver-bright transition hover:border-violet/50 hover:text-white focus-visible:outline-offset-4"
            >
              {hero.cta.email}
            </a>
          </div>

          <nav
            className="mt-6 flex items-center justify-center gap-5"
            aria-label="Social links"
          >
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] text-muted underline-offset-4 transition hover:text-silver-bright hover:underline"
            >
              {hero.links.github}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] text-muted underline-offset-4 transition hover:text-silver-bright hover:underline"
            >
              {hero.links.linkedin}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}
