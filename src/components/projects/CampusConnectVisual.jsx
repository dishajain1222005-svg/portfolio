/**
 * Animated Wi-Fi rings + LAN device sketch for CampusConnect.
 */
export default function CampusConnectVisual() {
  return (
    <div
      className="project-visual-wifi relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative mb-3 flex h-[58%] w-full max-w-[280px] items-center justify-center">
        <span className="project-wifi-dot absolute z-10 size-2.5 rounded-full bg-violet" />
        <span className="project-wifi-ring project-wifi-ring--1 absolute rounded-full border border-violet/50" />
        <span className="project-wifi-ring project-wifi-ring--2 absolute rounded-full border border-violet/35" />
        <span className="project-wifi-ring project-wifi-ring--3 absolute rounded-full border border-violet/20" />
      </div>

      <span className="font-mono mb-4 rounded-full border border-violet/40 bg-violet/15 px-3 py-1 text-[11px] tracking-[0.12em] text-silver-bright uppercase">
        No internet needed
      </span>

      <svg
        className="text-silver/70"
        width="120"
        height="36"
        viewBox="0 0 120 36"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="38"
          y="8"
          width="44"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M32 28h56"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <rect
          x="8"
          y="12"
          width="12"
          height="18"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <rect
          x="100"
          y="12"
          width="12"
          height="18"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.1"
        />
      </svg>
    </div>
  )
}
