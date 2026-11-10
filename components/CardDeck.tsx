"use client";

import { useState, type CSSProperties } from "react";
import CardBack from "@/components/CardBack";
import { faceClass, InfoFace, JokerFace } from "@/components/CardFaces";
import type { ProfileCard } from "@/data/portfolio";

// Reservado para otra sección: mazo que reparte una carta por clic. Hoy no se usa en ninguna página.
export default function CardDeck({ cards, photo, name }: { cards: ProfileCard[]; photo: string; name: string }) {
  const total = cards.length + 1; // las cartas de datos más el comodín
  const [dealt, setDealt] = useState(1); // la primera sale sola al cargar la página
  const [front, setFront] = useState(0);
  const [round, setRound] = useState(0); // al mezclar, remonta la lista para repetir las animaciones

  const remaining = total - dealt;

  function handleDeck() {
    if (remaining > 0) {
      setFront(dealt);
      setDealt(dealt + 1);
    } else {
      setRound(round + 1);
      setFront(0);
      setDealt(1);
    }
  }

  const titles = [...cards.map((c) => c.title), "Comodín"];

  return (
    <div className="@container mt-12">
      <div className="card-table relative">
        <button
          type="button"
          aria-label={remaining > 0 ? `Sacar una carta. Quedan ${remaining}` : "Mezclar de nuevo"}
          className="card-deck absolute left-0 top-0 block cursor-pointer rounded-2xl transition-[translate] duration-200 motion-safe:hover:-translate-y-1"
          onClick={handleDeck}
        >
          {remaining > 0 ? (
            // El mazo se va afinando a medida que salen cartas.
            Array.from({ length: Math.min(remaining, 4) }, (_, layer) => (
              <span
                key={layer}
                className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_0_24px_-8px_var(--color-glow)]"
                style={{ transform: `translate(${layer * 3}px, ${layer * -3}px)` }}
              >
                <CardBack />
              </span>
            ))
          ) : (
            <span className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-dashed border-glow p-2 text-center text-sm font-semibold text-wine">
              Mezclar de nuevo
            </span>
          )}
        </button>

        <p className="card-hint absolute text-sm text-muted" aria-live="polite">
          Carta {front + 1} de {total}: {titles[front]}.{" "}
          {remaining > 0 ? "Tocá el mazo para sacar otra." : "Tocá una carta para volver a verla."}
        </p>

        <ul key={round}>
          {[...cards, null].map((card, i) => {
            const isDealt = i < dealt;
            const isJoker = card === null;

            return (
              <li
                key={titles[i]}
                className={`card-slot absolute left-0 top-0 transition-[translate,transform] duration-200 ${
                  isDealt ? "motion-safe:hover:-translate-y-2" : "pointer-events-none opacity-0"
                }`}
                // La carta de adelante va derecha: inclinada, el texto se ve borroso.
                style={{ "--i": i, "--tilt": i === front ? "0deg" : undefined, zIndex: i === front ? total + 1 : i + 1 } as CSSProperties}
              >
                <div className={`perspective-[1000px] origin-top-left size-full ${isDealt ? "motion-safe:animate-card-fly" : ""}`}>
                  <div
                    className={`relative size-full transform-3d ${
                      isDealt ? (isJoker ? "motion-safe:animate-card-flip-joker" : "motion-safe:animate-card-flip") : ""
                    }`}
                  >
                    {isJoker ? <JokerFace photo={photo} name={name} /> : <InfoFace card={card} />}
                    <div className={`${faceClass} rotate-y-180`}>
                      <CardBack />
                    </div>
                  </div>
                </div>
                {/* Las cartas que quedaron atrás se pueden volver a traer al frente. */}
                {isDealt && i !== front && (
                  <button
                    type="button"
                    aria-label={`Traer al frente la carta ${titles[i]}`}
                    className="absolute inset-0 cursor-pointer rounded-2xl"
                    onClick={() => setFront(i)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
