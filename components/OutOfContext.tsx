import Image from "next/image";
import { personal, outOfContext } from "@/data/portfolio";

// Inclinaciones fijas: se enderezan al pasar el mouse
const tilt = ["-rotate-1", "rotate-1", "rotate-2", "-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export default function OutOfContext() {
  // Verticales arriba (4 en fila) y horizontales abajo (3 en fila).
  // El orden en data/portfolio.ts no importa: se ordenan acá.
  const photos = [
    ...outOfContext.filter((p) => !p.wide),
    ...outOfContext.filter((p) => p.wide),
  ];

  return (
    <section id="fuera-del-codigo" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <h2 className="font-display text-3xl font-extrabold md:text-5xl">{personal.title}</h2>
      <p className="mt-4 max-w-xl text-lg text-muted">{personal.intro}</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {personal.likes.map((l) => (
          <div key={l.label} className="rounded-2xl bg-marker/60 px-5 py-4">
            <dt className="font-display text-lg font-bold">{l.label}</dt>
            <dd>{l.text}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-14 font-display text-xl font-bold">Out of Context</h3>
      <p className="mt-1 text-sm text-muted">Mi equipo de trabajo, citado fuera de contexto.</p>

      {/* Escritorio: 12 columnas → 4 verticales (3 col c/u) y 3 horizontales (4 col c/u).
          Celular: 2 columnas; las horizontales ocupan el ancho completo. */}
      <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
        {photos.map((p, i) => (
          <li
            key={p.src}
            className={`${p.wide ? "col-span-2 md:col-span-4" : "md:col-span-3"} ${tilt[i % tilt.length]} rounded-xl bg-white p-2 pb-3 shadow-md transition-transform duration-200 hover:rotate-0 hover:scale-[1.02]`}
          >
            <div className={`relative w-full overflow-hidden rounded-md ${p.wide ? "aspect-[3/2]" : "aspect-[4/5]"}`}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={p.wide ? "(min-width: 768px) 330px, 100vw" : "(min-width: 768px) 250px, 50vw"}
                className="object-cover"
              />
            </div>
            <p className="mt-2.5 px-1 font-display text-[13px] font-semibold leading-snug">“{p.caption}”</p>
          </li>
        ))}
      </ul>
    </section>
  );
}