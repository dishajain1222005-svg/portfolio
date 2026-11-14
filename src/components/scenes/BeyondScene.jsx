import { beyond, scenes } from '../../data/content'
import PortalButton from '../PortalButton'

export default function BeyondScene({ onNext }) {
  const next = scenes[6]
  const notes = beyond.notes ?? []

  return (
    <div className="relative mx-auto flex h-svh min-h-0 w-full max-w-4xl flex-col overflow-hidden px-5 pt-20 pb-4 sm:px-8">
      <header className="mb-4 shrink-0 sm:mb-5">
        <p className="font-mono mb-1 text-[12px] tracking-[0.18em] text-violet uppercase">
          Scene 06
        </p>
        <h2
          data-scene-heading
          className="text-metallic text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold tracking-[-0.03em]"
        >
          {beyond.heading}
        </h2>
        <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-muted">
          {beyond.lead}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-2">
        <div className="mb-6 rounded-lg border border-white/10 bg-surface/60 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[18px] font-medium text-silver-bright sm:text-[20px]">
              {beyond.role}
            </h3>
            <span className="font-mono text-[12px] tracking-wide text-violet">
              {beyond.org}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted sm:text-[16px]">
            {beyond.body}
          </p>
        </div>

        {notes.length > 0 && (
          <ul className="space-y-4" aria-label="Beyond code highlights">
            {notes.map((note) => (
              <li
                key={note.id}
                className="border-l-2 border-violet/50 pl-4"
              >
                <p className="font-mono text-[11px] tracking-[0.14em] text-violet uppercase">
                  {note.label}
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-silver sm:text-[16px]">
                  {note.detail}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 flex shrink-0 justify-end">
        <PortalButton
          nextLabel={next.label}
          onClick={onNext}
          variant="compact"
        />
      </div>
    </div>
  )
}
