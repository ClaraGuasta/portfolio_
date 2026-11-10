// ✏️ Contenido del portfolio en inglés. Tiene la misma forma que data/portfolio.ts:
// si agregás o cambiás algo allá, actualizalo acá también (TypeScript avisa si falta un campo).
import {
  profile as esProfile,
  logos,
  yearsCoding,
  type Job,
  type Language,
  type ProfileCard,
  type Recommendation,
  type Study,
} from "@/data/portfolio";

export const profile = {
  ...esProfile,
  tagline: "React, Next.js and TypeScript, with a focus on user experience and teamwork.",
  about: [
    "I'm a frontend developer from Gualeguaychú, Entre Ríos, Argentina. I work with React, Next.js, TypeScript and Tailwind CSS in cross-functional teams, alongside backend engineers and product owners, building platforms for end users.",
    "I want to keep growing technically and add value to projects that put user experience first. I care about the team's vibe: keeping it friendly and relaxed.",
  ],
  location: "Gualeguaychú, Entre Ríos, Argentina",
  // CV en inglés: mientras no exista este archivo en /public, el botón descarga el CV en español
  cvUrl: "/ClaraGuastavinoCV-EN.pdf",
};

export const heroFacts: ProfileCard[] = [
  { title: `+${yearsCoding} years`, text: "of frontend development experience", pinned: true },
  { title: "React", text: "Next.js · TypeScript · Tailwind CSS" },
  { title: "English B2", text: "Cambridge First Certificate" },
  { title: "Argentina", text: "Gualeguaychú, Entre Ríos" },
  { title: "Testing", text: "Jest · React Testing Library" },
  { title: "Node.js", text: "BFF with Express, Zod and Redis" },
  { title: "Student", text: "Systems Analyst · Universidad de Palermo" },
];

export const jobs: Job[] = [
  {
    company: "itti",
    logo: logos.itti,
    role: "Semi Senior Software Engineer",
    place: "Argentina",
    period: "September 2025 – Present",
    summary:
      "I work on a marketplace's e-commerce platform, both on the frontend and on the BFF that connects the services. These are the three projects I'm part of:",
    description: [],
    projects: [
      {
        name: "Multi-zone e-commerce storefront",
        short: "Storefront",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Algolia", "pnpm"],
        bullets: [
          "Migrated the home page content (ads, brands, heroes, banners, products, categories and search suggestions) from Promotionals to the Marketing BFF.",
          "API pagination (page/skip and cursor) with shared helpers in a monorepo package.",
          "Conversion flows: buy now, add to cart, post-login redirect and auth guards across zones.",
          "PDP with a permanent redirect when the slug changes, collection PLPs with marketing-locked filters and sorting, and SEO (category meta tags, brand sitemaps).",
          "Hardening: upgraded next-intl to fix an open redirect vulnerability, increased test coverage and reduced duplication in Sonar.",
        ],
      },
      {
        name: "Super Admin: marketplace back office",
        short: "Super Admin",
        stack: ["Next.js", "React", "TypeScript", "Material UI", "React Hook Form", "Jest"],
        bullets: [
          "End-to-end dynamic collections module: CRUD, multi-tab form, rules (curated, dynamic or filter-based), PLP preview with the Search API, and publishing.",
          "Filter condition builder backed by the index facets, with a store-like preview.",
          "Bulk import via CSV or paste (ids, slugs and store URLs), resolved through the PIM, with concurrency, error handling and retries.",
          "Contributions to placements, DAM integration, channel switches, collection and banner deletion, and test coverage improvements.",
        ],
      },
      {
        name: "Marketplace BFF",
        short: "BFF",
        stack: ["Node.js", "TypeScript", "Express", "Zod", "OpenAPI", "MongoDB", "Redis", "AWS AppConfig"],
        bullets: [
          "Endpoints that orchestrate microservices (PIM, DAM, Marketing, carts, orders and payments) for the frontend and the back office.",
          "Gradual migration of promotional content from MongoDB to the Marketing microservice, running legacy and new APIs in parallel without breaking consumers.",
          "API contracts with Zod and OpenAPI/Swagger documentation.",
          "Caching with Redis, logging with Pino, observability with New Relic and feature flags with AWS AppConfig.",
        ],
      },
    ],
  },
  {
    company: "Digital House",
    logo: logos.digitalHouse,
    role: "Software Engineer",
    place: "Argentina",
    period: "May 2022 – September 2025",
    description: [
      "Cross-functional team of frontend and backend engineers, with product owners, building portals for students and teachers.",
      "Interfaces focused on usability, accessibility and responsive design, plus an in-house library of reusable components with React, Next.js, TypeScript, Tailwind CSS and Storybook.",
      "Dynamic content with Prismic and Slice Machine; micro frontends with Nginx.",
      "State management with Zustand, backend communication via GraphQL and validation with Zod.",
      "Unit tests with Jest and React Testing Library, and production error monitoring with Sentry.",
      "Team practices: Commitizen, BEM methodology and well-documented pull requests.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Storybook", "GraphQL", "Zustand", "Zod", "Jest"],
  },
];

export const studies: Study[] = [
  {
    school: "Universidad de Palermo",
    logo: logos.palermo,
    title: "Systems Analyst",
    degree: "Undergraduate technical degree",
    period: "August 2023 – Present",
    current: true,
    progress: 0.7, // ✏️ mismo valor que en la versión en español
    contentsLabel: "Featured courses",
    contents: [
      "Data Structures and Algorithms",
      "Databases",
      "Computer Architecture",
      "Operating Systems",
      "Introduction to Software Engineering",
      "Systems Analysis",
      "Systems Design",
    ],
  },
  {
    school: "Digital House",
    logo: logos.digitalHouse,
    title: "Full-Stack Web Development",
    period: "August 2021 – February 2022 · 7 months",
    contentsLabel: "Contents",
    contents: [
      "Web Design: HTML and CSS",
      "Learning Agility",
      "Agile & Scrum Methodologies",
      "Imperative Programming with JavaScript",
      "JavaScript for the DOM",
      "Design Thinking",
      "Express.js",
      "MySQL Databases",
      "Sequelize",
      "UX/UI Design",
      "React.js",
      "Full Stack Capstone Challenge",
    ],
  },
];

export const languages: Language[] = [
  {
    code: "ES",
    name: "Spanish",
    level: "Native",
    rarity: "Epic · Native",
    lore: "The party's main voice channel. Fluent, natural, zero-latency communication every day.",
    icon: "voice",
  },
  {
    code: "EN",
    name: "English",
    level: "Advanced",
    rarity: "Advanced · Certified",
    lore: "Active buff for reading technical documentation, exploring global repositories and frictionless international collaboration.",
    cert: "Cambridge First Certificate · B2",
    icon: "scroll",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS3", "Tailwind CSS", "Material UI", "Storybook"] },
  { group: "State & data", items: ["Zustand", "Redux", "Zod", "GraphQL", "Axios", "React Hook Form"] },
  { group: "Backend", items: ["Node.js", "Express", "MongoDB", "Redis", "OpenAPI"] },
  { group: "Testing & quality", items: ["Jest", "React Testing Library", "Sentry", "SonarQube", "ESLint", "New Relic"] },
  { group: "Tools & methodologies", items: ["Git", "Docker", "pnpm", "Nginx", "Prismic", "Algolia", "Vercel", "Nullplatform", "Scrum"] },
];

export const softSkills = ["Teamwork", "Creativity", "Leadership", "Organization", "Versatility", "Curiosity"];

// ---------- LinkedIn recommendations ----------
// Traducciones de las citas originales en español (la reseña avisa que es una traducción).
export const recommendations: Recommendation[] = [
  {
    name: "José Luis Mosconi",
    initials: "JM",
    role: "Engineering Manager",
    relation: "Managed me directly",
    time: "2025 – Present",
    highlight: "Clari went far beyond what's expected of her seniority.",
    quote: [
      "I had the pleasure of working with Clara Guastavino (Clari) on itti's Growth team, where she worked as a semi senior frontend and BFF developer.",
      "Clari went far beyond what's expected of her seniority. What sets her apart the most is that she never hesitates to learn new things: she takes every challenge as an opportunity to grow, even when that means stepping out of her comfort zone and getting into other languages and other parts of the system. That curiosity and adaptability led her to contribute far beyond her role.",
      "Besides her technical growth, Clari has an attitude that adds to the team: she's committed, takes ownership of what she works on and is always willing to lend a hand.",
      "Any team that brings her on gains a professional with huge potential, who learns fast and isn't afraid of any challenge. I recommend her without hesitation.",
    ],
  },
  {
    name: "Jose Manuel González Ricart",
    initials: "JG",
    role: "Sr Software Engineer",
    relation: "We worked on the same team",
    time: "2025 – Present",
    highlight: "She's one of those people who make working together so much more enjoyable",
    quote: [
      "I got to work very closely with Clara on several team initiatives, and sharing those challenges with her was always a pleasure.",
      "One project I especially remember is the hackathon where we set out to experiment with and learn more about SDD using Spec-kitti. That experience allowed us to deliver several initiatives for the Marketing service that now let us work with dynamic collections, dynamic layouts and other features. Throughout that process she played an important role, working on both the BFF and the admin.",
      "I really value her willingness to collaborate, her eagerness to learn and to take on new challenges, but above all the great energy she brings to the team. She's one of those people who make working together so much more enjoyable and always bring a good atmosphere to the day to day.",
      "It was a pleasure to share so many challenges and projects with her!",
    ],
  },
  {
    name: "Lucas Jaime",
    initials: "LJ",
    role: "Senior Software Engineer",
    relation: "Managed me directly",
    time: "2022 – 2025",
    highlight: "She is without a doubt one of the best people I've had under my leadership",
    quote: [
      "I had the pleasure of leading Clari from her beginnings as a trainee until she became a fully autonomous, problem-solving professional. It was impressive to see how she grew, quickly adopting and applying standards and best practices. Clari always looked after the quality and maintainability of our projects.",
      "Beyond her technical skills, Clari was a great teammate, always willing to help others. She also showed strong ownership of her tickets, making sure every task was seen through to the end. She has a great ability to learn, remarkable proactivity and a strong commitment to everything she did.",
      "She is without a doubt one of the best people I've had under my leadership, and I would work with her again without hesitation.",
    ],
  },
];

// ---------- Outside of code ----------
export const personal = {
  title: "Out Of Context",
  intro: "When I'm not coding, I probably have a book in my hand or one of my pets on top of the keyboard. Here's some proof.",
};

// Mismas fotos y mismo orden que en la versión en español (una carta por cara del dado)
export const outOfContext: { src: string; alt: string; caption: string }[] = [
  { src: "/004.jpeg", alt: "Clara working with Duki", caption: "Daily stand-up. Perfect attendance, zero contributions." },
  { src: "/005.jpeg", alt: "Clara working with Kira", caption: "Critical dependency: cannot be uninstalled." },
  { src: "/001.jpeg", alt: "Clara working with Pipa", caption: "Technical interview: she asked me to explain what this code does." },
  { src: "/007.jpeg", alt: "Clara working with Kira, third take", caption: "Code review with love: approved." },
  { src: "/006.jpeg", alt: "Clara working with Kira, second take", caption: "Reviewing the sprint board. She thinks there's too much red." },
  { src: "/008.jpeg", alt: "Clara working with Nube", caption: "Pair programming: I code, my partner sleeps." },
  { src: "/003.jpeg", alt: "Clara working with Duki", caption: "Meeting with my manager. Showed up unannounced and stayed." },
  { src: "/009.jpeg", alt: "Clara holding a frog", caption: "Found a bug. It was green and it jumped." },
  { src: "/002.jpeg", alt: "Clara reading", caption: "Documentation read cover to cover. Sticky notes included." },
  { src: "/010.jpeg", alt: "Clara drinking mate", caption: "Good code always comes with mate." },
];
