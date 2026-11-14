import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from '../../data/content'
import { getProjectSlugFromHash, projectHash } from '../../hooks/useSceneTransition'
import SceneHeader, { HeaderRow } from '../SceneHeader'
import OrbitRing from '../OrbitRing'
import Orb, { OrbIcon, OrbTitle, OrbDesc } from '../Orb'
import CampusConnectVisual from '../projects/CampusConnectVisual'

// ── Anchor positions (x%, y%) — same orbit layout as Experience ───────────────
// CampusConnect (featured) = bottom centre, others in arc around it
const ANCHORS = [
  { x: 50, y: 69 },  // CampusConnect — featured, bottom centre
  { x: 35, y: 31 },  // SatQuery-AI   — top left
  { x: 66, y: 31 },  // ZeroTrace     — top right
  { x: 24, y: 62 },  // meshminds     — mid left
  { x: 76, y: 62 },  // Society Mgmt  — mid right
]
const FLOAT = [
  { duration: 5.2, delay: 0   },
  { duration: 4.6, delay: 1.8 },
  { duration: 5.0, delay: 3.2 },
  { duration: 4.8, delay: 0.9 },
  { duration: 5.4, delay: 2.5 },
]

// ── Per-project icons (SVG, violet stroke) ────────────────────────────────────
const PROJECT_ICONS = {
  campusconnect: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
      <circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>
  ),
  'satquery-ai': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
      <path d="M11 8v3l2 2"/>
    </svg>
  ),
  zerotrace: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  meshminds: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  'society-management': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
}

// ── Burst effect (same as ExperienceScene) ────────────────────────────────────
function runBurst(cx, cy, onDone) {
  const COUNT = 16
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden;'
  document.body.appendChild(layer)
  const ring = document.createElement('div')
  ring.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:0;height:0;border-radius:50%;border:2px solid rgba(220,200,255,0.9);transform:translate(-50%,-50%);transition:width .42s ease-out,height .42s ease-out,opacity .42s ease-out;opacity:1;`
  layer.appendChild(ring)
  requestAnimationFrame(() => { ring.style.width='260px'; ring.style.height='260px'; ring.style.opacity='0' })
  for (let i = 0; i < COUNT; i++) {
    const angle = (360/COUNT)*i*(Math.PI/180)
    const dist = 70 + Math.random()*60
    const size = 4 + Math.random()*5
    const p = document.createElement('div')
    p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;border-radius:50%;background:rgba(215,195,255,0.95);transform:translate(-50%,-50%);transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .45s ease-out;opacity:1;`
    layer.appendChild(p)
    requestAnimationFrame(() => {
      p.style.transform = `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px))`
      p.style.opacity = '0'
    })
  }
  setTimeout(() => { layer.remove(); onDone() }, 460)
}

function trapFocus(el) {
  const sel = 'button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'
  const h = (e) => {
    if (e.key !== 'Tab') return
    const all = [...el.querySelectorAll(sel)], first = all[0], last = all[all.length-1]
    if (e.shiftKey) { if (document.activeElement===first) { e.preventDefault(); last?.focus() } }
    else            { if (document.activeElement===last)  { e.preventDefault(); first?.focus() } }
  }
  el.addEventListener('keydown', h)
  return () => el.removeEventListener('keydown', h)
}

function resolveId(slugOrId) {
  if (!slugOrId) return null
  return projects.items.find(p => p.id===slugOrId || p.slug===slugOrId)?.id ?? null
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function ProjectDetailPanel({ project, onClose, closeBtnRef }) {
  const panelRef = useRef(null)
  useEffect(() => { const el = panelRef.current; if (!el) return; return trapFocus(el) }, [])

  const Visual = () => {
    if (project.visual === 'wifi') return <CampusConnectVisual />
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#1a1040,#2d1b6e,#0d0628)' }}>
        <span className="pointer-events-none select-none font-bold leading-none"
          style={{ fontSize: 'clamp(4rem,14vw,7rem)', color: 'rgba(167,139,250,0.12)' }}>
          {project.monogram}
        </span>
      </div>
    )
  }

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(5,3,15,0.88)', backdropFilter: 'blur(10px)' }}
      data-backdrop
      onPointerUp={(e) => { e.stopPropagation(); if (e.target===e.currentTarget) onClose() }}
      onClick={(e) => { if (e.target===e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog" aria-modal="true" aria-label={project.title}
        className="relative flex w-full flex-col overflow-hidden"
        style={{
          maxWidth: 'min(680px,92vw)',
          maxHeight: '82vh',
          borderRadius: 24,
          background: 'linear-gradient(155deg,rgba(124,92,255,0.14) 0%,rgba(18,10,51,0.98) 55%)',
          border: '1px solid rgba(167,139,250,0.4)',
          boxShadow: '0 0 80px rgba(124,92,255,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        {/* Visual header */}
        <div className="relative shrink-0 overflow-hidden" style={{ height: 180, borderRadius:'24px 24px 0 0' }}>
          <Visual />
          {project.featured && (
            <span className="absolute top-3 right-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
              style={{ border:'1px solid rgba(167,139,250,0.5)', background:'rgba(124,92,255,0.2)', color:'#C4B5FD' }}>
              Featured
            </span>
          )}
          {/* Back button overlaid on visual */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-white/80 transition hover:text-white focus-visible:outline-offset-4"
            style={{ border:'1px solid rgba(167,139,250,0.4)', background:'rgba(18,10,51,0.75)', backdropFilter:'blur(8px)' }}
            aria-label="Back to orbs"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to orbs
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <h3 className="mb-1 text-[1.5rem] font-bold text-white">{project.title}</h3>
          <p className="mb-4 text-[16px]" style={{ color: '#B9B0E0' }}>{project.tagline}</p>
          <p className="mb-5 text-[16px] leading-relaxed" style={{ color: '#9B8EC4' }}>{project.detail}</p>

          {/* Stack chips */}
          <ul className="mb-5 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.tags.map(tag => (
              <li key={tag} className="rounded-full px-3 py-1 text-[12px] font-medium"
                style={{ border:'1px solid rgba(167,139,250,0.4)', background:'rgba(124,92,255,0.12)', color:'#C4B5FD' }}>
                {tag}
              </li>
            ))}
          </ul>

          {/* Key facts */}
          <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Key facts">
            {project.facts.map(fact => (
              <li key={fact} className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-white"
                style={{ border:'1px solid rgba(167,139,250,0.2)', background:'rgba(124,92,255,0.08)' }}>
                {fact}
              </li>
            ))}
          </ul>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold text-white transition focus-visible:outline-offset-4"
              style={{ border:'1px solid rgba(167,139,250,0.4)', background:'rgba(124,92,255,0.15)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full px-5 text-[14px] font-bold text-white transition focus-visible:outline-offset-4"
                style={{ background:'linear-gradient(135deg,#7C5CFF,#A78BFA)', boxShadow:'0 0 18px rgba(124,92,255,0.4)' }}>
                Live site
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main scene ────────────────────────────────────────────────────────────────
export default function ProjectsScene({ isActive, onPanelChange }) {
  const items = projects.items

  const [openId,   setOpenId]   = useState(null)
  const [bursting, setBursting] = useState(null)
  const closeBtnRef = useRef(null)
  const orbRefs     = useRef({})
  const elemRefs    = useRef([])

  // Compute anchor positions
  const computePos = useCallback(() => {
    const W = window.innerWidth, H = window.innerHeight
    items.forEach((_, i) => {
      const el = elemRefs.current[i]; if (!el) return
      el.style.left = `${ANCHORS[i].x / 100 * W}px`
      el.style.top  = `${ANCHORS[i].y / 100 * H}px`
    })
  }, [items])

  useEffect(() => {
    computePos()
    window.addEventListener('resize', computePos)
    return () => window.removeEventListener('resize', computePos)
  }, [computePos])

  // Sync hash → openId when scene becomes active
  useEffect(() => {
    if (!isActive) return
    const slug = getProjectSlugFromHash(window.location.hash)
    setOpenId(slug ? resolveId(slug) : null)
  }, [isActive])

  useEffect(() => { onPanelChange?.(!!openId) }, [openId, onPanelChange])

  const handleClick = useCallback((item, i) => {
    if (bursting) return
    setBursting(item.id)
    const el = elemRefs.current[i]
    const rect = el?.getBoundingClientRect()
    const cx = rect ? rect.left + rect.width / 2  : window.innerWidth / 2
    const cy = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2
    runBurst(cx, cy, () => {
      setBursting(null)
      setOpenId(item.id)
      const next = projectHash(item.id)
      if (window.location.hash !== next) window.history.replaceState(null, '', next)
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    })
  }, [bursting])

  const closeProject = useCallback(() => {
    const prev = openId
    setOpenId(null)
    if (window.location.hash !== '#projects') window.history.replaceState(null, '', '#projects')
    requestAnimationFrame(() => { if (prev) orbRefs.current[prev]?.focus() })
  }, [openId])

  useEffect(() => {
    if (!isActive || !openId) return
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeProject() } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [isActive, openId, closeProject])

  const openItem = openId ? items.find(p => p.id === openId) : null

  return (
    <div className="relative h-full w-full overflow-hidden">

      {/* Scene header */}
      <SceneHeader number={4} title={projects.heading}>
        <HeaderRow
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          }
          text="5 selected builds"
        />
      </SceneHeader>

      {/* Orbit ring */}
      <OrbitRing cx="50%" cy="51%" rx="37%" ry="29%" />

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden" aria-label="Projects" role="group">
        {items.map((item, i) => (
          <Orb
            key={item.id}
            innerRef={(el) => { elemRefs.current[i] = el; orbRefs.current[item.id] = el }}
            size={item.featured ? 'clamp(162px,23vmin,250px)' : 'clamp(150px,21vmin,230px)'}
            featured={item.featured}
            dimmed={(!!openId && openId !== item.id) || bursting === item.id}
            bursting={bursting === item.id}
            float={FLOAT[i]}
            onClick={() => handleClick(item, i)}
            onPointerUp={(e) => e.stopPropagation()}
            ariaLabel={`Open project: ${item.title}`}
            ariaExpanded={openId === item.id}
          >
            <OrbIcon>{PROJECT_ICONS[item.id]}</OrbIcon>
            <OrbTitle featured={item.featured}>{item.title}</OrbTitle>
            <OrbDesc>{item.tagline}</OrbDesc>
          </Orb>
        ))}
      </div>

      {/* Detail panel */}
      {openItem && (
        <ProjectDetailPanel
          project={openItem}
          onClose={closeProject}
          closeBtnRef={closeBtnRef}
        />
      )}
    </div>
  )
}
