import Image from "next/image";
import Header from "@/components/Header";
import Section from "@/components/Section";
import OutOfContext from "@/components/OutOfContext";
import Contact from "@/components/Contact";
import OrgLogo from "@/components/OrgLogo";
import Recommendations from "@/components/Recommendations";
import { profile, jobs, studies, languages, skills, softSkills } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Presentación */}
        <section id="sobre-mi" className="mx-auto max-w-5xl px-6 pb-16 pt-14 md:pt-24">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_20rem]">
            <div>
              <p className="text-muted">{profile.location}</p>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-tight lg:text-7xl">
                {profile.name}
              </h1>
              <p className="mt-6 inline-block bg-marker px-2 font-display text-xl font-semibold md:text-2xl">
                {profile.role}
              </p>
              <p className="mt-8 max-w-xl text-xl font-medium">{profile.tagline}</p>
              <div className="mt-4 max-w-xl space-y-4 text-muted">
                {profile.about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#contacto" className="rounded-full bg-accent px-6 py-3 font-semibold text-ink hover:opacity-90">
                  Contactame
                </a>
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink px-6 py-3 font-semibold hover:bg-ink hover:text-paper">
                  Descargar CV
                </a>
              </div>
            </div>
            <div className="relative mx-auto w-64 md:w-full">
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] bg-accent" aria-hidden />
              <Image
                src={profile.photo}
                alt={`Foto de ${profile.shortName}`}
                width={480}
                height={640}
                priority
                className="relative aspect-[3/4] w-full rounded-[2.5rem] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Experiencia: secuencia real, va en línea de tiempo */}
        <Section id="experiencia" title="Experiencia">
          <ol className="space-y-10 border-l-2 border-line pl-6">
            {jobs.map((job) => (
              <li key={job.company + job.period} className="relative">
                <span className="absolute -left-[1.9rem] top-2 size-3 rounded-full bg-wine" aria-hidden />
                <p className="text-sm text-muted">{job.period}</p>
                <h3 className="font-display text-xl font-bold">{job.role}</h3>
                <p className="mt-1 flex items-center gap-2 text-muted">
                  <OrgLogo logo={job.logo} />
                  {job.company}{job.place ? ` · ${job.place}` : ""}
                </p>
                {job.summary && <p className="mt-3 max-w-2xl">{job.summary}</p>}
                {job.description.length > 0 && (
                  <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5">
                    {job.description.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
                {job.projects && (
                  <div className="mt-5 space-y-5">
                    {job.projects.map((pr) => (
                      <div key={pr.name} className="rounded-2xl border border-line bg-white/60 p-5">
                        <h4 className="font-display text-lg font-bold">{pr.name}</h4>
                        <ul className="mt-3 list-disc space-y-1.5 pl-5">
                          {pr.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {pr.stack.map((s) => (
                            <li key={s} className="rounded-full border border-wine bg-transparent px-3 py-1 text-sm font-medium">{s}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {job.stack && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {job.stack.map((s) => (
                      <li key={s} className="rounded-full border border-wine bg-transparent px-3 py-1 text-sm font-medium">{s}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </Section>

        <Section id="educacion" title="Educación">
          <ul className="space-y-8">
            {studies.map((s) => (
              <li key={s.title}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm text-muted">{s.period}</p>
                  {s.current && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/20 px-2.5 py-0.5 text-xs font-semibold">
                      <span className="relative flex size-2" aria-hidden>
                        <span className="absolute inset-0 rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
                        <span className="relative size-2 rounded-full bg-accent" />
                      </span>
                      Cursando
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-1 flex items-center gap-2 text-muted">
                  <OrgLogo logo={s.logo} />
                  {s.school}{s.degree ? ` · ${s.degree}` : ""}
                </p>
                <h4 className="mt-4 text-sm font-semibold">{s.contentsLabel}</h4>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {s.contents.map((c) => (
                    <li key={c} className="rounded-full border border-wine bg-transparent px-3 py-1 text-sm font-medium">{c}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="idiomas" title="Idiomas">
          <ul className="grid gap-6 sm:grid-cols-2">
            {languages.map((l) => (
              <li key={l.name} className="border-b border-line pb-4">
                <p className="font-display text-xl font-bold">{l.name}</p>
                <p className="text-muted">
                  {l.level}
                  {l.detail && ` · ${l.detail}`}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title="Skills y tecnologías">
          <div className="space-y-8">
            {skills.map((g) => (
              <div key={g.group}>
                <h3 className="font-display text-lg font-bold">{g.group}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li key={i} className="rounded-full bg-wine px-4 py-1.5 text-sm text-paper">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="font-display text-lg font-bold">Habilidades blandas</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {softSkills.map((i) => (
                  <li key={i} className="rounded-full border border-wine px-4 py-1.5 text-sm">{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Recommendations />

        <OutOfContext />

        <Contact />
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © 2026 {profile.shortName}
      </footer>
    </>
  );
}