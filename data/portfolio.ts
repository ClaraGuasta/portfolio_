// ✏️ Todo el contenido del portfolio vive acá.

export const profile = {
  name: "Clara Matilde Guastavino",
  shortName: "Clara Guastavino",
  role: "Ssr Frontend Developer",
  tagline: "React, Next.js y TypeScript, con foco en la experiencia de usuario y en el trabajo en equipo.",
  about: [
    "Soy desarrolladora frontend de Gualeguaychú, Entre Ríos. Trabajo con React, Next.js, TypeScript y Tailwind CSS en equipos multidisciplinarios, junto a ingenieros backend y product owners, construyendo plataformas para usuarios finales.",
    "Me interesa seguir creciendo técnicamente y sumar valor en proyectos que prioricen la experiencia de usuario. Me importa cuidar el clima del equipo: que sea agradable y relajado.",
  ],
  location: "Gualeguaychú, Entre Ríos, Argentina",
  email: "cmguastavino@hotmail.com",
  photo: "/clara.jpeg",
  cvUrl: "/ClaraGuastavinoCV.pdf",
  links: {
    github: "https://github.com/ClaraGuasta",
    linkedin: "https://www.linkedin.com/in/clara-guastavino-a6a94330a/",
  },
};

// Cartas del mazo de la presentación, en el orden en que salen. La última siempre es el comodín con la foto.
export type ProfileCard = { title: string; text: string; pinned?: boolean }; // pinned: sale en todas las manos

// Cartas del inicio: datos cortos y visuales (el detalle está en las secciones de abajo y en LinkedIn).
// Es un mazo: en cada mezcla salen las cartas fijas (pinned) y el comodín con la foto, y el resto se completa al azar.
// Los años se calculan desde el primer trabajo (mayo de 2022), así que se actualizan solos en cada build.
const yearsCoding = Math.floor((Date.now() - new Date(2022, 4, 1).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

export const heroFacts: ProfileCard[] = [
  { title: `+${yearsCoding} años`, text: "de experiencia en desarrollo frontend", pinned: true },
  { title: "React", text: "Next.js · TypeScript · Tailwind CSS" },
  { title: "Inglés B2", text: "Cambridge First Certificate" },
  { title: "Argentina", text: "Gualeguaychú, Entre Ríos" },
  { title: "Testing", text: "Jest · React Testing Library" },
  { title: "Node.js", text: "BFF con Express, Zod y Redis" },
  { title: "Estudiante", text: "Analista en Sistemas · Universidad de Palermo" },
];

// `zoom` recorta el margen de la imagen para que el logo se lea en tamaño chico.
export type Logo = { src: string; zoom: number };

const logos = {
  itti: { src: "/logo-itti.jpg", zoom: 1.7 },
  digitalHouse: { src: "/logo-dh.jpg", zoom: 2 },
  palermo: { src: "/logo-up.jpg", zoom: 1 },
} satisfies Record<string, Logo>;

export type Project = {
  name: string;
  short?: string; // nombre corto para la casilla del tablero
  stack: string[];
  bullets: string[];
};

export type Job = {
  company: string;
  logo: Logo;
  role: string;
  place?: string;
  period: string;
  summary?: string;
  description: string[];
  projects?: Project[];
  stack?: string[];
};

export const jobs: Job[] = [
  {
    company: "itti",
    logo: logos.itti,
    role: "Semi Senior Software Engineer",
    place: "Argentina",
    period: "Septiembre 2025 – Actualidad",
    summary:
      "Trabajo en la plataforma de e-commerce de un marketplace, tanto en frontend como en el BFF que conecta los servicios. Estos son los tres proyectos en los que participo:",
    description: [],
    projects: [
      {
        name: "Storefront de e-commerce multi-zona",
        short: "Storefront",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Algolia", "pnpm"],
        bullets: [
          "Migración de los contenidos de la home (ads, brands, heros, banners, productos, categorías y sugerencias de búsqueda) desde Promotionals al Marketing BFF.",
          "Paginación de APIs (page/skip y cursor) con helpers compartidos en un package del monorepo.",
          "Flujos de conversión: buy now, add to cart, redirect post-login y auth guards entre zonas.",
          "PDP con redirect permanente cuando cambia el slug, PLP de colecciones con filtros y orden bloqueados según marketing, y SEO (meta de categorías, sitemaps de brands).",
          "Hardening: upgrade de next-intl por una vulnerabilidad de open redirect, más cobertura de tests y menos duplicación en Sonar.",
        ],
      },
      {
        name: "Super Admin: backoffice del marketplace",
        short: "Super Admin",
        stack: ["Next.js", "React", "TypeScript", "Material UI", "React Hook Form", "Jest"],
        bullets: [
          "Módulo de colecciones dinámicas de punta a punta: CRUD, formulario multi-tab, reglas (curada, dinámica o por filtros), preview de la PLP con la Search API y publicación.",
          "Constructor de condiciones de filtros apoyado en los facets del índice, con preview estilo tienda.",
          "Import masivo por CSV o pegado (ids, slugs y URLs de tienda), resolviendo vía PIM, con concurrencia y manejo de errores y reintentos.",
          "Aportes en placements, integración con DAM, switches de canal, borrado de colecciones y banners, y mejoras de cobertura de tests.",
        ],
      },
      {
        name: "BFF del marketplace",
        short: "BFF",
        stack: ["Node.js", "TypeScript", "Express", "Zod", "OpenAPI", "MongoDB", "Redis", "AWS AppConfig"],
        bullets: [
          "Endpoints que orquestan microservicios (PIM, DAM, Marketing, carritos, órdenes y pagos) para el frontend y el backoffice.",
          "Migración gradual del contenido promocional desde MongoDB al microservicio de Marketing, con APIs legacy y nuevas en paralelo, sin romper a los consumidores.",
          "Contratos de API con Zod y documentación OpenAPI/Swagger.",
          "Cache con Redis, logging con Pino, observabilidad con New Relic y feature flags con AWS AppConfig.",
        ],
      },
    ],
  },
  {
    company: "Digital House",
    logo: logos.digitalHouse,
    role: "Ingeniera de software",
    place: "Argentina",
    period: "Mayo 2022 – Septiembre 2025",
    description: [
      "Equipo multidisciplinario de ingenieros frontend y backend, con product owners, en portales para estudiantes y docentes.",
      "Interfaces con foco en usabilidad, accesibilidad y diseño responsive, y librería propia de componentes reutilizables con React, Next.js, TypeScript, Tailwind CSS y Storybook.",
      "Contenido dinámico con Prismic y Slice Machine; micro frontends con Nginx.",
      "Estado con Zustand, comunicación con el backend vía GraphQL y validaciones con Zod.",
      "Tests unitarios con Jest y React Testing Library, y monitoreo de errores en producción con Sentry.",
      "Prácticas de equipo: Commitizen, metodología BEM y pull requests documentados.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Storybook", "GraphQL", "Zustand", "Zod", "Jest"],
  },
];

export type Study = {
  school: string;
  logo: Logo;
  title: string;
  degree?: string;
  period: string;
  current?: boolean; // misión en curso (si no, figura como cumplida)
  progress?: number; // ✏️ opcional, de 0 a 1: avance de la carrera en curso (por ejemplo 0.6 = 60 %)
  contentsLabel: string;
  contents: string[];
};

export const studies: Study[] = [
  {
    school: "Universidad de Palermo",
    logo: logos.palermo,
    title: "Analista en Sistemas",
    degree: "Tecnicatura de grado",
    period: "Agosto 2023 – Actualidad",
    current: true,
    progress: 0.7, // ✏️ avance de la carrera: ajustalo al real
    contentsLabel: "Materias destacadas",
    contents: [
      "Estructura de Datos y Algoritmos",
      "Base de Datos",
      "Arquitectura de Computadores",
      "Sistemas Operativos",
      "Introducción a la Ingeniería de Software",
      "Análisis de Sistemas",
      "Diseño de Sistemas",
    ],
  },
  {
    school: "Digital House",
    logo: logos.digitalHouse,
    title: "Desarrollo Web Full-Stack",
    period: "Agosto 2021 – Febrero 2022 · 7 meses",
    contentsLabel: "Contenidos",
    contents: [
      "Diseño Web: HTML y CSS",
      "Learning Agility",
      "Metodologías Agile & Scrum",
      "Programación Imperativa con JavaScript",
      "JavaScript para DOM",
      "Design Thinking",
      "Express.js",
      "Bases de Datos en MySQL",
      "Sequelize",
      "Diseño UX/UI",
      "React.js",
      "Desafío profesional Full Stack",
    ],
  },
];

// Idiomas como cartas coleccionables. ✏️ `lore`: la descripción de la carta.
// `cert`: certificación (la carta lleva acabado holográfico y sello). `icon`: runa del arte de la carta.
export type Language = {
  code: string;
  name: string;
  level: string;
  rarity: string;
  lore: string;
  cert?: string;
  icon: "voice" | "scroll";
};

export const languages: Language[] = [
  {
    code: "ES",
    name: "Español",
    level: "Nativo",
    rarity: "Épico · Nativo",
    lore: "Canal de voz principal de la party. Comunicación fluida, natural y sin latencia en el día a día.",
    icon: "voice",
  },
  {
    code: "EN",
    name: "Inglés",
    level: "Avanzado",
    rarity: "Avanzado · Certificado",
    lore: "Buff activo de lectura de documentación técnica, análisis de repositorios globales y colaboración internacional sin fricción.",
    cert: "Cambridge First Certificate · B2",
    icon: "scroll",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS3", "Tailwind CSS", "Material UI", "Storybook"] },
  { group: "Estado y datos", items: ["Zustand", "Redux", "Zod", "GraphQL", "Axios", "React Hook Form"] },
  { group: "Backend", items: ["Node.js", "Express", "MongoDB", "Redis", "OpenAPI"] },
  { group: "Testing y calidad", items: ["Jest", "React Testing Library", "Sentry", "SonarQube", "ESLint", "New Relic"] },
  { group: "Herramientas y metodologías", items: ["Git", "Docker", "pnpm", "Nginx", "Prismic", "Algolia", "Vercel", "Nullplatform", "Scrum"] },
];

export const softSkills = [
  "Trabajo en equipo",
  "Creatividad",
  "Liderazgo",
  "Organización",
  "Versatilidad",
  "Interés",
];

// ---------- Recomendaciones de LinkedIn ----------
// Citas textuales: no editar las palabras. "[…]" marca dónde sigue el original.
export type Recommendation = {
  name: string;
  initials: string;
  role: string;
  relation: string;
  time?: string;
  highlight: string; // frase textual de la cita, la que va grande en la reseña
  quote: string[];
};

export const recommendations: Recommendation[] = [
  {
    name: "José Luis Mosconi",
    initials: "JM",
    role: "Engineering Manager",
    relation: "Me supervisó directamente",
    time: "2025 – Actualidad",
    highlight: "Clari superó ampliamente lo que se espera de su seniority.",
    quote: [
      "Tuve el placer de trabajar con Clara Guastavino (Clari) en el equipo de Growth de itti, donde se desempeñó como desarrolladora semi senior de frontend y BFF.",
      "Clari superó ampliamente lo que se espera de su seniority. Lo que más la distingue es que no duda en aprender cosas nuevas: cada desafío lo toma como una oportunidad para crecer, incluso cuando eso implica salir de su zona de confort y meterse con otros lenguajes y otras partes del sistema. Esa curiosidad y esa capacidad de adaptarse la llevaron a aportar mucho más allá de su rol.",
      "Además del crecimiento técnico, Clari tiene una actitud que suma al equipo: es comprometida, se hace cargo de lo que encara y siempre está dispuesta a dar una mano.",
      "Cualquier equipo que la sume gana a una profesional con muchísimo potencial, que aprende rápido y que no le tiene miedo a ningún desafío. La recomiendo sin dudarlo.",
    ],
  },
  {
    name: "Jose Manuel González Ricart",
    initials: "JG",
    role: "Sr Software Engineer",
    relation: "Trabajamos en el mismo equipo",
    time: "2025 – Actualidad",
    highlight: "Es de esas personas que hacen que trabajar en conjunto sea mucho más ameno",
    quote: [
      "Pude trabajar muy de cerca con Clara en distintas iniciativas del equipo, y siempre fue un gusto compartir esos desafíos con ella.",
      "Uno de los trabajos que recuerdo especialmente fue la hackathon en la que nos propusimos experimentar y aprender más sobre SDD utilizando Spec-kitti. A partir de esa experiencia pudimos sacar adelante varias iniciativas para el servicio de Marketing, que hoy nos permiten trabajar con colecciones dinámicas, layouts dinámicos y otras funcionalidades. En todo ese proceso, ella tuvo un papel importante trabajando tanto en el BFF como en el administrador.",
      "Destaco mucho su predisposición para colaborar, sus ganas de aprender y de involucrarse en nuevos desafíos, pero sobre todo la buena energía que transmite al equipo. Es de esas personas que hacen que trabajar en conjunto sea mucho más ameno y que siempre aportan un buen ambiente al día a día.",
      "¡Un gusto haber compartido tantos desafíos y proyectos con ella!",
    ],
  },
  {
    name: "Lucas Jaime",
    initials: "LJ",
    role: "Senior Software Engineer",
    relation: "Me supervisó directamente",
    time: "2022 – 2025",
    highlight: "Es sin duda una de las mejores personas que tuve bajo mi liderazgo",
    quote: [
      "Tuve el placer de liderar a Clari desde sus inicios como trainee hasta convertirse en una profesional totalmente autónoma y resolutiva. Fue impresionante ver cómo creció, adoptando y aplicando rápidamente estándares y buenas prácticas. Clari siempre veló por la calidad y mantenibilidad de nuestros proyectos.",
      "Más allá de sus habilidades técnicas, Clari fue una excelente compañera, siempre dispuesta a dar una mano a los demás. Además, mostró un gran ownership sobre sus tickets, asegurando que cada tarea llegara a buen puerto. Posee una gran capacidad para aprender, una notable proactividad y un fuerte compromiso en todo lo que hizo.",
      "Es sin duda una de las mejores personas que tuve bajo mi liderazgo, y volvería a trabajar con ella sin dudarlo.",
    ],
  },
];

// ---------- Fuera del código ----------
export const personal = {
  title: "Out Of Context",
  intro:
    "Cuando no estoy programando, probablemente tenga un libro en la mano o a alguna de mis mascotas encima del teclado. Estas son algunas pruebas.",
};

// ✏️ Frases "fuera de contexto": una carta por cara del dado (más el comodín, que se agrega en OutOfContext).
// Todas las fotos van horizontales (3:2).
export const outOfContext: { src: string; alt: string; caption: string }[] = [
  { src: "/004.jpeg", alt: "Clara trabajando con Duki", caption: "Daily. Asistencia perfecta, cero aportes." },
  { src: "/005.jpeg", alt: "Clara trabajando con Kira", caption: "Dependencia crítica: no se puede desinstalar." },
  { src: "/001.jpeg", alt: "Clara trabajando con Pipa", caption: "Entrevista técnica: me pidió que explique qué hace este código." },
  { src: "/007.jpeg", alt: "Clara trabajando con Kira 3", caption: "Code review con cariño: aprobado." },
  { src: "/006.jpeg", alt: "Clara trabajando con Kira 2", caption: "Revisando el tablero del sprint. Opina que hay demasiado rojo." },
  { src: "/008.jpeg", alt: "Clara trabajando con Nube", caption: "Pair programming: yo codeo, mi compañera duerme." },
  { src: "/003.jpeg", alt: "Clara trabajando con Duki", caption: "Reunión con mi manager. Llegó sin avisar y se quedó." },
  { src: "/009.jpeg", alt: "Clara con Sapo", caption: "Encontré un bug. Era verde y saltaba." },
  { src: "/002.jpeg", alt: "Clara leyendo", caption: "Documentación leída de punta a punta. Con post-its incluidos y todo." },
  { src: "/010.jpeg", alt: "Clara tomando mate", caption: "Los mates no pueden faltar cuando se hace buen código"},
];