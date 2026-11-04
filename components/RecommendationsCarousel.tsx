"use client";

import { useEffect, useRef, useState } from "react";
import type { Recommendation } from "@/data/portfolio";

const WORDS_PER_MINUTE = 220;

// Cada tarjeta dura lo que lleva leerla.
function readingSeconds(r: Recommendation) {
  const words = r.quote.join(" ").split(/\s+/).length;
  return Math.ceil((words / WORDS_PER_MINUTE) * 60);
}

export default function RecommendationsCarousel({ items }: { items: Recommendation[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  const paused = hovered || keyboardFocus || expanded;

  // "Leer más" solo aparece si el recorte de verdad esconde texto.
  useEffect(() => {
    const quote = quoteRef.current;
    if (!quote) return;
    const observer = new ResizeObserver(() => setIsClamped(quote.scrollHeight > quote.clientHeight + 1));
    observer.observe(quote);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-white/60"
      // El tacto no pausa: en celular el "hover" queda pegado después de tocar.
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      // Con teclado pausa mientras "Leer más" tiene el foco, para que no desaparezca.
      onFocus={(e) => setKeyboardFocus(e.target.matches(":focus-visible"))}
      onBlur={() => setKeyboardFocus(false)}
    >
      {/* La tira marca el tiempo: al terminar su animación pasa a la siguiente. */}
      <div className="absolute inset-x-0 top-0 h-1 bg-line motion-reduce:hidden" aria-hidden>
        <div
          key={index}
          className="h-full origin-left bg-wine motion-safe:animate-slide-timer"
          style={{
            animationDuration: `${readingSeconds(items[index])}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
          onAnimationEnd={() => setIndex((index + 1) % items.length)}
        />
      </div>

      {/* Todas en la misma celda: la altura es la de la más larga y nada salta al cambiar.
          Las ocultas siguen accesibles para lectores de pantalla.
          Con "reducir movimiento" no hay pase automático, así que se muestran todas apiladas y sin recortar. */}
      <div className="grid">
        {items.map((r, i) => {
          const active = i === index;
          const clamp = !(active && expanded);
          const showToggle = active && (expanded || isClamped);

          return (
            <figure
              key={r.name}
              // Solo se funde la que entra: si la saliente también se animara, los textos se pisarían.
              className={`flex flex-col p-6 pt-8 [grid-area:1/1] motion-reduce:pointer-events-auto motion-reduce:opacity-100 motion-reduce:[grid-area:auto] motion-reduce:not-first:border-t motion-reduce:not-first:border-line md:p-10 ${
                active ? "opacity-100 motion-safe:transition-opacity motion-safe:duration-500" : "pointer-events-none opacity-0"
              }`}
            >
              <blockquote
                ref={active ? quoteRef : undefined}
                className={`max-w-3xl space-y-3 md:text-lg ${clamp ? "motion-safe:max-md:max-h-72 motion-safe:max-md:overflow-hidden" : ""} ${
                  clamp && showToggle ? "[mask-image:linear-gradient(to_bottom,black_70%,transparent)]" : ""
                }`}
              >
                {r.quote.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </blockquote>
              {/* En todas las tarjetas, aunque invisible, para que la altura no cambie entre una y otra. */}
              <button
                type="button"
                aria-expanded={expanded}
                className={`mt-2 self-start py-2 text-sm font-semibold underline decoration-wine decoration-2 underline-offset-4 motion-reduce:hidden ${
                  showToggle ? "" : "invisible md:hidden"
                }`}
                onClick={(e) => {
                  const button = e.currentTarget;
                  setExpanded(!expanded);
                  // Al cerrar, el texto se acorta: evita que el botón quede fuera de la pantalla.
                  if (expanded) requestAnimationFrame(() => button.scrollIntoView({ block: "nearest" }));
                }}
              >
                {expanded ? "Leer menos" : "Leer más"}
              </button>
              <figcaption className="mt-auto flex items-center gap-3 pt-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-marker text-sm font-bold" aria-hidden>
                  {r.initials}
                </span>
                <span className="text-sm">
                  <span className="block font-bold">{r.name}</span>
                  <span className="block text-muted">{r.role}</span>
                  <span className="block text-muted">{r.relation}</span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
