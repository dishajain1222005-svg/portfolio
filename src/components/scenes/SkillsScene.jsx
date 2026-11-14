import { skills } from '../../data/content'
import SceneHeader, { HeaderRow } from '../SceneHeader'

export default function SkillsScene() {
  const awards = skills.awards ?? []

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <SceneHeader number={5} title={skills.heading}>
        <HeaderRow
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
          }
          text="Tools I use"
        />
      </SceneHeader>

      <div
        className="mx-auto w-full max-w-5xl px-6 pb-12 sm:px-10"
        style={{ paddingTop: 'calc(66px + 160px)' }}
      >
        {/* Skill groups */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.groups.map((group) => (
            <div key={group.id}>
              <h3
                className="font-mono mb-3 uppercase tracking-[0.2em]"
                style={{ fontSize: 11, color: '#A78BFA' }}
              >
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2" aria-label={group.title}>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full px-3 py-1.5 font-medium"
                    style={{
                      fontSize: 13,
                      color: '#E9D5FF',
                      background: 'rgba(124,92,255,0.12)',
                      border: '1px solid rgba(167,139,250,0.3)',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Awards */}
        {awards.length > 0 && (
          <section aria-labelledby="skills-awards-heading">
            <h3
              id="skills-awards-heading"
              className="font-mono mb-4 uppercase tracking-[0.2em]"
              style={{ fontSize: 11, color: '#A78BFA' }}
            >
              {skills.awardsHeading}
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {awards.map((award) => (
                <li
                  key={award.id}
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: 'rgba(124,92,255,0.08)',
                    border: '1px solid rgba(167,139,250,0.2)',
                  }}
                >
                  <p
                    className="font-mono mb-1 uppercase tracking-widest"
                    style={{ fontSize: 10, color: '#A78BFA' }}
                  >
                    {award.place ?? award.detail ?? 'Award'}
                  </p>
                  <p className="font-semibold leading-snug" style={{ fontSize: 14, color: '#fff' }}>
                    {award.title}
                  </p>
                  {award.place && award.detail && (
                    <p className="mt-1 leading-snug" style={{ fontSize: 12, color: '#B9B0E0' }}>
                      {award.detail}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
