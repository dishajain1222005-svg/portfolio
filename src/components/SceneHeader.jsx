/**
 * Scene header — top-left block showing SCENE 0X label, title, and optional sub-rows.
 * Absolutely positioned, pointer-events:none so it never blocks clicks.
 */
export default function SceneHeader({ number, title, children }) {
  return (
    <div
      className="scene-header pointer-events-none absolute z-10"
      style={{
        top: 'calc(var(--topbar-h, 66px) + 18px)',
        left: 'clamp(16px, 4vw, 48px)',
      }}
    >
      {/* SCENE 0X —— */}
      <div className="mb-1 flex items-center gap-3">
        <span
          className="font-mono text-[11px] tracking-[0.3em] uppercase"
          style={{ color: '#A78BFA' }}
        >
          SCENE {String(number).padStart(2, '0')}
        </span>
        <span
          className="h-px w-[160px]"
          style={{
            background: 'linear-gradient(to right, #A78BFA, transparent)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h2
        data-scene-heading
        className="font-bold text-white leading-none tracking-tight"
        style={{ fontSize: 'clamp(40px, 5.5vw, 68px)' }}
      >
        {title}
      </h2>

      {/* Optional sub-rows (icon + text lines) */}
      {children && (
        <div className="mt-3 flex flex-col gap-1.5">
          {children}
        </div>
      )}
    </div>
  )
}

/** Reusable icon-row for the scene header sub-info */
export function HeaderRow({ icon, text }) {
  return (
    <div className="flex items-center gap-2" style={{ color: 'rgba(185,176,224,0.75)' }}>
      <span className="shrink-0 text-violet" style={{ color: '#A78BFA' }}>{icon}</span>
      <span className="text-[15px] font-medium text-white/80">{text}</span>
    </div>
  )
}
