"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { homePath, langOptions, type Lang, type UI } from "@/data/ui";

// Orden de las opciones del selector de idioma (el mismo de langOptions en data/ui.ts)
const langOrder = Object.keys(langOptions) as Lang[];

// Cierra un desplegable con Escape (y devuelve el foco a su botón) o tocando fuera de él
function useDismiss(open: boolean, setOpen: (open: boolean) => void, area: RefObject<HTMLElement | null>, button: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!area.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, setOpen, area, button]);
}

const Chevron = ({ open, className = "" }: { open: boolean; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
    aria-hidden
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Panel de los desplegables: aparece con un fundido corto
const dropdown = (open: boolean) =>
  `absolute top-[calc(100%+.5rem)] origin-top-right rounded-xl border border-glow/50 bg-[#1c0f24]/95 p-1.5 shadow-[0_0_30px_-8px_var(--color-glow)] transition-[opacity,scale,visibility] duration-200 ${
    open ? "scale-100 opacity-100" : "pointer-events-none invisible scale-95 opacity-0"
  }`;

// Selector de idioma: una pastilla con el idioma actual que despliega las opciones.
// Cada opción lleva a la otra versión del sitio y, si estabas en una sección, a la misma sección.
function LangMenu({ lang, label }: { lang: Lang; label: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useDismiss(open, setOpen, root, button);

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="menu-idioma"
        aria-label={`${label}: ${langOptions[lang].name}`}
        className={`flex items-center gap-1.5 rounded-full border-2 py-1 pl-3.5 pr-2.5 font-display text-sm font-bold text-paper transition-[border-color,box-shadow] ${
          open ? "border-glow shadow-[0_0_16px_-2px_var(--color-glow)]" : "border-glow/60 hover:border-glow hover:shadow-[0_0_14px_-4px_var(--color-glow)]"
        }`}
      >
        {langOptions[lang].short}
        <Chevron open={open} className="size-4 text-paper/70" />
      </button>

      <ul id="menu-idioma" className={`${dropdown(open)} right-0 w-28`}>
        {langOrder.map((l) => {
          const current = l === lang;
          return (
            <li key={l}>
              <a
                href={homePath[l]}
                hrefLang={l}
                lang={l}
                aria-current={current ? "true" : undefined}
                title={langOptions[l].name}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  if (!current) window.location.href = homePath[l] + window.location.hash;
                }}
                className={`block rounded-lg px-3 py-2 font-display text-sm font-bold ${
                  current ? "bg-marker text-ink" : "text-paper/85 hover:bg-glow/15 hover:text-paper"
                }`}
              >
                {langOptions[l].short}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Desde tablet los links van en fila. En el celular se guardan en un menú desplegable a la derecha.
// A la derecha de todo, el selector de idioma.
export default function Header({ lang, t }: { lang: Lang; t: UI["nav"] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useDismiss(open, setOpen, root, button);

  return (
    <header className="sticky top-0 z-20 border-b border-white/25 bg-transparent backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-4 md:px-6">
        <a href="#" className="font-display text-xl font-bold">CG</a>

        <div className="flex items-center gap-2 md:gap-6">
          <nav ref={root} aria-label={t.label} className="relative">
            {/* Tablet y escritorio: links en fila */}
            <ul className="flex gap-5 text-sm text-paper/75 max-md:hidden">
              {t.links.map(([label, href]) => (
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
              aria-label={open ? t.closeMenu : t.openMenu}
              className="grid size-10 place-items-center rounded-lg text-paper/85 hover:text-paper md:hidden"
            >
              <Chevron open={open} className="size-6" />
            </button>

            <ul id="menu-principal" className={`${dropdown(open)} right-0 w-56 md:hidden`}>
              {t.links.map(([label, href]) => (
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

          <LangMenu lang={lang} label={t.language} />
        </div>
      </div>
    </header>
  );
}
