import ContactForm from "@/components/ContactForm";
import { Star } from "@/components/CardBack";
import { sectionWidth } from "@/components/Section";
import type { profile as Profile } from "@/data/portfolio";
import type { UI } from "@/data/ui";

// Contacto como un tablero de encargos (RPG): a un lado los canales oficiales,
// al otro el contrato de misión que completa quien me quiere reclutar.

const channelsOf = (profile: typeof Profile, t: UI["contact"]) => [
  {
    label: t.email,
    handle: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
    icon: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l8 5.2 8-5.2V7H4Zm16 2.8-7.46 4.84a1 1 0 0 1-1.08 0L4 9.8V17h16V9.8Z",
  },
  {
    label: "LinkedIn",
    handle: "in/clara-guastavino",
    href: profile.links.linkedin,
    external: true,
    icon: "M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.46-1.84-5.17-4.3-5.17a3.72 3.72 0 0 0-3.37 1.85V8.5H9.52c.04 1.05 0 11.5 0 11.5h3.25v-6.42c0-.34.03-.69.12-.93.27-.69.89-1.4 1.93-1.4 1.36 0 1.9 1.05 1.9 2.59V20h3.72v-6.6Z",
  },
  {
    label: "GitHub",
    handle: "ClaraGuasta",
    href: profile.links.github,
    external: true,
    icon: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  },
];

export default function Contact({ profile, t }: { profile: typeof Profile; t: UI["contact"] }) {
  const channels = channelsOf(profile, t);
  return (
    <section id="contacto" className={`${sectionWidth} py-16 md:py-24`}>
      {/* Encabezado del tablero */}
      <header className="max-w-2xl">
        <p className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[.3em] text-marker">
          <Star className="size-2.5 text-glow" />
          {t.kicker}
        </p>
        <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-[.08em] text-glow drop-shadow-[0_0_10px_var(--color-glow)] md:text-4xl">
          {t.title}
        </h2>
        <p className="mt-4 text-lg text-paper/80">
          {t.intro}
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10">
        {/* Canales oficiales */}
        <aside aria-labelledby="canales-oficiales">
          <h3
            id="canales-oficiales"
            className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-[.2em] text-paper/70 after:h-px after:flex-1 after:bg-linear-to-r after:from-glow/40 after:to-transparent"
          >
            {t.channels}
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(c.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="group flex items-center gap-4 rounded-xl border border-glow/25 bg-[#2a1630]/50 p-3.5 backdrop-blur-sm transition-[border-color,box-shadow,translate] hover:-translate-y-0.5 hover:border-glow/70 hover:shadow-[0_0_22px_-6px_var(--color-glow)]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-glow/40 bg-glow/10 text-glow transition-colors group-hover:bg-glow group-hover:text-[#2a1630]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
                      <path fillRule="evenodd" clipRule="evenodd" d={c.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[11px] font-bold uppercase tracking-wider text-paper/60">{c.label}</span>
                    <span className="block truncate text-[15px] font-semibold text-paper">{c.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Estado de la aventurera, al estilo de una ficha de reclutamiento. ✏️ ajustá estos datos a tu realidad */}
          <dl className="mt-6 hidden space-y-2.5 rounded-xl border border-dashed border-glow/25 p-4 text-sm lg:block">
            <div className="flex justify-between gap-3">
              <dt className="text-paper/60">{t.status}</dt>
              <dd className="flex items-center gap-2 font-semibold text-accent">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
                  <span className="relative size-2 rounded-full bg-accent" />
                </span>
                {t.available}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-paper/60">{t.responseTime}</dt>
              <dd className="font-semibold text-paper">{t.responseValue}</dd>
            </div>
          </dl>
        </aside>

        <ContactForm email={profile.email} t={t} />
      </div>
    </section>
  );
}
