import Header from "@/components/Header";
import HeroCards from "@/components/HeroCards";
import ExperienceBoard from "@/components/ExperienceBoard";
import HeroCta from "@/components/HeroCta";
import StarField from "@/components/StarField";
import Section from "@/components/Section";
import OutOfContext from "@/components/OutOfContext";
import Contact from "@/components/Contact";
import WorldMap from "@/components/WorldMap";
import LanguageCards from "@/components/LanguageCards";
import SkillChips from "@/components/SkillChips";
import Recommendations from "@/components/Recommendations";
import { getContent } from "@/data/content";
import type { Lang } from "@/data/ui";

// La página completa, en el idioma que le pidan: la usan app/(es)/page.tsx ("/") y app/(en)/en/page.tsx ("/en").

// Año del footer: sale de la fecha del build, así se actualiza solo en cada deploy.
// Va fuera del componente porque Next (con cacheComponents) no deja leer la fecha durante el render.
const year = new Date().getFullYear();

export default function HomePage({ lang }: { lang: Lang }) {
  const { profile, heroFacts, jobs, studies, languages, skills, softSkills, recommendations, personal, outOfContext, t } = getContent(lang);

  return (
    <>
      <StarField />
      <Header lang={lang} t={t.nav} />
      <main>
        {/* Presentación */}
        <section id="sobre-mi" className="hero-sky relative overflow-x-clip px-4 pb-10 pt-12 text-center text-paper md:pt-16">
          <h1 className="relative font-display text-4xl font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_0_24px_var(--color-marker)] md:text-6xl">
            {profile.name}
          </h1>
          <p className="relative mt-3 font-display text-lg font-semibold tracking-wide text-marker md:text-2xl">
            {profile.role}
          </p>
          <HeroCta cvUrl={profile.cvUrl} t={t.hero} />
          <HeroCards facts={heroFacts} photo={profile.photo} name={profile.shortName} t={t.hero} />
        </section>

        {/* Experiencia: tablero de juego, una casilla por trabajo y por proyecto */}
        <Section id="experiencia" title={t.experience.title}>
          <ExperienceBoard jobs={jobs} t={t.experience} />
        </Section>

        {/* Educación: mapa de mundos de un juego de plataformas */}
        <Section id="educacion">
          <WorldMap studies={studies} t={t.education} />
        </Section>

        {/* Idiomas: cartas coleccionables */}
        <Section id="idiomas">
          <LanguageCards languages={languages} t={t.languages} />
        </Section>

        {/* Skills: fichas de póker, un color por grupo */}
        <Section id="skills" title={t.skills.title}>
          <SkillChips groups={skills} soft={softSkills} t={t.skills} />
        </Section>

        <Recommendations items={recommendations} linkedin={profile.links.linkedin} t={t.reviews} />

        <OutOfContext personal={personal} cards={outOfContext} t={t.dice} />

        <Contact profile={profile} t={t.contact} />
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © {year} {profile.shortName}
      </footer>
    </>
  );
}
