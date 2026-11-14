import { useEffect, useState } from 'react'
import { experience, scenes } from '../../data/content'
import PortalButton from '../PortalButton'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

export default function ExperienceScene({ onNext }) {
  const next = scenes[4]
  const role = experience.items[0]
  const milestones = role?.milestones ?? []
  const reduced = usePrefersReducedMotion()
  const [activeId, setActiveId] = useState(milestones[0]?.id ?? null)

  if (!role) return null

  return (
    <div className="relative mx-auto flex h-svh min-h-0 w-full max-w-5xl flex-col overflow-hidden px-5 pt-20 pb-4 sm:px-8">
      <header className="mb-4 shrink-0 sm:mb-5">
        <p className="font-mono mb-1 text-[12px] tracking-[0.18em] text-violet uppercase">
          Scene 04
        </p>
        <h2
          data-scene-heading
          className="text-metallic text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold tracking-[-0.03em]"
        >
          {experience.heading}
        </h2>
        <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-muted">
          {experience.lead}
        </p>
      </header>

      <div className="exp-role mb-4 shrink-0 rounded-lg border border-white/10 bg-surface/60 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[18px] font-medium text-silver-bright sm:text-[20px]">
            {role.role}
          </h3>
          <span className="font-mono text-[12px] tracking-wide text-violet">
            {role.org}
          </span>
          <span className="font-mono text-[12px] text-muted">{role.period}</span>
        </div>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted sm:text-[16px]">
          {role.summary}
        </p>
        <ul
          className="mt-3 flex flex-wrap gap-2"
          aria-label="Tech stack"
        >
          {role.stack.map((chip) => (
            <li
              key={chip}
              className="font-mono rounded-md border border-violet/30 bg-violet/10 px-2.5 py-1 text-[12px] text-silver-bright"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-2">
        <ol
          className="exp-timeline relative"
          aria-label={`${role.role} at ${role.org} milestones`}
        >
          {milestones.map((node, index) => {
            const isActive = activeId === node.id
            return (
              <li key={node.id} className="exp-timeline__item relative">
                <button
                  type="button"
                  className={`exp-node group relative flex w-full flex-col gap-1 rounded-lg border px-4 py-3 text-left transition focus-visible:outline-offset-4 sm:px-5 sm:py-3.5 ${
                    isActive
                      ? 'exp-node--active border-violet/50 bg-violet/10'
                      : 'border-white/10 bg-surface/40 hover:border-violet/35 hover:bg-violet/5'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => setActiveId(node.id)}
                  onFocus={() => setActiveId(node.id)}
                >
                  <span
                    className={`exp-node__dot absolute ${
                      isActive ? 'exp-node__dot--active' : ''
                    } ${reduced ? 'exp-node__dot--static' : ''}`}
                    aria-hidden="true"
                  />
                  <div className="exp-node__body flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                      {node.period}
                    </span>
                    <span
                      className={`text-[15px] font-medium sm:text-[16px] ${
                        isActive ? 'text-silver-bright' : 'text-silver'
                      }`}
                    >
                      {node.label}
                    </span>
                    <span className="font-mono text-[11px] text-muted/80">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p
                    className={`exp-node__body text-[14px] leading-relaxed sm:text-[15px] ${
                      isActive ? 'text-silver' : 'text-muted'
                    }`}
                  >
                    {node.detail}
                  </p>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mt-3 flex shrink-0 justify-end">
        <PortalButton
          nextLabel={next.label}
          onClick={onNext}
          variant="compact"
        />
      </div>
    </div>
  )
}
