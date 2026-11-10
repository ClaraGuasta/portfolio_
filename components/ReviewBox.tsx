"use client";

import { useRef, useState } from "react";
import type { Recommendation } from "@/data/portfolio";
import { titleClass } from "@/components/Section";

// Dorso de la caja de un juego de mesa: cada recomendación es una reseña con su frase destacada.
// "Leer reseña completa" abre el texto entero en una carta.
const tilt = ["-rotate-2", "rotate-1", "-rotate-1"];

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`tracking-[.2em] ${className}`} aria-hidden>
    ★★★★★
  </span>
);

export default function ReviewBox({ items, linkedin }: { items: Recommendation[]; linkedin: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(0);
  const r = items[open];

  const show = (i: number) => {
    setOpen(i);
    dialog.current?.showModal();
  };

  return (
    <div>
      {/* Título de la sección (con estrellitas de reseña a los costados) */}
      <h2 className={`${titleClass} flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center`}>
        <Stars />
        Lo que dicen quienes ya jugaron en mi equipo
        <Stars className="max-sm:hidden" />
      </h2>

      <ul className="mt-8 grid gap-6 md:grid-cols-3 md:gap-5">
        {items.map((item, i) => (
          <li
            key={item.name}
            className={`${tilt[i % tilt.length]} flex flex-col rounded-2xl bg-paper p-5 text-ink shadow-[0_8px_0_0_#432548,0_0_30px_-8px_var(--color-glow)] transition-[rotate,translate] duration-300 hover:-translate-y-1 hover:rotate-0 has-focus-visible:rotate-0`}
          >
            <Stars className="text-lg text-wine" />
            <blockquote className="mt-2 font-display text-lg font-extrabold leading-snug">“{item.highlight}”</blockquote>
            <p className="mt-4 flex items-center gap-2.5 text-sm">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-wine text-xs font-bold text-paper" aria-hidden>
                {item.initials}
              </span>
              <span>
                <span className="block font-bold">{item.name}</span>
                <span className="block text-ink/70">{item.role}</span>
              </span>
            </p>
            <button
              type="button"
              onClick={() => show(i)}
              className="mt-auto self-start pt-4 text-sm font-bold text-wine underline decoration-glow decoration-2 underline-offset-4 hover:decoration-wine"
            >
              Leer reseña completa
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-center text-sm">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold"
        >
          Ver las recomendaciones en LinkedIn
        </a>
      </p>

      <dialog
        ref={dialog}
        aria-labelledby="review-title"
        className="m-auto max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl bg-linear-to-br from-[#5d3366] via-wine to-[#2b1631] p-6 text-paper shadow-[0_0_40px_-10px_var(--color-glow)] backdrop:bg-[#0a0d2c]/70 backdrop:backdrop-blur-sm open:motion-safe:animate-cta-in md:p-8"
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        <span className="pointer-events-none absolute inset-2 rounded-[1.25rem]" aria-hidden />
        <div className="relative">
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="float-right -mr-2 -mt-2 ml-3 flex size-9 items-center justify-center rounded-full border border-glow/60 text-lg hover:bg-glow/20"
            aria-label="Cerrar"
          >
            ×
          </button>
          <Stars className="text-lg text-glow" />
          <h3 id="review-title" className="mt-1 font-display text-xl font-bold">
            Reseña de {r.name}
          </h3>
          <p className="text-sm text-paper/75">
            {r.role} · {r.relation}
            {r.time && ` · ${r.time}`}
          </p>
          <blockquote className="mt-5 space-y-3 leading-relaxed">
            {r.quote.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </blockquote>
        </div>
      </dialog>
    </div>
  );
}
