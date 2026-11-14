import { useCallback, useEffect, useRef, useState } from 'react'
import { projects, scenes } from '../../data/content'
import {
  getProjectSlugFromHash,
  projectHash,
} from '../../hooks/useSceneTransition'
import PortalButton from '../PortalButton'
import ProjectDetail from '../projects/ProjectDetail'
import ProjectList from '../projects/ProjectList'

const DEFAULT_ID = projects.items[0]?.id ?? 'campusconnect'

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

function resolveProjectId(slugOrId) {
  if (!slugOrId) return DEFAULT_ID
  const match = projects.items.find(
    (item) => item.id === slugOrId || item.slug === slugOrId,
  )
  return match?.id ?? DEFAULT_ID
}

function syncProjectHash(projectId) {
  const next = projectHash(projectId)
  if (window.location.hash === next) return
  window.history.replaceState(null, '', next)
}

export default function ProjectsScene({ onNext, isActive = false }) {
  const nextScene = scenes[3]
  const items = projects.items
  const reduced = usePrefersReducedMotion()
  const tablistRef = useRef(null)
  const skipHashRead = useRef(false)

  const [activeId, setActiveId] = useState(() =>
    typeof window !== 'undefined'
      ? resolveProjectId(getProjectSlugFromHash(window.location.hash))
      : DEFAULT_ID,
  )
  const [animKey, setAnimKey] = useState(0)
  const activeIdRef = useRef(activeId)

  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  const activeIndex = items.findIndex((item) => item.id === activeId)
  const active = items[activeIndex >= 0 ? activeIndex : 0]

  const selectProject = useCallback(
    (id, { fromHash = false } = {}) => {
      const resolved = resolveProjectId(id)
      if (activeIdRef.current !== resolved) {
        if (!reduced) setAnimKey((k) => k + 1)
        setActiveId(resolved)
        activeIdRef.current = resolved
      }
      if (!fromHash) {
        skipHashRead.current = true
        syncProjectHash(resolved)
        queueMicrotask(() => {
          skipHashRead.current = false
        })
      }
    },
    [reduced],
  )

  const stepProject = useCallback(
    (delta) => {
      const idx = items.findIndex((item) => item.id === activeId)
      const next = (idx + delta + items.length) % items.length
      selectProject(items[next].id)
      const btn = tablistRef.current?.querySelector(
        `[data-project-id="${items[next].id}"]`,
      )
      if (btn instanceof HTMLElement) btn.focus({ preventScroll: true })
    },
    [activeId, items, selectProject],
  )

  // Deep-link + hash sync when scene becomes active
  useEffect(() => {
    if (!isActive) return
    const slug = getProjectSlugFromHash(window.location.hash)
    const id = resolveProjectId(slug)
    setActiveId(id)
    syncProjectHash(id)
  }, [isActive])

  // Browser back/forward between project slugs
  useEffect(() => {
    const onHash = () => {
      if (skipHashRead.current || !isActive) return
      const raw = (window.location.hash || '').replace(/^#/, '').toLowerCase()
      if (!raw.startsWith('projects')) return
      const slug = getProjectSlugFromHash(window.location.hash)
      const id = resolveProjectId(slug)
      if (activeIdRef.current !== id) {
        if (!reduced) setAnimKey((k) => k + 1)
        setActiveId(id)
        activeIdRef.current = id
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [isActive, reduced])

  // Center active mobile tab
  useEffect(() => {
    if (!isActive) return
    const btn = tablistRef.current?.querySelector(
      `[data-project-id="${activeId}"]`,
    )
    if (btn instanceof HTMLElement && window.matchMedia('(max-width: 1023px)').matches) {
      btn.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: reduced ? 'auto' : 'smooth',
      })
    }
  }, [activeId, isActive, reduced])

  // Arrow keys switch projects while this scene is active (scene nav skipped in hook)
  useEffect(() => {
    if (!isActive) return

    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return
      }

      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault()
        e.stopPropagation()
        const delta =
          e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 1
        stepProject(delta)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, stepProject])

  return (
    <div className="relative mx-auto flex h-svh min-h-0 w-full max-w-6xl flex-col overflow-hidden px-5 pt-20 pb-4 sm:px-8 lg:px-10">
      <header className="mb-3 shrink-0 lg:mb-4">
        <p className="font-mono mb-1 text-[12px] tracking-[0.18em] text-violet uppercase">
          Scene 03
        </p>
        <h2
          data-scene-heading
          className="text-metallic text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold tracking-[-0.03em]"
        >
          {projects.heading}
        </h2>
      </header>

      <div className="project-master flex min-h-0 flex-1 flex-col gap-3 lg:h-[80vh] lg:max-h-[calc(100svh-8.5rem)] lg:flex-row lg:items-stretch lg:gap-6 lg:self-center lg:w-full">
        <aside className="project-list-pane w-full shrink-0 lg:w-[34%] lg:self-center">
          <ProjectList
            items={items}
            activeId={active.id}
            onSelect={(id) => selectProject(id)}
            tablistRef={tablistRef}
            featuredLabel={projects.featuredLabel}
          />
        </aside>

        <div className="project-detail-pane relative min-h-0 flex-1 lg:w-[66%]">
          <div
            className="project-detail-glow pointer-events-none absolute -inset-3 -z-10 rounded-2xl opacity-70"
            aria-hidden="true"
          />
          <ProjectDetail
            project={active}
            reduced={reduced}
            animKey={animKey}
            featuredLabel={projects.featuredLabel}
            prevLabel={projects.prevProject}
            nextLabel={projects.nextProject}
            onPrev={() => stepProject(-1)}
            onNext={() => stepProject(1)}
          />
        </div>
      </div>

      <div className="mt-3 flex shrink-0 justify-end lg:mt-4">
        <PortalButton
          nextLabel={nextScene.label}
          onClick={onNext}
          variant="compact"
        />
      </div>
    </div>
  )
}
