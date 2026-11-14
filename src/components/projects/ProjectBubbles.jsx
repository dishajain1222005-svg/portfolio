import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Fixed-anchor floating bubbles with CSS sine-wave float.
 * No cursor repulsion. Click triggers a burst animation then calls onOpen.
 */

// Projects anchors (x%, y% of viewport)
const ANCHORS = [
  { x: 50, y: 52 },  // CampusConnect — centre
  { x: 20, y: 38 },  // SatQuery-AI   — left
  { x: 78, y: 36 },  // ZeroTrace     — right
  { x: 28, y: 70 },  // meshminds     — bottom-left
  { x: 72, y: 68 },  // Society Mgmt  — bottom-right
]

// Float phases (seconds offset) so bubbles don't all move in sync
const FLOAT_PHASES = [0, 1.4, 2.8, 0.7, 2.1]

// Gradient pairs
const GRADIENTS = [
  ['#7c5cff', '#2ee6d6'],
  ['#5c3fff', '#7c5cff'],
  ['#2ee6d6', '#5c8fff'],
  ['#7c5cff', '#c05cff'],
  ['#3fbfff', '#7c5cff'],
]

/** Render a burst effect at (cx,cy) then call onDone */
function runBurst(cx, cy, onDone) {
  const COUNT = 16
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden;'
  document.body.appendChild(layer)

  // Shockwave ring
  const ring = document.createElement('div')
  ring.style.cssText = `
    position:absolute;
    left:${cx}px;top:${cy}px;
    width:0;height:0;
    border-radius:50%;
    border:2px solid rgba(124,92,255,0.8);
    transform:translate(-50%,-50%);
    transition:width 0.42s ease-out,height 0.42s ease-out,opacity 0.42s ease-out;
    opacity:1;
  `
  layer.appendChild(ring)
  requestAnimationFrame(() => {
    ring.style.width  = '220px'
    ring.style.height = '220px'
    ring.style.opacity = '0'
  })

  // Droplet particles
  for (let i = 0; i < COUNT; i++) {
    const angle = (360 / COUNT) * i * (Math.PI / 180)
    const dist  = 60 + Math.random() * 60
    const tx    = Math.cos(angle) * dist
    const ty    = Math.sin(angle) * dist
    const size  = 4 + Math.random() * 5
    const p = document.createElement('div')
    p.style.cssText = `
      position:absolute;
      left:${cx}px;top:${cy}px;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:color-mix(in srgb,#7c5cff ${50 + Math.random()*50}%,#2ee6d6);
      transform:translate(-50%,-50%);
      transition:transform 0.45s cubic-bezier(0.22,1,0.36,1),opacity 0.45s ease-out;
      opacity:1;
    `
    layer.appendChild(p)
    requestAnimationFrame(() => {
      p.style.transform = `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px))`
      p.style.opacity   = '0'
    })
  }

  setTimeout(() => { layer.remove(); onDone() }, 460)
}

export default function ProjectBubbles({ items, openId, isActive, onOpen, bubbleRefs }) {
  const [bursting, setBursting] = useState(null) // id of bubble currently bursting
  const posRef  = useRef([])  // current anchor px positions
  const elemRefs = useRef([])

  // Compute anchor positions from viewport %
  const computePos = useCallback(() => {
    const W = window.innerWidth
    const H = window.innerHeight
    posRef.current = items.map((_, i) => ({
      x: (ANCHORS[i]?.x ?? 50) / 100 * W,
      y: (ANCHORS[i]?.y ?? 55) / 100 * H,
    }))
    // Apply immediately (no float offset — that's CSS)
    items.forEach((_, i) => {
      const el = elemRefs.current[i]
      if (!el) return
      const { x, y } = posRef.current[i]
      el.style.left = `${x}px`
      el.style.top  = `${y}px`
    })
  }, [items])

  useEffect(() => {
    computePos()
    const onResize = () => computePos()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [computePos])

  const handleClick = useCallback((item, i) => {
    if (bursting) return
    setBursting(item.id)
    const el = elemRefs.current[i]
    const rect = el?.getBoundingClientRect()
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const cy = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2
    runBurst(cx, cy, () => {
      setBursting(null)
      onOpen(item.id)
    })
  }, [bursting, onOpen])

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-label="Projects"
      role="group"
      data-interactive
    >
      {items.map((item, i) => {
        const isBursting = bursting === item.id
        const dimmed     = (openId && openId !== item.id) || isBursting
        const [c1, c2]   = GRADIENTS[i] ?? GRADIENTS[0]

        // Sizes via clamp — featured is bigger
        const size = item.featured
          ? 'clamp(170px,24vmin,290px)'
          : 'clamp(125px,17vmin,220px)'

        return (
          <button
            key={item.id}
            ref={(el) => {
              elemRefs.current[i] = el
              if (bubbleRefs) bubbleRefs.current[item.id] = el
            }}
            type="button"
            onClick={() => handleClick(item, i)}
            onPointerUp={(e) => e.stopPropagation()}
            aria-label={`Open project: ${item.title}`}
            aria-expanded={openId === item.id}
            data-interactive
            className={`bubble-anchor absolute rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-violet focus-visible:outline-offset-4 transition-opacity duration-300 ${
              dimmed ? 'opacity-25 pointer-events-none' : 'opacity-100'
            }`}
            style={{
              width:  size,
              height: size,
              transform: 'translate(-50%, -50%)',
              animationName:     'bubble-float',
              animationDuration: `${4.5 + i * 0.4}s`,
              animationDelay:    `${-FLOAT_PHASES[i]}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              background: `radial-gradient(circle at 35% 35%, color-mix(in srgb,${c1} 70%,#0e1016), color-mix(in srgb,${c2} 60%,#07080c))`,
              boxShadow: `0 0 0 1px color-mix(in srgb,${c1} 35%,transparent), 0 0 32px color-mix(in srgb,${c1} 20%,transparent)`,
              opacity: isBursting ? 0 : undefined,
            }}
          >
            {/* Highlight arc */}
            <span className="pointer-events-none absolute inset-[6%] rounded-full"
              style={{ background: 'radial-gradient(circle at 30% 25%,color-mix(in srgb,white 18%,transparent),transparent 60%)' }}
              aria-hidden="true"
            />
            <span className="relative flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center select-none">
              <span className={`font-semibold leading-tight text-white drop-shadow-sm ${item.featured ? 'text-[19px]' : 'text-[16px]'}`}>
                {item.title}
              </span>
              <span className="font-mono text-[13px] leading-none text-white/65">
                {item.stackLabel}
              </span>
              {item.featured && (
                <span className="font-mono mt-1 rounded-full border border-white/25 px-2 py-0.5 text-[11px] tracking-wider text-white/70 uppercase">
                  Featured
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
