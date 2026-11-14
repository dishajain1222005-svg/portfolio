import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { projects, scenes } from '../data/content'

const DURATION        = 1.1
const ZOOM_OUT        = 2.4
const ZOOM_IN_FROM    = 0.6
const BLUR            = 14
const ADVANCE_COOLDOWN = 400   // ms minimum between transitions
const SAFETY_TIMEOUT  = 2000   // ms — unlock if GSAP never completes

// ─── Whoosh ───────────────────────────────────────────────────────────────────
function playWhoosh(muted) {
  if (muted) return
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const bufSize = ctx.sampleRate * 0.18
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource(); src.buffer = buf
    const hpf = ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 900
    const lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 4000
    lpf.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.14)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
    src.connect(hpf); hpf.connect(lpf); lpf.connect(gain); gain.connect(ctx.destination)
    src.start(); src.onended = () => ctx.close()
  } catch { /* noop */ }
}

// ─── Hash helpers ─────────────────────────────────────────────────────────────
export function hashToSceneIndex(hash) {
  const raw = (hash || '').replace(/^#/, '').toLowerCase()
  if (!raw || raw === 'hero') return 0
  const base = raw.split('/')[0]
  const idx = scenes.findIndex((s) => s.hash === base)
  return idx >= 0 ? idx : 0
}

export function getProjectSlugFromHash(hash) {
  const raw = (hash || '').replace(/^#/, '').toLowerCase()
  if (!raw.startsWith('projects')) return null
  return raw.split('/')[1] || null
}

export function projectHash(projectIdOrSlug) {
  const item = projects.items.find((p) => p.id === projectIdOrSlug || p.slug === projectIdOrSlug)
  const slug = item?.slug ?? projects.items[0]?.slug ?? 'campusconnect'
  return `#projects/${slug}`
}

function indexToHash(index) {
  const scene = scenes[index]
  if (!scene || scene.id === 'hero') return '#hero'
  return `#${scene.hash}`
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function createStreaks(originX, originY) {
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:45;'
  for (let i = 0; i < 10; i++) {
    const streak = document.createElement('div')
    const angle = (360 / 10) * i + (Math.random() * 18 - 9)
    const len = 80 + Math.random() * 140
    streak.style.cssText = `position:absolute;left:${originX}px;top:${originY}px;width:${len}px;height:2px;transform-origin:0 50%;transform:rotate(${angle}deg) scaleX(0);background:linear-gradient(90deg,rgba(124,92,255,.85),rgba(46,230,214,.35),transparent);opacity:0;border-radius:1px;filter:blur(.5px);`
    layer.appendChild(streak)
  }
  document.body.appendChild(layer)
  return layer
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useSceneTransition({ sceneRefs }) {
  const [activeIndex, setActiveIndex] = useState(() =>
    typeof window !== 'undefined' ? hashToSceneIndex(window.location.hash) : 0,
  )
  const [isTransitioning, setIsTransitioning]   = useState(false)
  const [hasAdvancedOnce, setHasAdvancedOnce]   = useState(false)
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('portfolio-muted') === 'true' } catch { return false }
  })
  const mutedRef         = useRef(muted)
  const activeIndexRef   = useRef(activeIndex)
  const transitioningRef = useRef(false)
  const tlRef            = useRef(null)
  const skipHashWrite    = useRef(false)
  const lastTransitionTs = useRef(0)
  const safetyTimerRef   = useRef(null)

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev; mutedRef.current = next
      try { localStorage.setItem('portfolio-muted', String(next)) } catch { /* noop */ }
      return next
    })
  }, [])

  useEffect(() => { activeIndexRef.current = activeIndex }, [activeIndex])

  const focusSceneHeading = useCallback((index) => {
    // Do NOT focus the heading element — it causes the purple outline (bug 6).
    // Just make the scene shell itself receive focus for screen-reader context.
    requestAnimationFrame(() => {
      const root = sceneRefs.current[index]
      if (root instanceof HTMLElement) root.focus({ preventScroll: true })
    })
  }, [sceneRefs])

  const syncHash = useCallback((index) => {
    const scene = scenes[index]
    const current = (window.location.hash || '').replace(/^#/, '').toLowerCase()
    if (scene?.id === 'projects' && current.split('/')[0] === 'projects') return
    const next = indexToHash(index)
    if (window.location.hash === next || (index === 0 && (!window.location.hash || window.location.hash === '#'))) return
    skipHashWrite.current = true
    window.history.replaceState(null, '', next)
    queueMicrotask(() => { skipHashWrite.current = false })
  }, [])

  const unlock = useCallback((toIndex, toEl, fromEl, contentTargets) => {
    clearTimeout(safetyTimerRef.current)
    gsap.set(fromEl, { clearProps: 'opacity,scale,filter,transform' })
    fromEl.style.visibility = 'hidden'
    fromEl.style.pointerEvents = 'none'
    fromEl.setAttribute('aria-hidden', 'true')
    toEl.style.pointerEvents = 'auto'
    gsap.set(toEl, { clearProps: 'opacity,scale,filter,transform' })
    if (contentTargets?.length) gsap.set(contentTargets, { clearProps: 'opacity,transform' })
    activeIndexRef.current = toIndex
    setActiveIndex(toIndex)
    setHasAdvancedOnce(true)
    syncHash(toIndex)
    transitioningRef.current = false
    setIsTransitioning(false)
    focusSceneHeading(toIndex)
  }, [focusSceneHeading, syncHash])

  const runTransition = useCallback(
    (toIndex, { reverse = false, originX, originY } = {}) => {
      if (transitioningRef.current) return
      if (toIndex < 0 || toIndex >= scenes.length) return
      if (toIndex === activeIndexRef.current) return
      const now = Date.now()
      if (now - lastTransitionTs.current < ADVANCE_COOLDOWN) return
      lastTransitionTs.current = now

      const fromIndex = activeIndexRef.current
      const fromEl = sceneRefs.current[fromIndex]
      const toEl   = sceneRefs.current[toIndex]
      if (!fromEl || !toEl) return

      transitioningRef.current = true
      setIsTransitioning(true)
      tlRef.current?.kill()
      playWhoosh(mutedRef.current)

      const reduced = prefersReducedMotion()
      const ox = typeof originX === 'number' ? originX : window.innerWidth / 2
      const oy = typeof originY === 'number' ? originY : window.innerHeight / 2

      toEl.style.visibility = 'visible'
      toEl.style.pointerEvents = 'none'
      toEl.setAttribute('aria-hidden', 'false')
      fromEl.style.pointerEvents = 'none'

      const contentTargets = toEl.querySelectorAll('[data-scene-content] > *')

      // Safety timeout — always unlock even if GSAP stalls or is interrupted
      safetyTimerRef.current = setTimeout(() => {
        if (transitioningRef.current) unlock(toIndex, toEl, fromEl, contentTargets)
      }, SAFETY_TIMEOUT)

      const finish = () => unlock(toIndex, toEl, fromEl, contentTargets)

      if (reduced) {
        gsap.set(toEl, { opacity: 0 }); gsap.set(fromEl, { opacity: 1 })
        const tl = gsap.timeline({ onComplete: finish, onInterrupt: finish })
        tl.to(fromEl, { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 0)
          .to(toEl,   { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 0)
        tlRef.current = tl; return
      }

      const fromScale = reverse ? ZOOM_IN_FROM : ZOOM_OUT
      const toStartScale = reverse ? ZOOM_OUT : ZOOM_IN_FROM

      gsap.set(fromEl, { transformOrigin: `${ox}px ${oy}px`, scale: 1, opacity: 1, filter: 'blur(0px)' })
      gsap.set(toEl,   { transformOrigin: '50% 50%', scale: toStartScale, opacity: 0, filter: `blur(${BLUR}px)` })
      if (contentTargets.length) gsap.set(contentTargets, { opacity: 0, y: reverse ? -16 : 20 })

      let streakLayer = null
      if (!reverse) {
        streakLayer = createStreaks(ox, oy)
        gsap.set(streakLayer.children, { opacity: 0, scaleX: 0 })
      }

      const half = DURATION * 0.48
      const tl = gsap.timeline({
        onComplete:  () => { streakLayer?.remove(); finish() },
        onInterrupt: () => { streakLayer?.remove(); finish() },
      })

      tl.to(fromEl, { scale: fromScale, opacity: 0, filter: `blur(${BLUR}px)`, duration: half, ease: 'power2.in' }, 0)

      if (streakLayer) {
        tl.to(streakLayer.children, { opacity: 1, scaleX: 1, duration: half * 0.85, stagger: 0.03, ease: 'power2.out' }, 0.05)
          .to(streakLayer.children, { opacity: 0, duration: 0.2, ease: 'power1.in' }, half * 0.7)
      }

      tl.to(toEl, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: DURATION - half * 0.35, ease: 'power2.out' }, half * 0.55)

      if (contentTargets.length) {
        tl.to(contentTargets, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, half * 0.75)
      }

      tlRef.current = tl
    },
    [sceneRefs, unlock],
  )

  const goTo   = useCallback((index, opts = {}) => runTransition(index, opts), [runTransition])
  const goNext = useCallback((opts = {}) => {
    const next = activeIndexRef.current + 1
    if (next < scenes.length) runTransition(next, { ...opts, reverse: false })
    else runTransition(0, { ...opts, reverse: false })          // Contact → Hero loop
  }, [runTransition])
  const goPrev = useCallback((opts = {}) => {
    const prev = activeIndexRef.current - 1
    if (prev >= 0) runTransition(prev, { ...opts, reverse: true })
  }, [runTransition])

  // Initial layout
  useEffect(() => {
    const index = hashToSceneIndex(window.location.hash)
    activeIndexRef.current = index
    setActiveIndex(index)
    sceneRefs.current.forEach((el, i) => {
      if (!el) return
      const active = i === index
      el.style.visibility  = active ? 'visible' : 'hidden'
      el.style.pointerEvents = active ? 'auto' : 'none'
      el.setAttribute('aria-hidden', active ? 'false' : 'true')
      gsap.set(el, { opacity: 1, scale: 1, filter: 'blur(0px)' })
    })
    syncHash(index)
  }, [sceneRefs, syncHash])

  // Hash back/forward
  useEffect(() => {
    const onHash = () => {
      if (skipHashWrite.current) return
      const index = hashToSceneIndex(window.location.hash)
      if (index === activeIndexRef.current) return
      runTransition(index, { reverse: index < activeIndexRef.current })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [runTransition])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (transitioningRef.current) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return

      if (e.key === 'Escape' || e.key === 'Backspace') { e.preventDefault(); goPrev(); return }

      const onProjects = scenes[activeIndexRef.current]?.id === 'projects'
      const isArrow = ['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)
      if (onProjects && isArrow) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext(); return }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goPrev(); return }

      if (e.key === 'Enter' || e.key === ' ') {
        const interactive = e.target instanceof HTMLElement &&
          (e.target.closest('a,button,[role="button"]') || e.target.matches('a,button,[role="button"]'))
        if (interactive) return
        e.preventDefault(); goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useEffect(() => () => { tlRef.current?.kill(); clearTimeout(safetyTimerRef.current) }, [])

  return {
    activeIndex, activeScene: scenes[activeIndex],
    isTransitioning, hasAdvancedOnce,
    scenes, goTo, goNext, goPrev,
    muted, toggleMute,
  }
}
