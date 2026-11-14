export const site = {
  name: 'Disha Jain',
  title: 'Disha Jain — Full-stack developer',
  email: 'dishajain1222005@gmail.com',
  location: 'Delhi, India',
  github: 'https://github.com/dishajain1222005-svg',
  linkedin: 'https://linkedin.com/in/disha-jain-00b19737b',
}

/** Scene order for navigation, hashes, and progress. */
export const scenes = [
  { id: 'hero',       label: 'Hero',        hash: 'hero' },
  { id: 'about',      label: 'About',       hash: 'about' },
  { id: 'experience', label: 'Experience',  hash: 'experience' },
  { id: 'projects',   label: 'Projects',    hash: 'projects' },
  { id: 'skills',     label: 'Skills',      hash: 'skills' },
  { id: 'beyond',     label: 'Beyond code', hash: 'beyond' },
  { id: 'contact',    label: 'Contact',     hash: 'contact' },
]

export const hero = {
  headline: "HI, I'M DISHA",
  roles: [
    'an AI-powered software engineer',
    'a builder of tested, reviewed code',
    'a creative head at Rangmanch theatre society',
  ],
  intro:
    'Third-year B.Tech CSE at VIPS-TC, GGSIPU (8.85 CGPA, expected 2028). I direct AI coding assistants, then review, test, and ship what they produce.',
  portrait: {
    src: '/disha.jpg',
    alt: 'Portrait of Disha Jain',
  },
  chips: [
    { id: 'py', label: 'Py' },
    { id: 'ts', label: 'TS' },
    { id: 're', label: 'Re' },
    { id: 'sql', label: 'SQL' },
    { id: 'git', label: 'Git' },
  ],
  cta: {
    enter: 'Enter',
    email: 'Email me',
  },
  links: {
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
}

export const about = {
  heading: 'About',
  theme: 'Building with AI, shipping with discipline',
  lead: 'I direct AI coding assistants, then review, test, and own what ships.',
  body: 'Third-year B.Tech CSE at VIPS-TC, GGSIPU (8.85 CGPA). At KeilHQ I wrote requirements, reviewed AI-generated code, and merged through PRs in a real React/TypeScript/Express codebase — with tests, migrations, and measurable wins.',
  stats: [
    {
      id: 'sih',
      value: '1st',
      label: 'SIH 2025',
      detail: 'VIPS-TC internal Smart India Hackathon · Team ZeroTrace',
    },
    {
      id: 'gencode',
      value: '3rd',
      label: 'GenCodeX AI Hackathon 2026',
      detail: 'GenCatalyst · JIMS Greater Noida',
    },
    {
      id: 'tests',
      value: '11',
      label: 'test suites at KeilHQ',
      detail: 'Vitest & React Testing Library',
    },
    {
      id: 'chat',
      value: '90%+',
      label: 'less chat HTTP overhead',
      detail: 'Batch mark-as-read synced over Socket.IO',
    },
  ],
}

export const projects = {
  heading: 'Projects',
  lead: 'Selected builds — pick one to explore stack, facts, and links.',
  featuredLabel: 'Featured',
  prevProject: 'Previous project',
  nextProject: 'Next project',
  items: [
    {
      id: 'campusconnect',
      slug: 'campusconnect',
      title: 'CampusConnect',
      featured: true,
      tagline: 'Offline campus Wi-Fi platform',
      stackLabel: 'Python · Flask',
      blurb:
        'Offline LAN platform for materials, assignments, notices, and timed quizzes over Wi-Fi.',
      detail:
        'Serves course materials, assignments, notices, and timed quizzes on a local network — no internet required. Quiz answers are scored server-side. Built with Flask 3 and SQLAlchemy on SQLite, with 48 passing tests covering the critical flows.',
      tags: ['Python', 'Flask 3', 'SQLAlchemy', 'SQLite'],
      facts: [
        '48 tests passing',
        '0 CDN dependencies',
        '~50 concurrent users',
      ],
      visual: 'wifi',
      monogram: 'CC',
      image: null,
      github: 'https://github.com/dishajain1222005-svg/CampusConnect',
    },
    {
      id: 'satquery-ai',
      slug: 'satquery-ai',
      title: 'SatQuery-AI',
      featured: false,
      tagline: 'Ask satellites in plain English',
      stackLabel: 'Vite · Tailwind',
      blurb:
        'Agentic Earth Observation UI for natural-language queries on satellite imagery.',
      detail:
        'Team project in development: an agentic Earth Observation platform that answers natural-language questions about satellite images. Built the interface collaboratively via Git/GitHub with Vite and Tailwind CSS.',
      tags: ['Vite', 'Tailwind', 'Team'],
      facts: ['NL query UI', 'EO imagery focus', 'Git collaboration'],
      visual: 'monogram',
      monogram: 'SQ',
      image: null,
      github: 'https://github.com/dishajain1222005-svg/SatQuery-AI',
    },
    {
      id: 'zerotrace',
      slug: 'zerotrace',
      title: 'ZeroTrace',
      featured: false,
      tagline: 'Secure wipe with certificates',
      stackLabel: 'Python · PyQt5',
      blurb:
        'Secure data-wiping desktop tool with tamper-proof wipe certificates.',
      detail:
        'NIST 800-88 / DoD 5220.22-M compliant wiping with PDF/JSON certificates. Built the PyQt5 UI (dashboard, wipe screens, certificate export) and integrated teammates\' wiping modules. 1st place at VIPS-TC internal SIH 2025.',
      tags: ['Python', 'PyQt5'],
      facts: ['SIH 2025 1st', 'NIST / DoD wipe', 'PDF certificates'],
      visual: 'monogram',
      monogram: 'ZT',
      image: null,
      github: 'https://github.com/dishajain1222005-svg/ZeroTrace',
    },
    {
      id: 'meshminds',
      slug: 'meshminds',
      title: 'meshminds',
      featured: false,
      tagline: 'GGSIPU notes, live on the web',
      stackLabel: 'Firebase · Pages',
      blurb:
        'Study-notes web app for GGSIPU students — notes, syllabus, and papers by branch.',
      detail:
        'Designed, built, and deployed on Cloudflare Pages. Students browse notes, syllabus, and previous-year papers by branch and course. Admin panel for uploads; Firebase Auth and Firestore with security rules.',
      tags: ['HTML', 'CSS', 'JS', 'Firebase'],
      facts: ['Cloudflare Pages', 'Firebase Auth', 'Admin uploads'],
      visual: 'monogram',
      monogram: 'mm',
      image: null,
      github: 'https://github.com/dishajain1222005-svg/meshminds',
      live: 'https://meshmind.pages.dev',
    },
    {
      id: 'society-management',
      slug: 'society-management',
      title: 'Society Management App',
      featured: false,
      tagline: 'Admin + resident society ops',
      stackLabel: 'JS · SQL',
      blurb:
        'Admin and resident sides for funds, parking reservations, and resident records.',
      detail:
        'Web app with separate admin and user flows: fund payments and spending records, parking reservation, and resident details. Built with HTML, CSS, JavaScript, and SQL.',
      tags: ['HTML', 'CSS', 'JS', 'SQL'],
      facts: ['Dual portals', 'Funds tracking', 'Parking booking'],
      visual: 'monogram',
      monogram: 'SM',
      image: null,
      github: 'https://github.com/dishajain1222005-svg/society-management-app',
    },
  ],
}

export const experience = {
  heading: 'Experience',
  lead: 'One internship, several shipped wins — click a milestone to explore.',
  items: [
    {
      id: 'keilhq',
      role: 'AI Intern',
      org: 'KeilHQ (Quild)',
      period: 'Jun–Aug 2026',
      summary:
        'Directed an AI coding assistant to ship full-stack features, then reviewed, tested, and debugged what landed in production.',
      stack: [
        'React 19',
        'TypeScript',
        'Express 5',
        'PostgreSQL',
        'Socket.IO',
      ],
      milestones: [
        {
          id: 'ship',
          label: 'Ship & Review',
          blurb: 'Reviewed changes, fixed feedback, and shipped updates.',
          detail:
            'Shipped full-stack features with an AI coding assistant (React 19, TypeScript, Express 5, PostgreSQL, Socket.IO) and reviewed, tested and debugged them.',
          icon: 'rocket',
        },
        {
          id: 'summaries',
          label: 'Meeting Summaries',
          blurb: 'Converted discussions into clear, concise summaries.',
          detail:
            'Meeting-to-document summaries cut write-ups from about 5–10 minutes to under 5 seconds.',
          icon: 'document',
        },
        {
          id: 'batch-read',
          label: 'Batch Mark-as-Read',
          blurb: 'Worked on bulk actions for better message management.',
          detail:
            'Batch mark-as-read cut chat HTTP overhead by over 90%.',
          icon: 'bolt',
        },
        {
          id: 'product',
          label: 'Product Surfaces',
          blurb: 'Explored and analyzed core product interfaces.',
          detail:
            '@mentions, S3 file manager, and a redesigned Projects home.',
          icon: 'layers',
        },
        {
          id: 'quality',
          label: 'Tests & Specs',
          blurb: 'Wrote test cases and contributed to feature specifications.',
          detail:
            '11 test suites and a 9-document notification spec.',
          icon: 'check',
        },
      ],
    },
  ],
}

export const skills = {
  heading: 'Skills',
  lead: 'Languages, systems, tools, and how I work — plus awards along the way.',
  groups: [
    {
      id: 'languages',
      title: 'Languages',
      items: ['Python', 'SQL', 'C', 'C++', 'Java'],
    },
    {
      id: 'databases',
      title: 'Databases',
      items: ['MySQL', 'Firebase (Firestore)'],
    },
    {
      id: 'tools',
      title: 'Testing & Tools',
      items: [
        'React Testing Library',
        'Git',
        'GitHub',
        'VS Code',
        'MySQL Workbench',
        'GitHub Actions',
        'Cloudflare',
      ],
    },
    {
      id: 'areas',
      title: 'Areas',
      items: [
        'Directing AI coding assistants',
        'Reviewing and debugging AI-generated code',
        'Writing specs and prompts',
        'Database migrations',
        'Real-time systems',
      ],
    },
  ],
  awardsHeading: 'Awards & recognition',
  awards: [
    {
      id: 'sih-2025',
      place: '1st',
      title: 'VIPS-TC SIH 2025',
      detail: 'Internal Smart India Hackathon · Team ZeroTrace',
    },
    {
      id: 'gencodex-2026',
      place: '3rd',
      title: 'GenCodeX / GenCatalyst',
      detail: 'AI Hackathon · Mar 2026',
    },
    {
      id: 'quizoff-2026',
      place: null,
      title: 'QuizOff 2026',
      detail: 'Competition',
    },
    {
      id: 'vibe-hacks',
      place: null,
      title: 'Vibe Hacks',
      detail: 'Hackathon',
    },
    {
      id: 'hack-with-india',
      place: null,
      title: 'Hack With India',
      detail: 'Hackathon',
    },
    {
      id: 'be10x',
      place: null,
      title: 'be10x AI Tools Workshop',
      detail: 'Workshop',
    },
    {
      id: 'winter-school',
      place: null,
      title: 'VIPS Winter School',
      detail: 'Python',
    },
  ],
}

export const beyond = {
  heading: 'Beyond code',
  bridge: 'Visual design and engineering — both are about making complex things clear.',
  lead: 'The same muscles: clarity, timing, and leading people toward a shared goal.',

  /**
   * ─────────────────────────────────────────────────────────────
   * ACTIVITIES — two spotlight cards
   * Fill in the details you want to show on each card below.
   * Fields marked [TODO] are placeholders — replace them freely.
   * ─────────────────────────────────────────────────────────────
   */
  activities: [
    {
      id: 'rangmanch',
      role: 'Head of the Creative Department',
      org: 'Rangmanch',
      orgFull: 'Rangmanch (Theatre Society)', // [TODO] confirm full society name
      emoji: '🎭',
      tagline: 'Design that sets the stage before the curtain rises.',
      body: 'As creative head, I own the visual identity of the society — designing posters, event graphics, and posts that go out on the society\'s Instagram page. Every piece has to sell the energy of theatre at a glance.',
      highlights: [
        // [TODO] Add specific designs, campaigns, or events here
        // e.g. { id: 'post1', text: 'Designed all creatives for Annual Fest 2026' },
        // e.g. { id: 'post2', text: 'Grew Instagram engagement with consistent visual theme' },
      ],
    },
    {
      id: 'advait',
      role: 'Technical Team Member',
      org: 'Advait',
      orgFull: 'Advait (Technical Society)', // [TODO] confirm full society name
      emoji: '⚙️',
      tagline: 'Engineering with community.',
      body: 'Part of the technical society driving workshops, hackathons, and collaborative engineering projects across the college.',
      highlights: [
        // [TODO] Add workshops, events, or projects you contributed to here
        // e.g. { id: 'ws1', text: 'Web Dev bootcamp facilitator, Jan 2026' },
        // e.g. { id: 'hack1', text: 'Organised internal hackathon, 60 participants' },
      ],
    },
  ],

  // Legacy notes kept for reference — not rendered in the new layout
  notes: [
    {
      id: 'theatre',
      label: 'Theatre',
      detail: 'Creative direction and performance with Rangmanch A',
    },
    {
      id: 'story',
      label: 'Storytelling',
      detail: 'Narrative craft, audience arc, and emotional clarity',
    },
    {
      id: 'stage',
      label: 'Stage presence',
      detail: 'Composure, timing, and presence under pressure',
    },
    {
      id: 'collab',
      label: 'Collaboration',
      detail: 'Leading casts and crews toward a shared show',
    },
  ],
}

export const contact = {
  heading: 'Contact',
  lead: 'Open to internships, collaborations, and good conversations.',
  body: 'Email is the best way to reach me. Find my work on GitHub and connect on LinkedIn.',
  cta: 'Email me',
  emailLabel: 'Email',
  links: {
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
  closing: 'Based in Delhi — happy to talk remote or hybrid.',
  form: {
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    messagePlaceholder: 'What would you like to talk about?',
    submitLabel: 'Send message',
    successMessage: "Message sent! I'll get back to you soon.",
  },
  portalBackLabel: 'Back to start',
}
