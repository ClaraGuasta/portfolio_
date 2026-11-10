"use client";

import { useEffect, useRef, useState } from "react";

const nav = [
  ["Sobre mí", "#sobre-mi"],
  ["Experiencia", "#experiencia"],
  ["Skills", "#skills"],
  ["Recomendaciones", "#recomendaciones"],
  ["Contacto", "#contacto"],
];

// Desde tablet los links van en fila. En el celular se guardan en un menú desplegable a la derecha.
export default function Header() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // El menú se cierra con Escape (y el foco vuelve al botón) o tocando fuera de él
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-20 border-b border-white/25 bg-transparent backdrop-blur-md">
      <div ref={root} className="relative mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-4 md:px-6">
        <a href="#" className="font-display text-xl font-bold">CG</a>

        <nav aria-label="Principal">
          {/* Tablet y escritorio: links en fila */}
          <ul className="flex gap-5 text-sm text-paper/75 max-md:hidden">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="whitespace-nowrap hover:text-paper">{label}</a>
              </li>
            ))}
          </ul>

          {/* Celular: botón de menú y lista desplegable */}
          <button
            ref={button}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-principal"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-10 place-items-center rounded-lg text-paper/85 hover:text-paper md:hidden"
          >
            {/* Flecha hacia abajo; al abrir el menú gira y apunta hacia arriba */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`size-6 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <ul
            id="menu-principal"
            className={`absolute right-4 top-[calc(100%+.5rem)] w-56 origin-top-right rounded-xl border border-glow/50 bg-[#1c0f24]/95 p-2 shadow-[0_0_30px_-8px_var(--color-glow)] transition-[opacity,scale,visibility] duration-200 md:hidden ${
              open ? "scale-100 opacity-100" : "pointer-events-none invisible scale-95 opacity-0"
            }`}
          >
            {nav.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 font-display text-sm font-semibold text-paper/85 hover:bg-glow/15 hover:text-paper"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
