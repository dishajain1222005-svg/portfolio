/**
 * Glowing portal CTA that advances to the next named scene.
 * @param {'default' | 'compact'} [variant]
 */
export default function PortalButton({
  nextLabel,
  onClick,
  className = '',
  variant = 'default',
}) {
  const compact = variant === 'compact'
  const label = compact ? `Next: ${nextLabel}` : nextLabel

  return (
    <button
      type="button"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onClick?.({
          originX: rect.left + rect.width / 2,
          originY: rect.top + rect.height / 2,
        })
      }}
      className={`portal-button group relative inline-flex items-center justify-center gap-2 rounded-md font-medium text-white transition focus-visible:outline-offset-4 ${
        compact
          ? 'min-h-10 px-3.5 text-[13px]'
          : 'min-h-12 px-6 text-[15px]'
      } ${className}`}
      aria-label={`Enter next scene: ${nextLabel}`}
    >
      <span
        className="portal-glow pointer-events-none absolute inset-0 -z-10 rounded-md"
        aria-hidden="true"
      />
      <span className="relative">{label}</span>
      <svg
        className="relative transition-transform group-hover:translate-x-0.5"
        width={compact ? 14 : 16}
        height={compact ? 14 : 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </button>
  )
}
