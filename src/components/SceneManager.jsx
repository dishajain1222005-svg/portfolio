import { useRef } from 'react'
import { scenes } from '../data/content'
import { useSceneTransition, hashToSceneIndex } from '../hooks/useSceneTransition'
import TopBar from './TopBar'
import SceneShell from './SceneShell'
import Hero from './Hero'
import AboutScene from './scenes/AboutScene'
import ProjectsScene from './scenes/ProjectsScene'
import ExperienceScene from './scenes/ExperienceScene'
import SkillsScene from './scenes/SkillsScene'
import BeyondScene from './scenes/BeyondScene'
import ContactScene from './scenes/ContactScene'

const initialIndex =
  typeof window !== 'undefined' ? hashToSceneIndex(window.location.hash) : 0

export default function SceneManager() {
  const sceneRefs = useRef([])

  const { activeIndex, isTransitioning, goTo, goNext, goPrev } =
    useSceneTransition({ sceneRefs })

  const contactIndex = scenes.findIndex((s) => s.id === 'contact')

  return (
    <div className="scene-root relative h-svh w-full overflow-hidden">
      <TopBar
        scenes={scenes}
        activeIndex={activeIndex}
        isTransitioning={isTransitioning}
        onNavigate={(index, opts) => goTo(index, opts)}
        onContact={(opts) => goTo(contactIndex, opts)}
      />

      <div className="relative h-full w-full" aria-live="polite">
        <SceneShell
          ref={(el) => {
            sceneRefs.current[0] = el
          }}
          id="hero"
          label={scenes[0].label}
          initiallyActive={initialIndex === 0}
        >
          <Hero onEnter={goNext} />
        </SceneShell>

        <SceneShell
          ref={(el) => {
            sceneRefs.current[1] = el
          }}
          id="about"
          label={scenes[1].label}
          initiallyActive={initialIndex === 1}
          showBack
          onBack={goPrev}
        >
          <AboutScene onNext={goNext} />
        </SceneShell>

        <SceneShell
          ref={(el) => {
            sceneRefs.current[2] = el
          }}
          id="projects"
          label={scenes[2].label}
          initiallyActive={initialIndex === 2}
          showBack
          onBack={goPrev}
          className="overflow-hidden"
        >
          <ProjectsScene
            onNext={goNext}
            isActive={activeIndex === 2}
          />
        </SceneShell>

        <SceneShell
          ref={(el) => {
            sceneRefs.current[3] = el
          }}
          id="experience"
          label={scenes[3].label}
          initiallyActive={initialIndex === 3}
          showBack
          onBack={goPrev}
          className="overflow-hidden"
        >
          <ExperienceScene onNext={goNext} />
        </SceneShell>

        <SceneShell
          ref={(el) => {
            sceneRefs.current[4] = el
          }}
          id="skills"
          label={scenes[4].label}
          initiallyActive={initialIndex === 4}
          showBack
          onBack={goPrev}
          className="overflow-hidden"
        >
          <SkillsScene onNext={goNext} />
        </SceneShell>

        <SceneShell
          ref={(el) => {
            sceneRefs.current[5] = el
          }}
          id="beyond"
          label={scenes[5].label}
          initiallyActive={initialIndex === 5}
          showBack
          onBack={goPrev}
          className="overflow-hidden"
        >
          <BeyondScene onNext={goNext} />
        </SceneShell>

        <SceneShell
          ref={(el) => {
            sceneRefs.current[6] = el
          }}
          id="contact"
          label={scenes[6].label}
          initiallyActive={initialIndex === 6}
          showBack
          onBack={goPrev}
          className="overflow-hidden"
        >
          <ContactScene />
        </SceneShell>
      </div>
    </div>
  )
}
