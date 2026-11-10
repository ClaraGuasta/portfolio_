"use client";

import { useEffect, useId, useRef, useState } from "react";
import OrgLogo from "@/components/OrgLogo";
import { Star } from "@/components/CardBack";
import type { Job, Project } from "@/data/portfolio";
import type { UI } from "@/data/ui";

type T = UI["experience"];

// La experiencia como recorrido de juego de mesa: un camino ancho que serpentea hacia abajo,
// con una casilla grande por paso (inicio, cada trabajo seguido de sus proyectos y la que falta escribir).
// El detalle se muestra como una carta: al costado del tablero en pantallas grandes, debajo en celular y tablet.
type Square =
  | { kind: "start"; title: string; sub: string; firstJob: Job }
  | { kind: "job"; title: string; sub: string; job: Job }
  | { kind: "project"; title: string; sub: string; project: Project; job: Job }
  | { kind: "goal"; title: string; sub: string };

function buildSquares(jobs: Job[], t: T): Square[] {
  const chronological = [...jobs].reverse();
  const first = chronological[0];
  const squares: Square[] = [{ kind: "start", title: t.start, sub: first.period.split(" – ")[0], firstJob: first }];
  for (const job of chronological) {
    squares.push({ kind: "job", title: job.company, sub: job.role, job });
    for (const project of job.projects ?? []) {
      squares.push({ kind: "project", title: project.short ?? project.name, sub: `${t.project} · ${job.company}`, project, job });
    }
  }
  squares.push({ kind: "goal", title: t.goalTitle, sub: t.goalSub });
  return squares;
}

// ── Geometría del camino ────────────────────────────────────────────────
// Tramos horizontales unidos por medias vueltas; el primero arranca en el borde izquierdo
// y el último termina en un borde. Son cuentas fijas: el servidor y el navegador dibujan lo mismo.
type Config = { W: number; rows: number; gap: number; road: number; margin: number };
const WIDE: Config = { W: 560, rows: 3, gap: 270, road: 150, margin: 12 };
const NARROW: Config = { W: 400, rows: 4, gap: 200, road: 120, margin: 8 };

const round = (n: number) => Math.round(n * 100) / 100;

function geometry({ W, rows, gap, road, margin }: Config, tiles: number) {
  const r = gap / 2;
  const L = r + road / 2 + margin; // x de los centros de las vueltas
  const edge = margin + road / 2;
  const y0 = margin + road / 2;
  const H = y0 * 2 + (rows - 1) * gap;

  const segs = Array.from({ length: rows }, (_, i) => {
    const right = i % 2 === 0;
    const xa = i === 0 ? edge : right ? L : W - L;
    const xb = i === rows - 1 ? (right ? W - edge : edge) : right ? W - L : L;
    return { y: y0 + i * gap, right, xa, xb, len: Math.abs(xb - xa) };
  });
  const arc = Math.PI * r;
  const total = segs.reduce((s, g) => s + g.len, 0) + (rows - 1) * arc;

  // Punto y dirección del camino a una distancia del inicio.
  const at = (dist: number) => {
    let d = Math.min(Math.max(dist, 0), total);
    for (let i = 0; i < rows; i++) {
      const g = segs[i];
      if (d <= g.len || i === rows - 1) {
        return { x: g.right ? g.xa + d : g.xa - d, y: g.y, angle: g.right ? 0 : Math.PI };
      }
      d -= g.len;
      if (d <= arc) {
        const sgn = g.right ? 1 : -1;
        const theta = -Math.PI / 2 + (sgn * d) / r;
        return { x: g.xb + r * Math.cos(theta), y: g.y + r + r * Math.sin(theta), angle: theta + (sgn * Math.PI) / 2 };
      }
      d -= arc;
    }
    return { x: 0, y: 0, angle: 0 };
  };

  let path = `M${round(segs[0].xa)} ${round(y0)}`;
  segs.forEach((g, i) => {
    path += ` L${round(g.xb)} ${round(g.y)}`;
    if (i < rows - 1) path += ` A${r} ${r} 0 0 ${g.right ? 1 : 0} ${round(g.xb)} ${round(g.y + gap)}`;
  });

  const tile = total / tiles;
  const across = (dist: number) => {
    const p = at(dist);
    const nx = -Math.sin(p.angle) * (road / 2);
    const ny = Math.cos(p.angle) * (road / 2);
    return `M${round(p.x + nx)} ${round(p.y + ny)} L${round(p.x - nx)} ${round(p.y - ny)}`;
  };
  const borders = Array.from({ length: tiles - 1 }, (_, k) => across((k + 1) * tile)).join(" ");
  const ends = `${across(0)} ${across(total)}`;
  const centers = Array.from({ length: tiles }, (_, k) => at((k + 0.5) * tile));

  return { W, H, road, total, tile, path, borders, ends, centers, at };
}

const kindColor = {
  start: "var(--color-wine)",
  job: "#6f86e6",
  project: "#c96bb5",
  goal: "var(--color-wine)",
};

function Pawn() {
  const id = useId(); // hay un tablero por tamaño de pantalla: cada ficha necesita su propio degradé
  return (
    <svg viewBox="0 0 40 56" className="h-full w-auto drop-shadow-[0_0_10px_var(--color-glow)]" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="var(--color-glow)" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`} stroke="var(--color-wine)" strokeWidth="1.5">
        <circle cx="20" cy="12" r="9" />
        <path d="M13 24 h14 l5 22 h-24 Z" />
        <rect x="4" y="45" width="32" height="8" rx="4" />
      </g>
    </svg>
  );
}

function Board({
  geo,
  squares,
  selected,
  pawnDist,
  onSelect,
  className,
  labelClass,
  label,
}: {
  geo: ReturnType<typeof geometry>;
  squares: Square[];
  selected: number;
  pawnDist: number;
  onSelect: (i: number) => void;
  className: string;
  labelClass: string;
  label: string;
}) {
  const pct = (p: { x: number; y: number }) => ({ left: `${(p.x / geo.W) * 100}%`, top: `${(p.y / geo.H) * 100}%` });
  // La ficha sigue el camino y se para a la derecha del texto de su casilla (--pawn-x).
  const pawnPoint = geo.at(pawnDist);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${geo.W} ${geo.H}`} className="block w-full" aria-hidden>
        <path d={geo.path} fill="none" stroke="var(--color-glow)" strokeWidth={geo.road + 12} style={{ filter: "drop-shadow(0 0 12px var(--color-glow))" }} />
        <path d={geo.path} fill="none" stroke="var(--color-paper)" strokeWidth={geo.road} />
        {/* La casilla elegida se tiñe de rosa */}
        <path
          d={geo.path}
          fill="none"
          stroke="var(--color-glow)"
          strokeOpacity=".45"
          strokeWidth={geo.road}
          strokeDasharray={`${geo.tile} ${geo.total}`}
          strokeDashoffset={-selected * geo.tile}
          className="transition-[stroke-dashoffset] duration-300"
        />
        <path d={geo.borders} stroke="var(--color-wine)" strokeOpacity=".55" strokeWidth="3" />
        <path d={geo.ends} stroke="var(--color-glow)" strokeWidth="6" />
      </svg>

      <ol>
        {squares.map((s, i) => (
          <li key={s.title} className="absolute -translate-1/2" style={pct(geo.centers[i])}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={i === selected ? "step" : undefined}
              aria-label={`${label} ${i + 1}: ${s.title} · ${s.sub}`}
              className={`group flex flex-col items-center justify-center rounded-2xl text-center text-ink ${labelClass}`}
            >
              <span
                className="flex size-[2em] items-center justify-center rounded-full font-display text-[.85em] font-extrabold text-paper shadow-[0_0_0_3px_var(--color-paper)] transition-transform group-hover:scale-110"
                style={{ background: kindColor[s.kind] }}
              >
                {i + 1}
              </span>
              <span className="mt-[.35em] font-display font-extrabold leading-tight">{s.title}</span>
              <span className="mt-[.15em] text-[.75em] font-medium leading-snug text-ink/70">{s.sub}</span>
            </button>
          </li>
        ))}
      </ol>

      <span className="pointer-events-none absolute z-10 h-12 translate-x-[calc(var(--pawn-x)-50%)] -translate-y-[85%] md:h-14" style={pct(pawnPoint)} aria-hidden>
        <Pawn />
      </span>
    </div>
  );
}

const chip = "rounded-full border border-glow/60 px-3 py-1 text-sm font-medium";

function Detail({ square, index, squares, onGo, t }: { square: Square; index: number; squares: Square[]; onGo: (i: number) => void; t: T }) {
  const eyebrow = (
    <p className="flex items-center gap-1.5 text-sm font-semibold text-glow">
      <Star className="size-3" />
      {t.square} {index + 1}
    </p>
  );

  if (square.kind === "start") {
    return (
      <>
        {eyebrow}
        <h3 className="mt-1 font-display text-2xl font-extrabold">{t.start} · {square.sub}</h3>
        <p className="mt-3">{t.startText}</p>
      </>
    );
  }

  if (square.kind === "goal") {
    return (
      <>
        {eyebrow}
        <h3 className="mt-1 font-display text-2xl font-extrabold">{t.goalHeading}</h3>
        <p className="mt-3">{t.goalText}</p>
        <a href="#contacto" className="mt-5 inline-block rounded-full bg-glow px-6 py-3 font-semibold text-ink hover:opacity-90">
          {t.goalCta}
        </a>
      </>
    );
  }

  if (square.kind === "project") {
    const { project, job } = square;
    return (
      <>
        {eyebrow}
        <p className="mt-1 flex items-center gap-2 text-sm text-muted">
          <OrgLogo logo={job.logo} />
          {t.projectAt} {job.company}
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold">{project.name}</h3>
        <ul className="mt-4 list-disc space-y-1.5 pl-5">
          {project.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s} className={chip}>{s}</li>
          ))}
        </ul>
      </>
    );
  }

  const { job } = square;
  const projectSquares = squares.flatMap((s, i) => (s.kind === "project" && s.job === job ? [{ s, i }] : []));
  return (
    <>
      {eyebrow}
      <p className="mt-1 text-sm text-muted">{job.period}</p>
      <h3 className="mt-1 font-display text-2xl font-extrabold">{job.role}</h3>
      <p className="mt-2 flex items-center gap-2 text-muted">
        <OrgLogo logo={job.logo} />
        {job.company}{job.place ? ` · ${job.place}` : ""}
      </p>
      {job.summary && <p className="mt-4">{job.summary}</p>}
      {job.description.length > 0 && (
        <ul className="mt-4 list-disc space-y-1.5 pl-5">
          {job.description.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
      {projectSquares.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {projectSquares.map(({ s, i }) => (
            <li key={s.title}>
              <button type="button" onClick={() => onGo(i)} className="rounded-xl border border-glow/60 bg-white/5 px-4 py-2 text-left text-sm font-semibold hover:bg-glow/20">
                {t.square} {i + 1} → {s.kind === "project" ? s.project.name : s.title}
              </button>
            </li>
          ))}
        </ul>
      )}
      {job.stack && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {job.stack.map((s) => (
            <li key={s} className={chip}>{s}</li>
          ))}
        </ul>
      )}
    </>
  );
}

// Cara de carta para el detalle: misma paleta y borde interior que las cartas del inicio.
const cardClass =
  "relative rounded-3xl border-2 border-glow/70 bg-linear-to-br from-[#5d3366] via-wine to-[#2b1631] p-6 text-paper shadow-[0_0_40px_-10px_var(--color-glow)] md:p-8";

export default function ExperienceBoard({ jobs, t }: { jobs: Job[]; t: T }) {
  const squares = buildSquares(jobs, t);
  const [geo] = useState(() => ({ wide: geometry(WIDE, squares.length), narrow: geometry(NARROW, squares.length) }));
  const tile = (i: number) => (i + 0.5) / squares.length; // posición de la casilla, de 0 a 1 del camino
  const [selected, setSelected] = useState(0);
  const [pawn, setPawn] = useState(tile(0));
  const pawnRef = useRef(pawn);
  const frame = useRef(0);
  const detail = useRef<HTMLElement>(null);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // La ficha recorre el camino hasta la casilla elegida. En celular y tablet la carta está abajo
  // del tablero: al llegar, si no se ve, la página baja lo justo para mostrarla.
  const select = (i: number) => {
    setSelected(i);
    cancelAnimationFrame(frame.current);
    const wide = window.matchMedia("(min-width: 64rem)").matches;
    const open = () => {
      if (!wide) detail.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    const from = pawnRef.current;
    const to = tile(i);
    const steps = Math.abs(to - from) * squares.length;
    const duration = Math.min(250 + steps * 300, 1400);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || steps === 0) {
      pawnRef.current = to;
      setPawn(to);
      open();
      return;
    }
    const start = performance.now();
    const move = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      pawnRef.current = from + (to - from) * eased;
      setPawn(pawnRef.current);
      if (t < 1) frame.current = requestAnimationFrame(move);
      else open();
    };
    frame.current = requestAnimationFrame(move);
  };

  return (
    // Escritorio: tablero y carta en fila. Celular y tablet: la carta va abajo del tablero.
    <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-start">
      <div className="mx-auto w-full max-w-md shrink-0 rounded-[2rem] border-4 border-glow bg-[#1d2470] p-4 shadow-[0_0_0_6px_#432548,0_0_60px_-10px_var(--color-glow)] md:p-6 lg:mx-0 lg:w-[32rem] lg:max-w-none">
        <Board geo={geo.narrow} squares={squares} selected={selected} pawnDist={pawn * geo.narrow.total} onSelect={select} label={t.square} className="[--pawn-x:2.9rem] min-[360px]:[--pawn-x:3.4rem] lg:hidden" labelClass="w-20 text-[11px] min-[360px]:w-24 min-[360px]:text-[13px]" />
        <Board geo={geo.wide} squares={squares} selected={selected} pawnDist={pawn * geo.wide.total} onSelect={select} label={t.square} className="[--pawn-x:4.5rem] max-lg:hidden" labelClass="w-32 text-[15px]" />
      </div>

      {/* La carta del detalle: al costado en escritorio (acompaña el scroll), abajo en celular y tablet */}
      <aside
        ref={detail}
        className={`${cardClass} mx-auto w-full max-w-xl scroll-mt-24 lg:sticky lg:top-24 lg:mx-0 lg:max-w-none lg:min-w-0 lg:flex-1`}
        aria-live="polite"
      >
        <div key={selected} className="relative motion-safe:animate-cta-in">
          <Detail square={squares[selected]} index={selected} squares={squares} onGo={select} t={t} />
        </div>
      </aside>
    </div>
  );
}
