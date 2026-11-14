import { useEffect, useId, useState } from 'react'
import { site } from '../data/content'

export default function TopBar({
  scenes,
  activeIndex,
  onNavigate,
  onContact,
  isTransitioning,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const progress = `${activeIndex + 1}/${scenes.length}`

  useEffect(() => {
    setMenuOpen(false)
  }, [activeIndex])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopImmediatePropagation()
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [menuOpen])

  function handleNav(index, e) {
    if (isTransitioning) return
    const rect = e.currentTarget.getBoundingClientRect()
    onNavigate(index, {
      originX: rect.left + rect.width / 2,
      originY: rect.top + rect.height / 2,
      reverse: index < activeIndex,
    })
    setMenuOpen(false)
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            handleNav(0, e)
          }}
          className="font-mono shrink-0 text-[12px] tracking-[0.14em] text-violet uppercase"
        >
          {site.name}
        </a>

        <nav
          className="ml-2 hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Scenes"
        >
          {scenes.map((scene, i) => {
            const active = i === activeIndex
            return (
              <button
                key={scene.id}
                type="button"
                disabled={isTransitioning}
                onClick={(e) => handleNav(i, e)}
                aria-current={active ? 'true' : undefined}
                className={`rounded-md px-2.5 py-1.5 text-[13px] transition focus-visible:outline-offset-2 ${
                  active
                    ? 'text-silver-bright'
                    : 'text-muted hover:text-silver-bright'
                }`}
              >
                {scene.label}
              </button>
            )
          })}
        </nav>

        <p
          className="font-mono ml-auto text-[12px] tracking-wider text-muted tabular-nums lg:ml-0"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="sr-only">Scene </span>
          {progress}
        </p>

        <button
          type="button"
          disabled={isTransitioning}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            onContact({
              originX: rect.left + rect.width / 2,
              originY: rect.top + rect.height / 2,
            })
          }}
          className="hidden min-h-10 items-center rounded-md bg-violet px-3.5 text-[13px] font-medium text-white transition hover:brightness-110 focus-visible:outline-offset-4 sm:inline-flex"
        >
          Contact me
        </button>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/10 text-silver-bright lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          id={menuId}
          className="pointer-events-auto border-t border-white/10 bg-bg/95 px-4 py-4 backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Scenes mobile">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                type="button"
                disabled={isTransitioning}
                onClick={(e) => handleNav(i, e)}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={`rounded-md px-3 py-3 text-left text-[15px] ${
                  i === activeIndex
                    ? 'bg-violet/15 text-silver-bright'
                    : 'text-muted'
                }`}
              >
                {scene.label}
              </button>
            ))}
            <button
              type="button"
              disabled={isTransitioning}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                onContact({
                  originX: rect.left + rect.width / 2,
                  originY: rect.top + rect.height / 2,
                })
                setMenuOpen(false)
              }}
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-violet px-4 text-[15px] font-medium text-white"
            >
              Contact me
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
