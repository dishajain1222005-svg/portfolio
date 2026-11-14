import { useRef, useState, useEffect } from 'react'
import { scenes } from '../data/content'
import { useSceneTransition, hashToSceneIndex } from '../hooks/useSceneTransition'
import TopBar from './TopBar'
import SceneShell from './SceneShell'
import Hero from './Hero'
import AboutScene from './scenes/AboutScene'
import ExperienceScene from './scenes/ExperienceScene'
import ProjectsScene from './scenes/ProjectsScene'
import SkillsScene from './scenes/SkillsScene'
import BeyondScene from './scenes/BeyondScene'
import ContactScene from './scenes/ContactScene'

const initialIndex =
  typeof window !== 'undefined' ? hashToSceneIndex(window.location.hash) : 0

/** Returns true if the element (or any ancestor up to the scene root) is
 *  something the user intentionally clicked on (button, link, form field,
 *  an open panel/backdrop, the advance-cue, or the TopBar).
 *  Clicking the bubble GROUP CONTAINER or the scene content wrapper is NOT
 *  interactive — only an actual bubble button is.
 */
function isInteractive(el, root) {
  let node = el
  while (node && node !== root) {
    const tag = node.tagName?.toLowerCase()

    // Real interactive elements
    if (tag === 'button' || tag === 'a' || tag === 'input' ||
        tag === 'textarea' || tag === 'select') return true

    const role = node.getAttribute?.('role')
    if (role === 'button' || role === 'dialog') return true

    // Open panel backdrop — clicking it should close, not advance
    if (node.dataset?.backdrop != null) return true

    // The advance-cue handles its own click; don't double-advance
    if (node.dataset?.advanceCue != null) return true

    // TopBar is interactive
    if (node.tagName?.toLowerCase() === 'header') return true

    node = node.parentElement
  }
  return false
}

export default function SceneManager() {
  const sceneRefs = useRef([])
  const rootRef   = useRef(null)

  const {
    activeIndex, isTransitioning,
    goTo, goNext, goPrev,
    muted, toggleMute,
  } = useSceneTransition({ sceneRefs })

  const contactIndex = scenes.findIndex((s) => s.id === 'contact')
  const heroIndex    = 0

  const [panelOpen, setPanelOpen] = useState(false)
  const panelOpenRef = useRef(false)
  useEffect(() => { panelOpenRef.current = panelOpen }, [panelOpen])

  // Track pointerdown coords to detect drags
  const downRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const onDown = (e) => {
      downRef.current = { x: e.clientX, y: e.clientY }
    }

    const onUp = (e) => {
      // Drag guard: >8px movement = not a tap
      const dx = e.clientX - downRef.current.x
      const dy = e.clientY - downRef.current.y
      if (Math.hypot(dx, dy) > 8) return

      // If the click landed on something interactive, let it handle itself
      const activeShell = sceneRefs.current[activeIndex]
      if (!activeShell) return
      if (isInteractive(e.target, activeShell)) return

      // Panel open: close it on empty-space click, don't advance
      if (panelOpenRef.current) {
        setPanelOpen(false)
        return
      }

      if (isTransitioning) return

      // Left third → go back; middle + right → go forward
      const leftThird = window.innerWidth / 3
      if (e.clientX < leftThird) {
        goPrev({ originX: e.clientX, originY: e.clientY })
      } else {
        goNext({ originX: e.clientX, originY: e.clientY })
      }
    }

    root.addEventListener('pointerdown', onDown)
    root.addEventListener('pointerup', onUp)
    return () => {
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('pointerup', onUp)
    }
  }, [activeIndex, isTransitioning, goNext])

  return (
    <div ref={rootRef} className="scene-root relative h-svh w-full overflow-hidden">
      <TopBar
        scenes={scenes}
        activeIndex={activeIndex}
        isTransitioning={isTransitioning}
        onNavigate={(index, opts) => goTo(index, opts)}
        onContact={(opts) => goTo(contactIndex, opts)}
        muted={muted}
        onToggleMute={toggleMute}
        showBack={activeIndex > 0}
        onBack={(opts) => goPrev(opts)}
      />

      <div className="relative h-full w-full" aria-live="polite">
        {/* 0 — Hero */}
        <SceneShell ref={(el) => { sceneRefs.current[0] = el }}
          id="hero" label={scenes[0].label} initiallyActive={initialIndex === 0}>
          <Hero />
        </SceneShell>

        {/* 1 — About */}
        <SceneShell ref={(el) => { sceneRefs.current[1] = el }}
          id="about" label={scenes[1].label} initiallyActive={initialIndex === 1}>
          <AboutScene />
        </SceneShell>

        {/* 2 — Experience */}
        <SceneShell ref={(el) => { sceneRefs.current[2] = el }}
          id="experience" label={scenes[2].label} initiallyActive={initialIndex === 2}
          className="overflow-hidden">
          <ExperienceScene isActive={activeIndex === 2} onPanelChange={setPanelOpen} />
        </SceneShell>

        {/* 3 — Projects */}
        <SceneShell ref={(el) => { sceneRefs.current[3] = el }}
          id="projects" label={scenes[3].label} initiallyActive={initialIndex === 3}
          className="overflow-hidden">
          <ProjectsScene isActive={activeIndex === 3} onPanelChange={setPanelOpen} />
        </SceneShell>

        {/* 4 — Skills */}
        <SceneShell ref={(el) => { sceneRefs.current[4] = el }}
          id="skills" label={scenes[4].label} initiallyActive={initialIndex === 4}
          className="overflow-hidden">
          <SkillsScene />
        </SceneShell>

        {/* 5 — Beyond code */}
        <SceneShell ref={(el) => { sceneRefs.current[5] = el }}
          id="beyond" label={scenes[5].label} initiallyActive={initialIndex === 5}
          className="overflow-hidden">
          <BeyondScene />
        </SceneShell>

        {/* 6 — Contact */}
        <SceneShell ref={(el) => { sceneRefs.current[6] = el }}
          id="contact" label={scenes[6].label} initiallyActive={initialIndex === 6}
          className="overflow-hidden">
          <ContactScene onBackToHero={(opts) => goTo(heroIndex, { ...opts, reverse: true })} />
        </SceneShell>
      </div>
    </div>
  )
}
