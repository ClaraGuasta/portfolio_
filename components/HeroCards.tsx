"use client";

import { useState, useSyncExternalStore } from "react";
import CardBack from "@/components/CardBack";
import { faceClass, FactFace, JokerFace } from "@/components/CardFaces";
import type { ProfileCard } from "@/data/portfolio";
import type { UI } from "@/data/ui";

const HAND = 4; // cartas del mazo por mano (las fijas incluidas); el comodín se suma siempre
const JOKER = -1;
const LEAVE_MS = 350;
// ✏️ Alto / ancho de las cartas (1.5 = 3:4,5). Lo usan la carta y su dorso, así el dibujo del dorso
// siempre coincide: cambiá solo este número para hacerlas más altas o más bajas.
const CARD_RATIO = 1.5;

// La mano se reparte en el navegador: el servidor no puede mezclar (el HTML tiene que coincidir
// al hidratar), así que las cartas quedan ocultas hasta que React toma el control.
type Deal = { cards: number[]; round: number };
let deal: Deal | null = null;
const listeners = new Set<() => void>();

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Las cartas fijas salen siempre; el resto de la mano se completa al azar con las demás.
function newDeal(facts: ProfileCard[], round: number): Deal {
  const ids = facts.map((_, i) => i);
  const pinned = ids.filter((i) => facts[i].pinned);
  const rest = shuffle(ids.filter((i) => !facts[i].pinned)).slice(0, Math.max(0, HAND - pinned.length));
  return { cards: shuffle([...pinned, ...rest, JOKER]), round };
}

function getDeal(facts: ProfileCard[]) {
  deal ??= newDeal(facts, 0);
  return deal;
}

function redeal(facts: ProfileCard[]) {
  deal = newDeal(facts, (deal?.round ?? 0) + 1);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export default function HeroCards({ facts, photo, name, t }: { facts: ProfileCard[]; photo: string; name: string; t: UI["hero"] }) {
  const hand = useSyncExternalStore(subscribe, () => getDeal(facts), () => null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [leaving, setLeaving] = useState(false);

  const reshuffle = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const go = () => {
      setFlipped({});
      setLeaving(false);
      redeal(facts);
    };
    if (reduce) return go();
    setLeaving(true); // las cartas se van hacia la derecha y entra la mano nueva desde la izquierda
    window.setTimeout(go, LEAVE_MS);
  };

  const cards = hand?.cards ?? [];

  return (
    <>
      <div className="hero-row relative -mx-4 mt-4 md:mx-auto md:max-w-6xl">
        <ul
          className={`hero-cards transition-[opacity,translate] duration-300 ease-in ${hand ? "" : "invisible"} ${
            leaving ? "translate-x-[40vw] opacity-0" : ""
          }`}
        >
          {(hand ? cards : [0, 1, 2, 3, JOKER]).map((cardIndex, i) => {
            const card = cardIndex === JOKER ? null : facts[cardIndex];
            const title = card ? card.title : t.joker;
            const isFlipped = !!flipped[title];

            return (
              <li
                // La ronda en la key hace que cada mano nueva vuelva a entrar con la animación
                key={`${hand?.round ?? 0}-${title}`}
                className={`hero-card group ${hand ? "motion-safe:animate-hero-slide-in" : ""}`}
                // Entran desde la izquierda; sale primero la de más a la derecha, que es la que más viaja.
                style={{ aspectRatio: `1 / ${CARD_RATIO}`, animationDelay: `${(hand?.round ? 0 : 200) + (cards.length - 1 - i) * 140}ms` }}
              >
                <div className="relative size-full motion-safe:animate-hero-float" style={{ animationDelay: `${i * -700}ms` }}>
                  <div className="relative size-full perspective-[1000px] transition-[scale] duration-300 group-hover:scale-107 group-has-focus-visible:scale-107">
                    <div
                      className={`absolute -inset-[.6em] rounded-[1.6em] bg-glow/60 blur-2xl transition-opacity duration-500 motion-safe:animate-pulse ${isFlipped ? "opacity-0" : ""}`}
                      aria-hidden
                    />
                    <div
                      className="relative size-full transform-3d motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(.3,1.4,.5,1)]"
                      style={{ transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)" }}
                    >
                      {card ? <FactFace card={card} /> : <JokerFace photo={photo} name={name} photoOf={t.photoOf} />}
                      <div className={`${faceClass} rotate-y-180 shadow-[0_0_40px_6px_var(--color-glow)]`}>
                        <CardBack ratio={CARD_RATIO} />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-pressed={isFlipped}
                  aria-label={`${t.flip}: ${title}`}
                  className="absolute inset-0 cursor-pointer rounded-2xl"
                  onClick={() => setFlipped({ ...flipped, [title]: !isFlipped })}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className={`mt-2 flex justify-center ${hand ? "" : "invisible"}`}>
        <button
          type="button"
          onClick={reshuffle}
          disabled={leaving}
          className="group flex items-center gap-2 rounded-xl border-2 border-glow/60 bg-white/5 px-4 py-2 text-sm font-display font-bold text-paper/90 backdrop-blur-sm transition-[translate,box-shadow,color] hover:-translate-y-0.5 hover:text-paper hover:shadow-[0_0_24px_-4px_var(--color-glow)] disabled:cursor-wait"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 text-glow transition-transform duration-500 group-hover:rotate-180"
            aria-hidden
          >
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          {t.reshuffle}
        </button>
      </div>
    </>
  );
}
