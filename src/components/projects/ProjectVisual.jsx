import CampusConnectVisual from './CampusConnectVisual'

/**
 * Detail-panel visual: Wi-Fi scene, monogram, or future screenshot via `image`.
 */
export default function ProjectVisual({ project }) {
  if (project.image) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={project.image}
          alt=""
          className="h-full w-full object-cover object-top"
        />
      </div>
    )
  }

  if (project.visual === 'wifi') {
    return <CampusConnectVisual />
  }

  return (
    <div
      className="project-visual-monogram relative flex h-full w-full items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <span className="project-monogram-mark pointer-events-none select-none">
        {project.monogram}
      </span>
    </div>
  )
}
