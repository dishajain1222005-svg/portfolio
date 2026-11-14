import { useEffect } from 'react'
import SpaceBackground from './components/SpaceBackground'
import SceneManager from './components/SceneManager'

function getPerformanceTier() {
  const cores = navigator?.hardwareConcurrency ?? 4
  if (cores < 4)  return 'low'
  if (cores <= 5) return 'mid'
  return 'high'
}

export default function App() {
  useEffect(() => {
    document.documentElement.dataset.perf = getPerformanceTier()
  }, [])

  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:text-white"
        style={{ background: '#7C5CFF' }}
      >
        Skip to content
      </a>

      {/* Space background — fixed, below everything */}
      <SpaceBackground />

      {/* Scenes */}
      <main className="relative z-10">
        <SceneManager />
      </main>
    </>
  )
}
