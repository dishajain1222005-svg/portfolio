/**
 * SpaceBackground — uses the provided space image as a full-screen fixed base,
 * with a subtle dark overlay so text stays readable on all scenes.
 * The image file must be at /public/space-bg.jpg.
 */
export default function SpaceBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {/* Base image — covers the full viewport, stays fixed while scenes scroll */}
      <img
        src="/space-bg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable="false"
        aria-hidden="true"
      />

      {/* Dark overlay so bright scenes don't wash out the image */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(5,3,20,0.38)' }}
      />

      {/* Extra vignette at the very top (behind the TopBar) */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{ background: 'linear-gradient(to bottom, rgba(5,3,20,0.6), transparent)' }}
      />
    </div>
  )
}
