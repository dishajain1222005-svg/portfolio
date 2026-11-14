import { about } from '../../data/content'
import SceneHeader from '../SceneHeader'

export default function AboutScene() {
  return (
    <div className="relative h-full w-full overflow-y-auto">
      <SceneHeader number={2} title={about.heading} />

      <div
        className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 pb-12 sm:px-10"
        style={{ paddingTop: 'calc(66px + 160px)' }}
      >
        {/* Theme line */}
        <p
          className="mb-5 font-bold leading-tight"
          style={{ fontSize: 'clamp(18px, 2.4vw, 26px)', color: '#C4B5FD' }}
        >
          {about.theme}
        </p>

        {/* Lead + body */}
        <p
          className="mb-3 leading-relaxed"
          style={{ fontSize: 17, color: '#E9D5FF' }}
        >
          {about.lead}
        </p>
        <p
          className="mb-10 leading-relaxed"
          style={{ fontSize: 16, color: '#B9B0E0' }}
        >
          {about.body}
        </p>

        {/* Stats grid */}
        <ul
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          aria-label="Highlights"
        >
          {about.stats.map((stat) => (
            <li
              key={stat.id}
              className="rounded-2xl px-4 py-5"
              style={{
                background: 'rgba(124,92,255,0.08)',
                border: '1px solid rgba(167,139,250,0.25)',
              }}
            >
              <p
                className="mb-1 font-bold leading-none"
                style={{ fontSize: 'clamp(28px,4vw,38px)', color: '#fff' }}
              >
                {stat.value}
              </p>
              <p
                className="mt-2 font-semibold"
                style={{ fontSize: 14, color: '#C4B5FD' }}
              >
                {stat.label}
              </p>
              <p
                className="mt-1 leading-snug"
                style={{ fontSize: 12, color: '#B9B0E0' }}
              >
                {stat.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
