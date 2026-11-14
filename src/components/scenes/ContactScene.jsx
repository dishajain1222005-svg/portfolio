import { contact, site } from '../../data/content'

export default function ContactScene() {
  return (
    <div className="relative mx-auto flex h-svh min-h-0 w-full max-w-5xl flex-col justify-center overflow-hidden px-5 pt-20 pb-8 sm:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
        <header>
          <p className="font-mono mb-1 text-[12px] tracking-[0.18em] text-violet uppercase">
            Scene 07
          </p>
          <h2
            data-scene-heading
            className="text-metallic text-[clamp(1.85rem,4.5vw,2.75rem)] font-semibold tracking-[-0.03em]"
          >
            {contact.heading}
          </h2>
          <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-muted">
            {contact.lead}
          </p>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-silver sm:text-[16px]">
            {contact.body}
          </p>
          {contact.closing ? (
            <p className="font-mono mt-5 text-[12px] tracking-wide text-muted">
              {contact.closing}
            </p>
          ) : null}
        </header>

        <div
          className="rounded-lg border border-white/10 bg-surface/60 px-5 py-5 sm:px-6 sm:py-6"
          aria-label="Contact links"
        >
          <p className="font-mono mb-2 text-[11px] tracking-[0.14em] text-violet uppercase">
            {contact.emailLabel}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="break-all text-[16px] font-medium text-silver-bright underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-offset-4 sm:text-[17px]"
          >
            {site.email}
          </a>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-violet px-5 text-[15px] font-medium text-white transition hover:brightness-110 focus-visible:outline-offset-4"
            >
              {contact.cta}
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono inline-flex min-h-11 items-center text-[13px] text-muted underline-offset-4 transition hover:text-silver-bright hover:underline focus-visible:outline-offset-4"
            >
              {contact.links.github}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono inline-flex min-h-11 items-center text-[13px] text-muted underline-offset-4 transition hover:text-silver-bright hover:underline focus-visible:outline-offset-4"
            >
              {contact.links.linkedin}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
