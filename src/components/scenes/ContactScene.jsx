import { useRef, useState } from 'react'
import { contact, site } from '../../data/content'
import SceneHeader, { HeaderRow } from '../SceneHeader'

function ContactForm() {
  const nameRef  = useRef(null)
  const emailRef = useRef(null)
  const msgRef   = useRef(null)
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const name      = nameRef.current?.value.trim() ?? ''
    const fromEmail = emailRef.current?.value.trim() ?? ''
    const message   = msgRef.current?.value.trim() ?? ''

    // Build the full body including sender details
    const fullBody = `${message}\n\n—\n${name}${fromEmail ? `\n${fromEmail}` : ''}`

    // Gmail compose URL — works in any browser, always opens Gmail
    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(site.email)}` +
      `&su=${encodeURIComponent(`Portfolio message${name ? ` from ${name}` : ''}`)}` +
      `&body=${encodeURIComponent(fullBody)}`

    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const inputStyle = {
    width: '100%',
    minHeight: '2.6rem',
    borderRadius: 10,
    border: '1px solid rgba(167,139,250,0.3)',
    background: 'rgba(124,92,255,0.07)',
    padding: '0.55rem 0.85rem',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  }

  const labelStyle = { fontSize: 11, color: '#A78BFA', letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'monospace' }

  if (sent) {
    return (
      <div
        role="status"
        className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl px-5 py-8 text-center"
        style={{ border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(124,92,255,0.1)' }}
      >
        <span className="text-[28px]" aria-hidden="true">✉️</span>
        <p style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{contact.form.successMessage}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-1 font-mono underline-offset-4 hover:underline focus-visible:outline-offset-4"
          style={{ fontSize: 12, color: '#B9B0E0' }}
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Send a message" className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span style={labelStyle}>Name</span>
          <input ref={nameRef} type="text" name="name" autoComplete="name"
            placeholder={contact.form.namePlaceholder} style={inputStyle}/>
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={labelStyle}>Your email</span>
          <input ref={emailRef} type="email" name="email" autoComplete="email"
            placeholder={contact.form.emailPlaceholder} style={inputStyle}/>
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span style={labelStyle}>Message</span>
        <textarea ref={msgRef} name="message" rows={4} required
          placeholder={contact.form.messagePlaceholder}
          style={{ ...inputStyle, resize: 'none' }}/>
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-full font-bold text-white transition focus-visible:outline-offset-4"
        style={{
          fontSize: 15,
          background: 'linear-gradient(135deg,#7C5CFF,#A78BFA)',
          boxShadow: '0 0 18px rgba(124,92,255,0.4)',
        }}
      >
        {contact.form.submitLabel}
      </button>
    </form>
  )
}

export default function ContactScene({ onBackToHero }) {
  return (
    <div className="relative h-full w-full overflow-y-auto">
      <SceneHeader number={7} title={contact.heading}>
        <HeaderRow
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          }
          text="Open to internships and collaborations"
        />
      </SceneHeader>

      <div
        className="mx-auto w-full max-w-5xl px-6 pb-12 sm:px-10"
        style={{ paddingTop: 'calc(66px + 170px)' }}
      >
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">

          {/* Left — links */}
          <div className="flex flex-col gap-6">
            {/* Email */}
            <div>
              <p className="font-mono mb-2 uppercase tracking-[0.16em]" style={{ fontSize: 11, color: '#A78BFA' }}>
                {contact.emailLabel}
              </p>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all font-semibold underline-offset-4 transition hover:underline focus-visible:outline-offset-4"
                style={{ fontSize: 'clamp(15px,2.4vw,20px)', color: '#fff' }}
              >
                {site.email}
              </a>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent('Hello from your portfolio')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full px-5 font-bold text-white transition focus-visible:outline-offset-4"
                style={{ fontSize: 14, background: 'linear-gradient(135deg,#7C5CFF,#A78BFA)', boxShadow: '0 0 16px rgba(124,92,255,0.4)' }}
              >
                {contact.cta}
              </a>
              <a
                href={site.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 transition focus-visible:outline-offset-4"
                style={{ fontSize: 13, border: '1px solid rgba(167,139,250,0.35)', color: '#E9D5FF', background: 'rgba(124,92,255,0.1)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                {contact.links.github}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={site.linkedin} target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 transition focus-visible:outline-offset-4"
                style={{ fontSize: 13, border: '1px solid rgba(167,139,250,0.35)', color: '#E9D5FF', background: 'rgba(124,92,255,0.1)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                {contact.links.linkedin}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            {contact.closing && (
              <p className="font-mono" style={{ fontSize: 12, color: '#B9B0E0' }}>
                {contact.closing}
              </p>
            )}

            {/* Back to start */}
            <button
              type="button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                onBackToHero?.({ originX: rect.left + rect.width/2, originY: rect.top + rect.height/2, reverse: true })
              }}
              className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2.5 font-medium text-white transition focus-visible:outline-offset-4"
              style={{ fontSize: 13, border: '1px solid rgba(167,139,250,0.35)', background: 'rgba(124,92,255,0.1)' }}
              aria-label="Loop back to the beginning"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12h18M10 5l-7 7 7 7"/>
              </svg>
              {contact.portalBackLabel}
            </button>
          </div>

          {/* Right — form */}
          <div
            className="rounded-2xl px-6 py-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(167,139,250,0.2)' }}
          >
            <p className="font-mono mb-4 uppercase tracking-[0.16em]" style={{ fontSize: 11, color: '#A78BFA' }}>
              Send a message
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
