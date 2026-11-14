import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { projects, scenes } from '../data/content'

const DURATION = 1.1
const ZOOM_OUT = 2.4
const ZOOM_IN_FROM = 0.6
const BLUR = 14

/** Parse nested hashes like #projects/campusconnect → scene index. */
export function hashToSceneIndex(hash) {
  const raw = (hash || '').replace(/^#/, '').toLowerCase()
  if (!raw || raw === 'hero') return 0
  const base = raw.split('/')[0]
  const idx = scenes.findIndex((s) => s.hash === base)
  return idx >= 0 ? idx : 0
}

/** Project slug from #projects/<slug>, or null. */
export function getProjectSlugFromHash(hash) {
  const raw = (hash || '').replace(/^#/, '').toLowerCase()
  if (!raw.startsWith('projects')) return null
  const parts = raw.split('/')
  return parts[1] || null
}

/** Build #projects/<slug> for a project id or slug. */
export function projectHash(projectIdOrSlug) {
  const item = projects.items.find(
    (p) => p.id === projectIdOrSlug || p.slug === projectIdOrSlug,
  )
  const slug = item?.slug ?? projects.items[0]?.slug ?? 'campusconnect'
  return `#projects/${slug}`
}

function hashToIndex(hash) {
  return hashToSceneIndex(hash)
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
  layer.className = 'scene-streaks'
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = `
    position:fixed; inset:0; pointer-events:none; overflow:hidden; z-index:45;
  `
  const count = 10
  for (let i = 0; i < count; i++) {
    const streak = document.createElement('div')
    const angle = (360 / count) * i + (Math.random() * 18 - 9)
    const len = 80 + Math.random() * 140
    streak.style.cssText = `
      position:absolute;
      left:${originX}px;
      top:${originY}px;
      width:${len}px;
      height:2px;
      transform-origin:0 50%;
      transform:rotate(${angle}deg) scaleX(0);
      background:linear-gradient(90deg, rgba(124,92,255,0.85), rgba(46,230,214,0.35), transparent);
      opacity:0;
      border-radius:1px;
      filter:blur(0.5px);
    `
    layer.appendChild(streak)
  }
  document.body.appendChild(layer)
  return layer
}

/**
 * Scene navigation + GSAP zoom transitions.
 * @param {{ sceneRefs: React.MutableRefObject<(HTMLElement|null)[]> }} opts
 */
export function useSceneTransition({ sceneRefs }) {
  const [activeIndex, setActiveIndex] = useState(() =>
    typeof window !== 'undefined' ? hashToIndex(window.location.hash) : 0,
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const activeIndexRef = useRef(activeIndex)
  const transitioningRef = useRef(false)
  const tlRef = useRef(null)
  const skipHashWrite = useRef(false)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const focusSceneHeading = useCallback((index) => {
    requestAnimationFrame(() => {
      const root = sceneRefs.current[index]
      if (!root) return
      const heading = root.querySelector('[data-scene-heading]')
      if (heading instanceof HTMLElement) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      } else {
        root.focus({ preventScroll: true })
      }
    })
  }, [sceneRefs])

  const syncHash = useCallback((index) => {
    const scene = scenes[index]
    const current = (window.location.hash || '').replace(/^#/, '').toLowerCase()
    const currentBase = current.split('/')[0]

    // Don't clobber #projects/<slug> when already on projects
    if (scene?.id === 'projects' && currentBase === 'projects') {
      return
    }

    const next = indexToHash(index)
    if (
      window.location.hash === next ||
      (index === 0 && (!window.location.hash || window.location.hash === '#'))
    ) {
      return
    }
    skipHashWrite.current = true
    window.history.replaceState(null, '', next)
    queueMicrotask(() => {
      skipHashWrite.current = false
    })
  }, [])

  const runTransition = useCallback(
    (toIndex, { reverse = false, originX, originY } = {}) => {
      if (transitioningRef.current) return
      if (toIndex < 0 || toIndex >= scenes.length) return
      if (toIndex === activeIndexRef.current) return

      const fromIndex = activeIndexRef.current
      const fromEl = sceneRefs.current[fromIndex]
      const toEl = sceneRefs.current[toIndex]
      if (!fromEl || !toEl) return

      transitioningRef.current = true
      setIsTransitioning(true)
      tlRef.current?.kill()

      const reduced = prefersReducedMotion()
      const ox =
        typeof originX === 'number' ? originX : window.innerWidth / 2
      const oy =
        typeof originY === 'number' ? originY : window.innerHeight / 2

      // Prepare next scene
      toEl.style.visibility = 'visible'
      toEl.style.pointerEvents = 'none'
      toEl.setAttribute('aria-hidden', 'false')
      fromEl.style.pointerEvents = 'none'

      const contentTargets = toEl.querySelectorAll('[data-scene-content] > *')

      if (reduced) {
        gsap.set(toEl, { opacity: 0, scale: 1, filter: 'blur(0px)' })
        gsap.set(fromEl, { opacity: 1 })
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(fromEl, { clearProps: 'opacity,scale,filter,transform' })
            fromEl.style.visibility = 'hidden'
            fromEl.style.pointerEvents = 'none'
            fromEl.setAttribute('aria-hidden', 'true')
            toEl.style.pointerEvents = 'auto'
            gsap.set(toEl, { clearProps: 'opacity,scale,filter,transform' })
            activeIndexRef.current = toIndex
            setActiveIndex(toIndex)
            syncHash(toIndex)
            transitioningRef.current = false
            setIsTransitioning(false)
            focusSceneHeading(toIndex)
          },
        })
        tl.to(fromEl, { opacity: 0, duration: 0.35, ease: 'power1.inOut' }, 0)
          .to(toEl, { opacity: 1, duration: 0.35, ease: 'power1.inOut' }, 0)
        tlRef.current = tl
        return
      }

      // Zoom path
      const fromScale = reverse ? ZOOM_IN_FROM : ZOOM_OUT
      const toStartScale = reverse ? ZOOM_OUT : ZOOM_IN_FROM

      gsap.set(fromEl, {
        transformOrigin: `${ox}px ${oy}px`,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
      })
      gsap.set(toEl, {
        transformOrigin: '50% 50%',
        scale: toStartScale,
        opacity: 0,
        filter: `blur(${BLUR}px)`,
      })
      if (contentTargets.length) {
        gsap.set(contentTargets, { opacity: 0, y: reverse ? -16 : 20 })
      }

      let streakLayer = null
      if (!reverse) {
        streakLayer = createStreaks(ox, oy)
        gsap.set(streakLayer.children, { opacity: 0, scaleX: 0 })
      }

      const half = DURATION * 0.48
      const tl = gsap.timeline({
        onComplete: () => {
          streakLayer?.remove()
          gsap.set(fromEl, { clearProps: 'opacity,scale,filter,transform' })
          fromEl.style.visibility = 'hidden'
          fromEl.style.pointerEvents = 'none'
          fromEl.setAttribute('aria-hidden', 'true')
          toEl.style.pointerEvents = 'auto'
          gsap.set(toEl, { clearProps: 'opacity,scale,filter,transform' })
          if (contentTargets.length) {
            gsap.set(contentTargets, { clearProps: 'opacity,transform' })
          }
          activeIndexRef.current = toIndex
          setActiveIndex(toIndex)
          syncHash(toIndex)
          transitioningRef.current = false
          setIsTransitioning(false)
          focusSceneHeading(toIndex)
        },
      })

      tl.to(
        fromEl,
        {
          scale: fromScale,
          opacity: 0,
          filter: `blur(${BLUR}px)`,
          duration: half,
          ease: 'power2.in',
        },
        0,
      )

      if (streakLayer) {
        tl.to(
          streakLayer.children,
          {
            opacity: 1,
            scaleX: 1,
            duration: half * 0.85,
            stagger: 0.03,
            ease: 'power2.out',
          },
          0.05,
        ).to(
          streakLayer.children,
          { opacity: 0, duration: 0.2, ease: 'power1.in' },
          half * 0.7,
        )
      }

      tl.to(
        toEl,
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: DURATION - half * 0.35,
          ease: 'power2.out',
        },
        half * 0.55,
      )

      if (contentTargets.length) {
        tl.to(
          contentTargets,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
          },
          half * 0.75,
        )
      }

      tlRef.current = tl
    },
    [focusSceneHeading, sceneRefs, syncHash],
  )

  const goTo = useCallback(
    (index, opts = {}) => {
      runTransition(index, opts)
    },
    [runTransition],
  )

  const goNext = useCallback(
    (opts = {}) => {
      const next = activeIndexRef.current + 1
      if (next < scenes.length) runTransition(next, { ...opts, reverse: false })
    },
    [runTransition],
  )

  const goPrev = useCallback(
    (opts = {}) => {
      const prev = activeIndexRef.current - 1
      if (prev >= 0) runTransition(prev, { ...opts, reverse: true })
    },
    [runTransition],
  )

  // Initial layout + hash on load
  useEffect(() => {
    const index = hashToIndex(window.location.hash)
    activeIndexRef.current = index
    setActiveIndex(index)

    sceneRefs.current.forEach((el, i) => {
      if (!el) return
      const active = i === index
      el.style.visibility = active ? 'visible' : 'hidden'
      el.style.pointerEvents = active ? 'auto' : 'none'
      el.setAttribute('aria-hidden', active ? 'false' : 'true')
      gsap.set(el, { opacity: 1, scale: 1, filter: 'blur(0px)' })
    })

    syncHash(index)
  }, [sceneRefs, syncHash])

  // Hash changes (back/forward / deep links)
  useEffect(() => {
    const onHash = () => {
      if (skipHashWrite.current) return
      const index = hashToIndex(window.location.hash)
      if (index === activeIndexRef.current) return
      const reverse = index < activeIndexRef.current
      runTransition(index, { reverse })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [runTransition])

  // Keyboard: arrows, Enter, Esc
  // On Projects scene, arrows are handled by ProjectsScene (capture phase) for project switching.
  useEffect(() => {
    const onKey = (e) => {
      if (transitioningRef.current) return
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        goPrev()
        return
      }

      const onProjects =
        scenes[activeIndexRef.current]?.id === 'projects'
      const isArrow =
        e.key === 'ArrowRight' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowUp'

      if (onProjects && isArrow) {
        // ProjectsScene handles these
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
        return
      }
      if (e.key === 'Enter') {
        const interactive =
          e.target instanceof HTMLElement &&
          (e.target.closest('a, button, [role="button"]') ||
            e.target.matches('a, button, [role="button"]'))
        if (interactive) return
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useEffect(() => () => tlRef.current?.kill(), [])

  return {
    activeIndex,
    activeScene: scenes[activeIndex],
    isTransitioning,
    scenes,
    goTo,
    goNext,
    goPrev,
  }
}
