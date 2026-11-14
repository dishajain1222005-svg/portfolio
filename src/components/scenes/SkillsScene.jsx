import { skills, scenes } from '../../data/content'
import PortalButton from '../PortalButton'
import SkillsConstellation from '../SkillsConstellation'

export default function SkillsScene({ onNext }) {
  const next = scenes[5]
  const awards = skills.awards ?? []

  return (
    <div className="relative mx-auto flex h-svh min-h-0 w-full max-w-6xl flex-col overflow-hidden px-5 pt-20 pb-4 sm:px-8 lg:px-10">
      <header className="relative z-10 mb-3 shrink-0 lg:mb-4">
        <p className="font-mono mb-1 text-[12px] tracking-[0.18em] text-violet uppercase">
          Scene 05
        </p>
        <h2
          data-scene-heading
          className="text-metallic text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold tracking-[-0.03em]"
        >
          {skills.heading}
        </h2>
        <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-muted">
          {skills.lead}
        </p>
      </header>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-2">
        <div className="skills-constellation-wrap relative mb-6 overflow-hidden rounded-xl border border-white/8 bg-surface/30 px-4 py-5 sm:px-5 sm:py-6">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <SkillsConstellation className="opacity-80" />
          </div>

          <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {skills.groups.map((group) => (
              <div key={group.id}>
                <h3 className="font-mono mb-3 text-[12px] tracking-[0.16em] text-violet uppercase">
                  {group.title}
                </h3>
                <ul className="flex flex-wrap gap-2" aria-label={group.title}>
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="skill-chip rounded-md border border-white/12 bg-bg/55 px-2.5 py-1.5 text-[14px] text-silver-bright backdrop-blur-[2px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {awards.length > 0 && (
          <section aria-labelledby="skills-awards-heading">
            <h3
              id="skills-awards-heading"
              className="font-mono mb-3 text-[12px] tracking-[0.16em] text-violet uppercase"
            >
              {skills.awardsHeading}
            </h3>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {awards.map((award) => (
                <li
                  key={award.id}
                  className="award-card rounded-lg border border-white/10 bg-surface/55 px-3.5 py-3"
                >
                  <p className="font-mono mb-1 text-[11px] tracking-[0.14em] text-violet uppercase">
                    {award.place ?? award.detail ?? 'Award'}
                  </p>
                  <p className="text-[14px] font-medium leading-snug text-silver-bright">
                    {award.title}
                  </p>
                  {award.place && award.detail ? (
                    <p className="mt-1 text-[12px] leading-snug text-muted">
                      {award.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="relative z-10 mt-3 flex shrink-0 justify-end">
        <PortalButton
          nextLabel={next.label}
          onClick={onNext}
          variant="compact"
        />
      </div>
    </div>
  )
}
