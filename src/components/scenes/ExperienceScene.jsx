import { useCallback, useEffect, useRef, useState } from 'react'
import { experience } from '../../data/content'
import SceneHeader, { HeaderRow } from '../SceneHeader'
import OrbitRing from '../OrbitRing'
import Orb, { OrbIcon, OrbTitle, OrbDesc } from '../Orb'

// ── Spec §7 layout (x%, y% of viewport) ──────────────────────────────────────
// Order: ship(0), summaries(1), batch(2), product(3), quality(4)
const ANCHORS = [
  { x: 50, y: 69 },  // Ship & Review — featured, bottom centre
  { x: 35, y: 31 },  // Meeting Summaries — top left
  { x: 66, y: 31 },  // Batch Mark-as-Read — top right
  { x: 24, y: 62 },  // Product Surfaces — mid left
  { x: 76, y: 62 },  // Tests & Specs — mid right
]
const FLOAT = [
  { duration: 5.2, delay: 0   },
  { duration: 4.6, delay: 1.8 },
  { duration: 5.0, delay: 3.2 },
  { duration: 4.8, delay: 0.9 },
  { duration: 5.4, delay: 2.5 },
]

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const ICONS = {
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.5-2 4.5-2 4.5s3-0.5 4.5-2a3 3 0 0 0-3-3z"/>
      <path d="M12 2C6 6 5 12 9 16c3-3 5-5 9-9 0-4-3-5-6-5z"/>
      <path d="M15 7l2-2"/>
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <path d="M9 7h6M9 11h6M9 15h4"/>
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
}

// ── Burst effect ──────────────────────────────────────────────────────────────
function runBurst(cx, cy, onDone) {
  const COUNT = 16
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden;'
  document.body.appendChild(layer)
  const ring = document.createElement('div')
  ring.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:0;height:0;border-radius:50%;border:2px solid rgba(220,200,255,0.9);transform:translate(-50%,-50%);transition:width .42s ease-out,height .42s ease-out,opacity .42s ease-out;opacity:1;`
  layer.appendChild(ring)
  requestAnimationFrame(() => { ring.style.width='260px';ring.style.height='260px';ring.style.opacity='0' })
  for (let i = 0; i < COUNT; i++) {
    const angle = (360/COUNT)*i*(Math.PI/180)
    const dist = 70+Math.random()*60, size = 4+Math.random()*5
    const p = document.createElement('div')
    p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;border-radius:50%;background:rgba(215,195,255,0.95);transform:translate(-50%,-50%);transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .45s ease-out;opacity:1;`
    layer.appendChild(p)
    requestAnimationFrame(() => { p.style.transform=`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px))`;p.style.opacity='0' })
  }
  setTimeout(() => { layer.remove(); onDone() }, 460)
}

function trapFocus(el) {
  const sel = 'button,a,[tabindex]:not([tabindex="-1"]),input,textarea'
  const h = (e) => {
    if (e.key !== 'Tab') return
    const all = [...el.querySelectorAll(sel)], first=all[0], last=all[all.length-1]
    if (e.shiftKey) { if(document.activeElement===first){e.preventDefault();last?.focus()} }
    else            { if(document.activeElement===last) {e.preventDefault();first?.focus()} }
  }
  el.addEventListener('keydown',h); return ()=>el.removeEventListener('keydown',h)
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function MilestonePanel({ node, role, onClose, closeBtnRef }) {
  const panelRef = useRef(null)
  useEffect(() => { const el=panelRef.current; if(!el) return; return trapFocus(el) },[])
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6"
      style={{ background:'rgba(5,3,15,0.88)',backdropFilter:'blur(10px)' }}
      data-backdrop
      onPointerUp={(e)=>{e.stopPropagation();if(e.target===e.currentTarget)onClose()}}
      onClick={(e)=>{if(e.target===e.currentTarget)onClose()}}
    >
      <div
        ref={panelRef}
        role="dialog" aria-modal="true" aria-label={node.label}
        className="relative w-full overflow-hidden"
        style={{
          maxWidth:'min(600px,92vw)',
          borderRadius:24,
          background:'linear-gradient(155deg,rgba(124,92,255,0.14) 0%,rgba(18,10,51,0.98) 55%)',
          border:'1px solid rgba(167,139,250,0.4)',
          boxShadow:'0 0 80px rgba(124,92,255,0.3)',
        }}
        onClick={(e)=>e.stopPropagation()} onPointerUp={(e)=>e.stopPropagation()}
      >
        <div className="px-7 pt-7 pb-8">
          <button ref={closeBtnRef} type="button" onClick={onClose}
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-white/80 transition hover:text-white focus-visible:outline-offset-4"
            style={{ border:'1px solid rgba(167,139,250,0.3)', background:'rgba(124,92,255,0.1)' }}
            aria-label="Back to orbs">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to orbs
          </button>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl"
              style={{ width:52,height:52,border:'1px solid rgba(167,139,250,0.4)', background:'rgba(124,92,255,0.12)', color:'#A78BFA' }}>
              {ICONS[node.icon] ?? ICONS.document}
            </div>
            <h3 className="text-[1.4rem] font-bold text-white">{node.label}</h3>
          </div>
          <p className="text-[16px] leading-relaxed" style={{ color:'#B9B0E0' }}>{node.detail}</p>
          <div className="mt-5 border-t pt-4" style={{ borderColor:'rgba(167,139,250,0.2)' }}>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color:'rgba(167,139,250,0.65)' }}>
              {role.role} · {role.org} · {role.period}
            </p>
            <ul className="flex flex-wrap gap-2">
              {role.stack.map(s=>(
                <li key={s} className="rounded-full px-3 py-1 text-[12px] font-medium"
                  style={{ border:'1px solid rgba(167,139,250,0.4)', background:'rgba(124,92,255,0.12)', color:'#C4B5FD' }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ExperienceScene({ isActive, onPanelChange }) {
  const role       = experience.items[0]
  const milestones = role?.milestones ?? []

  const [openId,   setOpenId]   = useState(null)
  const [bursting, setBursting] = useState(null)
  const closeBtnRef = useRef(null)
  const bubbleRefs  = useRef({})
  const elemRefs    = useRef([])

  const computePos = useCallback(() => {
    const W = window.innerWidth, H = window.innerHeight
    milestones.forEach((_,i) => {
      const el = elemRefs.current[i]; if(!el) return
      el.style.left = `${ANCHORS[i].x/100*W}px`
      el.style.top  = `${ANCHORS[i].y/100*H}px`
    })
  }, [milestones])

  useEffect(() => {
    computePos()
    window.addEventListener('resize', computePos)
    return () => window.removeEventListener('resize', computePos)
  }, [computePos])

  useEffect(() => { onPanelChange?.(!!openId) }, [openId, onPanelChange])

  const handleClick = useCallback((id, i) => {
    if (bursting) return
    setBursting(id)
    const el = elemRefs.current[i]
    const rect = el?.getBoundingClientRect()
    const cx = rect ? rect.left+rect.width/2 : window.innerWidth/2
    const cy = rect ? rect.top+rect.height/2 : window.innerHeight/2
    runBurst(cx, cy, () => {
      setBursting(null); setOpenId(id)
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    })
  }, [bursting])

  const closeNode = useCallback(() => {
    const prev = openId; setOpenId(null)
    requestAnimationFrame(() => { if(prev) bubbleRefs.current[prev]?.focus() })
  }, [openId])

  useEffect(() => {
    if(!isActive||!openId) return
    const onKey=(e)=>{ if(e.key==='Escape'){e.stopPropagation();closeNode()} }
    window.addEventListener('keydown',onKey,true)
    return ()=>window.removeEventListener('keydown',onKey,true)
  }, [isActive,openId,closeNode])

  const openNode = openId ? milestones.find(m=>m.id===openId) : null

  // Reorder for rendering: spec says summaries=1, batch=2, product=3, ship=0, quality=4
  // Render order matches ANCHORS array: ship(i=0), summaries(i=1), batch(i=2), product(i=3), quality(i=4)
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Scene header */}
      <SceneHeader number={3} title={experience.heading}>
        <HeaderRow
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 2v4M8 2v4"/></svg>}
          text={`${role?.role} · ${role?.org}`}
        />
        <HeaderRow
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
          text={role?.period}
        />
      </SceneHeader>

      {/* Orbit ring */}
      <OrbitRing cx="50%" cy="51%" rx="37%" ry="29%" />

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden" aria-label="Experience milestones" role="group">
        {milestones.map((node, i) => (
          <Orb
            key={node.id}
            innerRef={(el) => { elemRefs.current[i]=el; bubbleRefs.current[node.id]=el }}
            size={i===0 ? 'clamp(162px,23vmin,250px)' : 'clamp(150px,21vmin,230px)'}
            featured={i===0}
            dimmed={(!!openId && openId!==node.id) || bursting===node.id}
            bursting={bursting===node.id}
            float={FLOAT[i]}
            onClick={() => handleClick(node.id, i)}
            onPointerUp={(e) => e.stopPropagation()}
            ariaLabel={`Open milestone: ${node.label}`}
            ariaExpanded={openId===node.id}
          >
            <OrbIcon>{ICONS[node.icon]??ICONS.document}</OrbIcon>
            <OrbTitle featured={i===0}>{node.label}</OrbTitle>
            <OrbDesc>{node.blurb}</OrbDesc>
          </Orb>
        ))}
      </div>

      {openNode && <MilestonePanel node={openNode} role={role} onClose={closeNode} closeBtnRef={closeBtnRef}/>}
    </div>
  )
}
