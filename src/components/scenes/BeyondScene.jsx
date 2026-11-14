import { useCallback, useRef } from 'react'
import { beyond } from '../../data/content'
import SceneHeader from '../SceneHeader'

/** Icon for Rangmanch (theatre / creative) */
function TheatreIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M2 10s3-3 6-3 5.5 2 8 2 6-3 6-3v9s-3 3-6 3-5.5-2-8-2-6 3-6 3v-9z"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

/** Icon for Advait (technical / engineering) */
function TechIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  )
}

const CARD_ICONS = {
  rangmanch: <TheatreIcon />,
  advait:    <TechIcon />,
}

/** Glass card — no emojis, improved typography and layout */
function GlassCard({ activity }) {
  const cardRef = useRef(null)

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current; if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    card.style.setProperty('--spot-opacity', '1')
  }, [])

  const onMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty('--spot-opacity', '0')
  }, [])

  return (
    <article
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: 24,
        background: 'rgba(18,10,51,0.72)',
        border: '1px solid rgba(167,139,250,0.35)',
        backdropFilter: 'blur(18px)',
        '--spot-opacity': 0,
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(167,139,250,0.65)'
        e.currentTarget.style.boxShadow = '0 0 40px rgba(124,92,255,0.18)'
      }}
    >
      {/* Cursor spotlight */}
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 24,
          opacity: 'var(--spot-opacity)',
          transition: 'opacity 0.3s ease',
          background: 'radial-gradient(300px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(167,139,250,0.12), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Top accent bar */}
      <div
        className="shrink-0"
        style={{
          height: 3,
          background: 'linear-gradient(90deg, rgba(124,92,255,0.8), rgba(167,139,250,0.4), transparent)',
          borderRadius: '24px 24px 0 0',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col p-7">
        {/* Icon + role header */}
        <div className="mb-5 flex items-center gap-4">
          <div
            className="flex shrink-0 items-center justify-center rounded-2xl"
            style={{
              width: 52,
              height: 52,
              background: 'rgba(124,92,255,0.15)',
              border: '1px solid rgba(167,139,250,0.4)',
              color: '#A78BFA',
            }}
          >
            {CARD_ICONS[activity.id]}
          </div>
          <div className="min-w-0">
            <p
              className="font-mono uppercase tracking-[0.2em]"
              style={{ fontSize: 10, color: '#A78BFA', marginBottom: 3 }}
            >
              {activity.role}
            </p>
            <h3
              className="font-bold leading-tight"
              style={{ fontSize: 'clamp(17px,2.2vw,21px)', color: '#fff' }}
            >
              {activity.orgFull}
            </h3>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="mb-4 font-medium italic"
          style={{
            fontSize: 14,
            color: '#C4B5FD',
            paddingBottom: 16,
            borderBottom: '1px solid rgba(167,139,250,0.15)',
          }}
        >
          {activity.tagline}
        </p>

        {/* Body */}
        <p
          className="flex-1 leading-relaxed"
          style={{ fontSize: 15, color: '#B9B0E0', lineHeight: 1.7 }}
        >
          {activity.body}
        </p>

        {/* Highlights */}
        {activity.highlights?.length > 0 && (
          <ul className="mt-5 space-y-2.5" aria-label={`${activity.org} highlights`}>
            {activity.highlights.map((h) => (
              <li
                key={h.id}
                className="flex items-start gap-3"
                style={{ fontSize: 13, color: '#B9B0E0' }}
              >
                <span
                  className="mt-1.5 shrink-0"
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#A78BFA,#7C5CFF)',
                    display: 'block',
                  }}
                  aria-hidden="true"
                />
                {h.text}
              </li>
            ))}
          </ul>
        )}

        {/* [TODO] placeholder — only shown when no highlights yet */}
        {(!activity.highlights || activity.highlights.length === 0) && (
          <p
            className="font-mono mt-5 italic"
            style={{ fontSize: 11, color: 'rgba(167,139,250,0.4)' }}
          >
            {/* Add highlights in content.js → beyond.activities[*].highlights */}
          </p>
        )}
      </div>
    </article>
  )
}

export default function BeyondScene() {
  const activities = beyond.activities ?? []

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <SceneHeader number={6} title={beyond.heading} />

      <div
        className="mx-auto w-full max-w-4xl px-6 pb-12 sm:px-10"
        style={{ paddingTop: 'calc(66px + 160px)' }}
      >
        {/* Sub-heading */}
        <p
          className="mb-8 leading-relaxed"
          style={{ fontSize: 16, color: '#B9B0E0', maxWidth: 520 }}
        >
          {beyond.lead}
        </p>

        {/* Two glass cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {activities.map((activity) => (
            <GlassCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Bridge line */}
        {activities.length >= 2 && (
          <div className="mt-8 flex items-center gap-5">
            <span
              className="h-px flex-1"
              style={{ background: 'linear-gradient(to right, transparent, rgba(167,139,250,0.45))' }}
              aria-hidden="true"
            />
            <p
              className="font-mono shrink-0 text-center"
              style={{
                fontSize: 11,
                color: '#C4B5FD',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {beyond.bridge}
            </p>
            <span
              className="h-px flex-1"
              style={{ background: 'linear-gradient(to left, transparent, rgba(167,139,250,0.45))' }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  )
}
