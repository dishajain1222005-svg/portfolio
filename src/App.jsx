import ParticleNetwork from './components/ParticleNetwork'
import SceneManager from './components/SceneManager'

export default function App() {
  return (
    <>
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-violet focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <ParticleNetwork />
      <main className="relative z-10">
        <SceneManager />
      </main>
    </>
  )
}
