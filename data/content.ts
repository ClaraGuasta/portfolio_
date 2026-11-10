import { existsSync } from "node:fs";
import { join } from "node:path";
import * as es from "@/data/portfolio";
import * as en from "@/data/portfolio.en";
import { ui, type Lang } from "@/data/ui";

// Todo lo que muestra la página en un idioma: el contenido y los textos de la interfaz.
// Solo se usa en el servidor (lee /public para saber si ya está el CV en inglés).

type Content = Pick<
  typeof es,
  "profile" | "heroFacts" | "jobs" | "studies" | "languages" | "skills" | "softSkills" | "recommendations" | "personal" | "outOfContext"
>;

// TypeScript marca error acá si a la versión en inglés le falta algo
const content: Record<Lang, Content> = { es, en };

// Si todavía no subiste el PDF en inglés a /public, se usa el de español para que el botón no quede roto
const hasFile = (url: string) => existsSync(join(process.cwd(), "public", url));

function build(lang: Lang) {
  const c = content[lang];
  const cvUrl = hasFile(c.profile.cvUrl) ? c.profile.cvUrl : es.profile.cvUrl;
  return { ...c, profile: { ...c.profile, cvUrl }, t: ui[lang], lang };
}

// Se arma una sola vez al cargar el módulo (en el build), no en cada render
const built = { es: build("es"), en: build("en") };

export const getContent = (lang: Lang) => built[lang];
