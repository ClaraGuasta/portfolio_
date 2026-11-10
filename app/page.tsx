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
import { profile, heroFacts, jobs, studies, languages, skills, softSkills } from "@/data/portfolio";

// Año del footer: sale de la fecha del build, así se actualiza solo en cada deploy.
// Va fuera del componente porque Next (con cacheComponents) no deja leer la fecha durante el render.
const year = new Date().getFullYear();

export default function Home() {
  return (
    <>
      <StarField />
      <Header />
      <main>
        {/* Presentación */}
        <section id="sobre-mi" className="hero-sky relative overflow-x-clip px-4 pb-10 pt-12 text-center text-paper md:pt-16">
          <h1 className="relative font-display text-4xl font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_0_24px_var(--color-marker)] md:text-6xl">
            {profile.name}
          </h1>
          <p className="relative mt-3 font-display text-lg font-semibold tracking-wide text-marker md:text-2xl">
            {profile.role}
          </p>
          <HeroCta cvUrl={profile.cvUrl} />
          <HeroCards facts={heroFacts} photo={profile.photo} name={profile.shortName} />
        </section>

        {/* Experiencia: tablero de juego, una casilla por trabajo y por proyecto */}
        <Section id="experiencia" title="Experiencia">
          <ExperienceBoard jobs={jobs} />
        </Section>

        {/* Educación: mapa de mundos de un juego de plataformas */}
        <Section id="educacion">
          <WorldMap studies={studies} />
        </Section>

        {/* Idiomas: cartas coleccionables */}
        <Section id="idiomas">
          <LanguageCards languages={languages} />
        </Section>

        {/* Skills: fichas de póker, un color por grupo */}
        <Section id="skills" title="Skills y tecnologías">
          <SkillChips groups={skills} soft={softSkills} />
        </Section>

        <Recommendations />

        <OutOfContext />

        <Contact />
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © {year} {profile.shortName}
      </footer>
    </>
  );
}