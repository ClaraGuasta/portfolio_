"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import CardBack from "@/components/CardBack";
import Die3D, { type Die3DHandle } from "@/components/Die3D";
import ChestIcon from "@/components/ChestIcon";
import type { UI } from "@/data/ui";

// Cada número del dado es una carta (todas con foto horizontal) y tiene su tesoro.
export type DiceCard = { src: string; alt: string; title?: string; caption: string };

const TOSS: Keyframe[] = [
  { translate: "0 0", scale: 1 },
  { translate: "0 -2.5rem", scale: 1.12, offset: 0.18 },
  { translate: "0 0", scale: 0.96, offset: 0.4 },
  { translate: "0 -.8rem", scale: 1.04, offset: 0.55 },
  { translate: "0 0", scale: 1, offset: 0.7 },
  { translate: "0 -.2rem", offset: 0.8 },
  { translate: "0 0", scale: 1 },
];

// Mismo tamaño para el dorso y para la carta: no salta nada al darla vuelta
const cardSize = "w-full max-w-md";
const frame = "rounded-xl bg-white p-3 pb-4 text-ink";

export default function PolaroidDice({ cards, t }: { cards: DiceCard[]; t: UI["dice"] }) {
  const die = useRef<Die3DHandle>(null);
  const tossRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(-1); // índice de la carta a la vista
  const [found, setFound] = useState<number[]>([]); // las que salieron con el dado
  const [rolling, setRolling] = useState(false);
  const [reveals, setReveals] = useState(0); // reinicia la animación de la carta
  const [status, setStatus] = useState("");

  const show = (i: number) => {
    setShown(i);
    setReveals((r) => r + 1);
  };

  const roll = async () => {
    if (rolling) return;
    const n = 1 + Math.floor(Math.random() * cards.length);
    setRolling(true);
    // Salto del dado mientras gira (sin remontar el dado, que es el que anima el giro)
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tossRef.current?.animate(TOSS, { duration: 1500, easing: "ease-out" });
    }
    setStatus(t.rolling);
    await die.current?.roll(n);
    setRolling(false);
    show(n - 1);
    setFound((f) => (f.includes(n - 1) ? f : [...f, n - 1]));
    setStatus(`${t.rolled} ${n}.`);
  };

  const card = shown >= 0 && !rolling ? cards[shown] : null;

  return (
    <div className="mt-8 grid items-center gap-10 md:grid-cols-[16rem_1fr] md:gap-14">
      {/* El dado: se tira tocándolo */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={roll}
          aria-disabled={rolling}
          aria-label={t.roll}
          className="group relative size-44 cursor-pointer rounded-full aria-disabled:cursor-wait"
        >
          <span className="absolute inset-x-6 bottom-1 h-5 rounded-full bg-black/40 blur-md" aria-hidden />
          <span ref={tossRef} className="block size-full transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 group-aria-disabled:rotate-0 group-aria-disabled:scale-100">
            <Die3D ref={die} className="size-full drop-shadow-[0_0_18px_var(--color-glow)]" />
          </span>
        </button>
        <p className="font-display text-sm font-bold text-glow">{shown < 0 ? t.tapFirst : t.tapAgain}</p>
        <p className="h-5 text-sm text-muted" aria-live="polite">
          {status}
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Todas las cartas ocupan el mismo lugar: un molde invisible con todos los epígrafes apilados
            reserva el alto del más largo, y el dorso o la foto se dibujan encima. Así la página no salta. */}
        <div className={`${cardSize} relative`}>
          <div className={`${frame} invisible`} aria-hidden>
            <div className="aspect-[3/2] w-full" />
            <div className="grid">
              {cards.map((c) => (
                <Caption key={c.src} card={c} className="[grid-area:1/1]" />
              ))}
            </div>
          </div>
          <div className="absolute inset-0">
            {card ? (
              <Result key={reveals} card={card} index={shown} />
            ) : (
              <div
                className={`size-full rotate-1 overflow-hidden rounded-xl border-2 border-glow shadow-[0_0_40px_-4px_var(--color-glow)] ${
                  rolling ? "motion-safe:animate-pulse" : ""
                }`}
              >
                <CardBack wide />
              </div>
            )}
          </div>
        </div>

        {/* Los tesoros: se iluminan los que salieron con el dado, pero todos se pueden mirar */}
        <div className="text-center">
          <ol className="mt-3 flex flex-wrap justify-center gap-2">
            {cards.map((c, i) => {
              const seen = found.includes(i);
              const current = i === shown && !rolling;
              return (
                <li key={c.src}>
                  <button
                    type="button"
                    disabled={rolling}
                    onClick={() => show(i)}
                    aria-label={`${i + 1}: ${t.chest}${seen ? "" : ` ${t.notYet}`}`}
                    aria-current={current ? "true" : undefined}
                    title={`${i + 1} · ${t.chest}`}
                    className={`relative grid size-10 place-items-center rounded-xl border-2 transition hover:-translate-y-0.5 disabled:hover:translate-y-0 ${
                      current
                        ? "border-glow bg-glow text-wine shadow-[0_0_16px_var(--color-glow)]"
                        : seen
                          ? "border-glow/70 bg-wine text-glow"
                          : "border-white/15 text-white/30 hover:border-white/40 hover:text-white/60"
                    }`}
                  >
                    <ChestIcon className="size-5" />
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Caption({ card, className = "", as: Tag = "div" }: { card: DiceCard; className?: string; as?: "div" | "figcaption" }) {
  return (
    <Tag className={`mt-3 px-1 font-display leading-snug ${className}`}>
      {card.title ? (
        <>
          <span className="block text-lg font-bold">{card.title}</span>
          <span className="mt-0.5 block text-sm">{card.caption}</span>
        </>
      ) : (
        <span className="text-[15px] font-semibold">“{card.caption}”</span>
      )}
    </Tag>
  );
}

function Result({ card, index }: { card: DiceCard; index: number }) {
  return (
    <figure
      className={`${frame} relative size-full -rotate-1 shadow-[0_0_0_4px_var(--color-glow),0_0_50px_4px_var(--color-glow)] motion-safe:animate-card-reveal`}
    >
      <span className="absolute -left-3 -top-3 z-10 grid size-11 place-items-center rounded-full border-2 border-glow bg-wine text-glow shadow-[0_0_16px_var(--color-glow)]">
        <ChestIcon className="size-6" />
        <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-glow font-display text-[11px] font-extrabold text-wine">
          {index + 1}
        </span>
      </span>
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
        <Image src={card.src} alt={card.alt} fill sizes="448px" className="object-cover" />
      </div>
      <Caption card={card} as="figcaption" />
    </figure>
  );
}
