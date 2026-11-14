import { about, scenes } from '../../data/content'
import PortalButton from '../PortalButton'

export default function AboutScene({ onNext }) {
  const next = scenes[2]

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-mono mb-3 text-[12px] tracking-[0.18em] text-violet uppercase">
        Scene 02
      </p>
      <h2
        data-scene-heading
        className="text-metallic mb-3 text-[clamp(2.2rem,6vw,3.5rem)] font-semibold tracking-[-0.03em]"
      >
        {about.heading}
      </h2>
      <p className="font-serif mb-4 text-[clamp(1.25rem,2.6vw,1.75rem)] italic text-silver-bright">
        {about.theme}
      </p>
      <p className="mb-3 max-w-2xl text-[17px] leading-relaxed text-silver">
        {about.lead}
      </p>
      <p className="mb-10 max-w-2xl text-[17px] leading-relaxed text-muted">
        {about.body}
      </p>

      <ul
        className="mb-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Highlights"
      >
        {about.stats.map((stat) => (
          <li key={stat.id} className="border-t border-white/12 pt-4">
            <p className="text-metallic mb-1 text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-[-0.03em] leading-none">
              {stat.value}
            </p>
            <p className="mt-2 text-[15px] font-medium text-silver-bright">
              {stat.label}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-muted">
              {stat.detail}
            </p>
          </li>
        ))}
      </ul>

      <PortalButton nextLabel={next.label} onClick={onNext} />
    </div>
  )
}
