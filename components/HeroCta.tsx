"use client";

import { useEffect, useState } from "react";
import CardBack, { Star } from "@/components/CardBack";
import type { UI } from "@/data/ui";

// Los botones del inicio son cartas del tamaño de un botón: aparecen boca abajo y se dan vuelta
// solas cuando las cartas grandes terminan de entrar (≈1,6 s después de que carga la página).
const REVEAL_MS = 1600;

const face = "rounded-lg border backface-hidden";

export default function HeroCta({ cvUrl, t }: { cvUrl: string; t: UI["hero"] }) {
  const [revealed, setRevealed] = useState(false);
  const ctas = [
    { label: t.contact, external: false },
    { label: t.cv, external: true },
  ];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setRevealed(true), reduce ? 0 : REVEAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <ul className="relative mt-7 flex flex-wrap justify-center gap-4">
      {ctas.map((c, i) => (
        <li
          key={c.label}
          className="motion-safe:animate-cta-in transition-[translate] duration-300 hover:-translate-y-0.5"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <a
            href={c.external ? cvUrl : "#contacto"}
            {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group block rounded-lg perspective-[700px]"
          >
            <span
              className="relative block transform-3d motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(.3,1.4,.5,1)]"
              style={{ transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)", transitionDelay: `${i * 150}ms` }}
            >
              {/* Frente: botón ciruela con borde rosa finito y estrellita */}
              <span
                className={`${face} relative flex items-center gap-2 border-glow/80 bg-[#2a1630] px-4 py-2 shadow-[0_0_14px_-3px_var(--color-glow)] transition-shadow group-hover:shadow-[0_0_22px_-2px_var(--color-glow)]`}
              >
                <Star className="size-2.5 text-glow" />
                <span className="font-display text-sm text-paper">{c.label}</span>
              </span>
              {/* Dorso: el mismo de las cartas, recortado a lo ancho */}
              <span className={`${face} absolute inset-0 overflow-hidden border-glow rotate-y-180 shadow-[0_0_14px_-3px_var(--color-glow)]`} aria-hidden>
                <CardBack />
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
