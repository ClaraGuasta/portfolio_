"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Star } from "@/components/CardBack";
import OrgLogo from "@/components/OrgLogo";
import { SectionTitle } from "@/components/Section";
import type { Study } from "@/data/portfolio";
import type { UI } from "@/data/ui";

type T = UI["education"];

// Educación como el mapa de mundos de un juego de plataformas: un camino punteado une cada estudio.
// Lo terminado es un mundo superado (trofeo y 3 estrellas); lo que se está cursando es el checkpoint
// actual, con su barra de energía. Al pasar el mouse o tocar un mundo, abajo se ve su contenido:
// el "loot" obtenido o el camino de materias del nivel.

const GOLD = "#f3c969";
const SEGMENTS = 10; // segmentos de la barra de energía

// Sin caja: una línea punteada separa el contenido del mapa
const panel = "border-t border-dashed border-glow/30 pt-8";

export default function WorldMap({ studies, t }: { studies: Study[]; t: T }) {
  // En orden de juego: primero lo superado, al final el checkpoint actual
  const worlds = [...studies].sort((a, b) => Number(!!a.current) - Number(!!b.current));
  const [selected, setSelected] = useState(worlds.findIndex((w) => w.current) === -1 ? 0 : worlds.findIndex((w) => w.current));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const done = worlds.filter((w) => !w.current).length;
  const panels = useRef<HTMLDivElement>(null);

  // Al tocar un mundo en el celular (el mapa va en columna), la página baja hasta su contenido
  // para que se vean el loot y las materias.
  const pick = (i: number) => {
    setSelected(i);
    if (!window.matchMedia("(max-width: 47.99rem)").matches) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => panels.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
  };

  const onKey = (e: KeyboardEvent) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    const next = (selected + delta + worlds.length) % worlds.length;
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>{t.title}</SectionTitle>
        <p className="rounded-full border border-glow/40 px-3 py-1 font-display text-xs font-semibold tabular-nums text-paper/80">
          {done} / {worlds.length} {t.cleared}
        </p>
      </div>

      {/* El mapa: inicio, un nodo por mundo y el próximo mundo bloqueado, unidos por el camino */}
      <div className="mt-8 flex flex-col items-center md:flex-row md:items-start" role="tablist" aria-label={t.worlds} onKeyDown={onKey}>
        <Landmark label={t.start}>
          <Flag className="size-6 text-paper/70" />
        </Landmark>
        {worlds.map((w, i) => (
          <div key={w.title} className="contents">
            <Path />
            <WorldNode
              world={w}
              number={i + 1}
              selected={i === selected}
              onSelect={() => setSelected(i)}
              onPick={() => pick(i)}
              t={t}
              buttonRef={(el) => {
                tabs.current[i] = el;
              }}
            />
          </div>
        ))}
        <Path faded />
        <Landmark label={t.next} locked>
          <Lock className="size-5 text-paper/40" />
        </Landmark>
      </div>

      {/* Contenido del mundo elegido. Desde tablet los dos paneles ocupan la misma celda: el alto es el
          del más largo y la sección no salta al pasar el mouse. En el celular se muestra solo el elegido. */}
      <div ref={panels} className="mt-10 grid scroll-mt-4">
        {worlds.map((w, i) => (
          <div
            key={w.title}
            id={`world-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`world-tab-${i}`}
            className={`transition-opacity duration-300 md:[grid-area:1/1] ${i === selected ? "" : "max-md:hidden md:invisible md:opacity-0"}`}
          >
            {w.current ? <LevelPath world={w} t={t} /> : <Loot world={w} t={t} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Columna de un punto del mapa: arriba un espacio fijo (estrellas o "estás acá") y el nodo en una
// caja de alto fijo, así todos los centros quedan alineados con el camino.
const slot = "flex h-8 items-end justify-center";
const nodeBox = "grid h-28 place-items-center";

function WorldNode({
  world,
  number,
  selected,
  onSelect,
  onPick,
  buttonRef,
  t,
}: {
  world: Study;
  number: number;
  selected: boolean;
  onSelect: () => void;
  onPick: () => void; // tocar o hacer clic (a diferencia de pasar el mouse)
  buttonRef: (el: HTMLButtonElement | null) => void;
  t: T;
}) {
  const cleared = !world.current;
  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      id={`world-tab-${number - 1}`}
      aria-selected={selected}
      aria-controls={`world-panel-${number - 1}`}
      tabIndex={selected ? 0 : -1}
      onClick={onPick}
      onPointerEnter={(e) => e.pointerType === "mouse" && onSelect()}
      className="group flex w-56 shrink-0 flex-col md:w-44 lg:w-60 items-center gap-2 rounded-3xl p-2 text-center"
    >
      <span className={slot} aria-hidden>
        {cleared ? (
          <span className="flex items-end gap-1" style={{ color: GOLD }}>
            <Star className="size-4 drop-shadow-[0_0_4px_#f3c969]" />
            <Star className="mb-1.5 size-6 drop-shadow-[0_0_6px_#f3c969]" />
            <Star className="size-4 drop-shadow-[0_0_4px_#f3c969]" />
          </span>
        ) : (
          <span className="rounded-full bg-glow px-2.5 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-widest text-wine shadow-[0_0_12px_var(--color-glow)] motion-safe:animate-bounce">
            {t.here}
          </span>
        )}
      </span>

      <span className={nodeBox}>
        <span
          className={`relative grid size-24 place-items-center rounded-full border-2 transition-[scale,box-shadow] duration-300 group-hover:scale-105 ${
            cleared
              ? "border-[#f3c969] bg-[radial-gradient(circle_at_35%_30%,#5a4420,#2a1d0c)] shadow-[0_0_30px_-4px_#f3c969]"
              : "border-glow bg-[radial-gradient(circle_at_35%_30%,#5d3366,#2b1631)] shadow-[0_0_30px_-4px_var(--color-glow)]"
          } ${selected ? "scale-110 outline-3 outline-offset-6 " + (cleared ? "outline-[#f3c969]/50" : "outline-glow/50") : ""}`}
        >
          {/* El checkpoint actual late */}
          {!cleared && <span className="absolute -inset-2 rounded-full border-2 border-glow/60 motion-safe:animate-ping [animation-duration:2.2s]" aria-hidden />}
          {cleared ? <Trophy className="size-11" style={{ color: GOLD }} /> : <Flag className="size-10 text-glow" />}
          <span
            className={`absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 font-display text-xs font-extrabold ${
              cleared ? "border-[#f3c969] bg-[#2a1d0c] text-[#f3c969]" : "border-glow bg-wine text-glow"
            }`}
            aria-hidden
          >
            {number}
          </span>
        </span>
      </span>

      <span className="mt-1 font-display text-[11px] font-bold uppercase tracking-[.2em]" style={{ color: cleared ? GOLD : "var(--color-glow)" }}>
        {t.world} {number} · {cleared ? t.clearedTag : t.checkpoint}
      </span>
      <span className="font-display text-lg font-bold leading-tight text-balance text-paper">{world.title}</span>
      <span className="text-sm text-muted">{world.school}</span>

      {!cleared && world.progress !== undefined && <Energy value={world.progress} label={t.progress} />}
    </button>
  );
}

// Barra de energía en segmentos, como la vida de un personaje
function Energy({ value, label }: { value: number; label: string }) {
  const filled = Math.round(value * SEGMENTS);
  return (
    <span className="mt-1 flex items-center gap-2" aria-label={`${label}: ${Math.round(value * 100)} %`}>
      <span className="flex gap-0.5 rounded-md border border-glow/50 bg-black/30 p-0.5" aria-hidden>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${i < filled ? "bg-glow shadow-[0_0_6px_var(--color-glow)]" : "bg-white/10"}`} />
        ))}
      </span>
      <span className="font-display text-xs font-bold tabular-nums text-glow" aria-hidden>
        {Math.round(value * 100)}%
      </span>
    </span>
  );
}

function Landmark({ label, locked = false, children }: { label: string; locked?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2 p-2" aria-hidden>
      <span className={slot} />
      <span className={nodeBox}>
        <span className={`grid size-14 place-items-center rounded-full border-2 ${locked ? "border-dashed border-white/20" : "border-paper/40 bg-white/5"}`}>
          {children}
        </span>
      </span>
      <span className="mt-1 font-display text-[11px] font-bold uppercase tracking-[.2em] text-paper/40">{label}</span>
    </div>
  );
}

// Tramo del camino punteado: vertical en el celular, horizontal desde tablet, a la altura de los nodos
function Path({ faded = false }: { faded?: boolean }) {
  return (
    <span
      className={`h-10 w-0 border-l-2 border-dashed md:mt-[calc(.5rem+2rem+.5rem+3.5rem)] md:h-0 md:min-w-3 md:flex-1 md:border-l-0 md:border-t-2 ${
        faded ? "border-white/15" : "border-glow/70 drop-shadow-[0_0_4px_var(--color-glow)]"
      }`}
      aria-hidden
    />
  );
}

function PanelHeader({ world, kicker, color }: { world: Study; kicker: string; color: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <OrgLogo logo={world.logo} />
      <div className="min-w-0">
        <p className="font-display text-[11px] font-bold uppercase tracking-[.2em]" style={{ color }}>
          {kicker}
        </p>
        <p className="text-sm text-paper/75">
          {world.school}
          {world.degree ? ` · ${world.degree}` : ""} · {world.period}
        </p>
      </div>
    </div>
  );
}

// Mundo superado: lo aprendido como inventario de loot
function Loot({ world, t }: { world: Study; t: T }) {
  return (
    <div className={panel}>
      <PanelHeader world={world} kicker={`${t.loot} · ${world.contents.length} ${t.items}`} color={GOLD} />
      <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {world.contents.map((c) => (
          <li key={c} className="flex items-center gap-3 rounded-xl border border-[#f3c969]/25 bg-[#f3c969]/[.04] p-2 pr-3 text-sm text-paper/90">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-[#f3c969]/40 bg-[#f3c969]/10" aria-hidden>
              <Star className="size-3.5" style={{ color: GOLD }} />
            </span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Checkpoint actual: las materias como monedas sobre el camino del nivel
function LevelPath({ world, t }: { world: Study; t: T }) {
  return (
    <div className={panel}>
      <PanelHeader world={world} kicker={`${t.levelPath} · ${world.contentsLabel}`} color="var(--color-glow)" />
      <ol className="relative mt-6 flex flex-col gap-4 lg:flex-row lg:gap-2">
        {/* Celular: una línea punteada vertical que une las monedas */}
        <span className="absolute bottom-4 left-[1.125rem] top-4 border-l-2 border-dashed border-glow/50 lg:hidden" aria-hidden />
        {world.contents.map((c, i) => {
          const last = i === world.contents.length - 1;
          const down = i % 2 === 0; // de una moneda de arriba se baja a la siguiente, y al revés
          return (
            <li key={c} className={`relative flex items-center gap-3 lg:flex-1 lg:flex-col lg:gap-2 lg:text-center ${down ? "" : "lg:mt-8"}`}>
              {/* Escritorio: tramo en diagonal desde el centro de esta moneda hasta el de la siguiente
                  (el ancho de una columna más el gap, y 2rem de alto, lo que baja o sube) */}
              {!last && (
                <svg
                  className={`absolute left-1/2 hidden h-8 w-[calc(100%+.5rem)] overflow-visible lg:block ${down ? "top-[1.125rem]" : "top-[calc(1.125rem-2rem)]"}`}
                  aria-hidden
                >
                  <line
                    x1="0"
                    y1={down ? "0" : "100%"}
                    x2="100%"
                    y2={down ? "100%" : "0"}
                    stroke="var(--color-glow)"
                    strokeOpacity=".55"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                </svg>
              )}
              <span className="relative grid size-9 shrink-0 place-items-center rounded-full border-2 border-glow bg-wine font-display text-xs font-extrabold text-glow shadow-[0_0_14px_-2px_var(--color-glow)]" aria-hidden>
                {i + 1}
              </span>
              <span className="text-sm leading-snug text-paper/90 lg:text-[13px]">{c}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Trophy({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" fill="currentColor" fillOpacity=".3" />
      <path d="M7 6H4.5a2.5 2.5 0 0 0 2.6 3.9M17 6h2.5a2.5 2.5 0 0 1-2.6 3.9M12 14v3M8.5 20.5h7l-.8-3.5H9.3Z" />
    </svg>
  );
}

function Flag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 21V4" />
      <path d="M5 4h12l-2.5 4L17 12H5" fill="currentColor" fillOpacity=".3" />
    </svg>
  );
}

function Lock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
