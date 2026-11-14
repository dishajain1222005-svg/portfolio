# Disha Jain — Portfolio

A personal portfolio built with React and Vite. It has a full-screen scene-based layout where each section of the site is its own scene — clicking empty space zooms to the next one, clicking the left third goes back.

**Live at:** [dishajain.dev](https://dishajain.dev) *(update this once deployed)*

---

## What's inside

**7 scenes, in order:**

1. **Hero** — intro with a portrait photo in a glowing ring, rotating role line, and links
2. **About** — short background, 4 stat tiles (SIH 1st place, GenCodeX 3rd, 11 test suites, 90%+ HTTP reduction)
3. **Experience** — KeilHQ internship (Jun–Aug 2026) as 5 floating orbs, each opening a detail panel
4. **Projects** — 5 projects as floating orbs (CampusConnect, SatQuery-AI, ZeroTrace, meshminds, Society Management App)
5. **Skills** — languages, databases, tools, and working style; plus awards and recognitions
6. **Beyond code** — Rangmanch (theatre society, Head of Creative Dept) and Advait (technical society)
7. **Contact** — email, LinkedIn, GitHub, and a message form that opens Gmail directly

---

## Tech stack

| Tool | Purpose |
|---|---|
| React 19 | UI |
| Vite 8 | Build tool |
| GSAP 3 | Scene zoom/blur transition animations |
| Tailwind CSS v4 | Utility styling |
| Vanilla CSS | Custom animations (orb float, burst, twinkle) |

No backend. No database. No external state library.

---

## Getting started

You need Node.js 18 or later.

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Project structure

```
src/
├── components/
│   ├── scenes/          # One file per scene (Hero, About, Experience, ...)
│   ├── projects/        # Orb and panel components for the Projects scene
│   ├── SceneManager.jsx # Renders all scenes, handles click-to-advance logic
│   ├── SceneShell.jsx   # Full-viewport section wrapper
│   ├── TopBar.jsx       # Navigation bar with back arrow and scene counter
│   ├── Orb.jsx          # White glowing orb component used in Experience + Projects
│   ├── OrbitRing.jsx    # SVG ellipse orbit behind the orbs
│   ├── SceneHeader.jsx  # "SCENE 0X ——" label + large title used by every scene
│   └── SpaceBackground.jsx  # Fixed full-screen space image background
├── hooks/
│   └── useSceneTransition.js  # GSAP zoom transitions, hash routing, keyboard nav
├── data/
│   └── content.js       # All copy in one place — edit text here, not in components
└── index.css            # Global styles and custom keyframe animations
public/
├── disha.jpg            # Portrait photo used in the Hero
└── space-bg.png         # Background image (space scene with planet horizon)
```

---

## Editing content

All text lives in `src/data/content.js`. To change anything — job title, project descriptions, skills, contact email — edit that file. The components read from it automatically.

The `beyond.activities` array has `highlights: []` arrays that are empty placeholders. Add your specific designs, events, or achievements there when ready.

---

## How navigation works

- **Click right side or centre** of any scene → next scene (zoom-out transition)
- **Click left third** → previous scene (zoom-in transition)
- **Click an orb** → burst animation → detail panel opens
- **Click backdrop / press Esc** → panel closes, orb re-forms
- **Arrow keys** → Left/Up goes back, Right/Down goes forward
- **URL hashes** → each scene has a hash (`#experience`, `#projects/campusconnect`, etc.) so deep links work

---

## Deployment

The site is a static Vite build. Run `npm run build` and deploy the `dist/` folder to any static host — Cloudflare Pages, Vercel, Netlify, or GitHub Pages all work.

For **Cloudflare Pages**: connect the repo, set build command to `npm run build`, output directory to `dist`.

---

## License

Personal portfolio — not intended as a template. All content (text, photo, project descriptions) belongs to Disha Jain.
