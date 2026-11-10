import { Star } from "@/components/CardBack";
import { SectionTitle } from "@/components/Section";
import type { Language } from "@/data/portfolio";

// Idiomas como cartas coleccionables (TCG), con la misma cara que las cartas de "Sobre mí":
// borde con degradé rosa, fondo ciruela y estrellitas. La carta certificada lleva acabado
// holográfico (un brillo que la cruza) y un sello con la certificación.

const GOLD = "#f3c969";

export default function LanguageCards({ languages }: { languages: Language[] }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>
          Idiomas · Colección
        </SectionTitle>
        <p className="rounded-full border border-glow/40 px-3 py-1 font-display text-xs font-semibold tabular-nums text-paper/80">
          {languages.length} / {languages.length} cartas
        </p>
      </div>

      <ul className="mt-8 flex flex-wrap justify-center gap-8 md:gap-12">
        {languages.map((l) => (
          <li key={l.code} className="w-full max-w-[19rem]">
            <LanguageCard lang={l} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function LanguageCard({ lang }: { lang: Language }) {
  const foil = !!lang.cert;
  return (
    <article
      className={`group relative aspect-[5/7] rounded-2xl p-[1.5px] transition-[translate,box-shadow] duration-300 hover:-translate-y-2 ${
        foil
          ? "bg-linear-to-br from-[#fbe4f6] via-[#b3c7f8] to-[#e9a8dc] shadow-[0_0_34px_-6px_var(--color-marker)] hover:shadow-[0_0_48px_-2px_var(--color-marker)]"
          : "bg-linear-to-b from-[#ffaae9] via-[#d966ba] to-[#803575] shadow-[0_0_28px_-6px_var(--color-glow)] hover:shadow-[0_0_44px_-4px_var(--color-glow)]"
      }`}
    >
      <div className="relative flex size-full flex-col overflow-hidden rounded-[calc(1rem-1.5px)] bg-linear-to-b from-[#47204e] via-[#311537] to-[#210d26] p-4">
        {/* Acabado holográfico: un brillo que cruza la carta (más seguido al pasar el mouse) */}
        {foil && (
          <span
            className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(105deg,transparent_35%,rgb(251_228_246/.16)_45%,rgb(179_199_248/.22)_50%,rgb(233_168_220/.16)_55%,transparent_65%)] bg-size-[250%_100%] bg-position-[150%_0] mix-blend-screen motion-safe:animate-foil group-hover:[animation-duration:2.2s]"
            aria-hidden
          />
        )}

        {/* Encabezado: nombre y "costo" de la carta */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xl font-extrabold text-white">{lang.name}</h3>
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-full border font-display text-xs font-extrabold ${
              foil ? "border-marker/70 bg-marker/10 text-marker" : "border-glow/70 bg-glow/10 text-glow"
            }`}
            aria-hidden
          >
            {lang.code}
          </span>
        </div>

        {/* Arte: la runa del idioma */}
        <div className="relative mt-3 grid min-h-0 flex-1 place-items-center overflow-hidden rounded-xl border border-glow/30 bg-[radial-gradient(circle_at_50%_45%,rgb(233_168_220/.28),transparent_65%)]">
          <Star className="absolute left-3 top-3 size-2.5 text-[#ea9de0]/80" />
          <Star className="absolute bottom-3 right-3 size-2.5 text-[#ea9de0]/80" />
          <Star className="absolute right-6 top-6 size-1.5 text-white/60" />
          <span className="grid size-24 place-items-center rounded-full border border-glow/50 bg-[#2b1631]/80 shadow-[0_0_30px_-4px_var(--color-glow)] transition-[scale] duration-300 group-hover:scale-110">
            <Rune icon={lang.icon} className={`size-12 ${foil ? "text-marker" : "text-[#ffc2f4]"} drop-shadow-[0_0_8px_currentColor]`} />
          </span>
          {lang.cert && (
            <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: GOLD, color: GOLD }}>
              <Seal className="size-3.5" />
              Certificada
            </span>
          )}
        </div>

        {/* Línea de tipo: la rareza */}
        <p className="mt-3 flex items-center justify-between gap-2 border-y border-glow/25 py-1.5 text-[11px] font-bold uppercase tracking-wider">
          <span className="text-paper/60">Rareza</span>
          <span className={foil ? "text-marker" : "text-glow"}>{lang.rarity}</span>
        </p>

        {/* Lore */}
        <p className="mt-3 text-[13px] leading-snug text-[#eddbee]">{lang.lore}</p>

        {/* Pie: nivel y certificación */}
        <p className="mt-auto flex items-end justify-between gap-2 pt-3 text-[11px]">
          <span className="text-paper/55">{lang.cert ?? "Lengua materna"}</span>
          <span className="shrink-0 font-display text-sm font-extrabold text-white">{lang.level}</span>
        </p>
      </div>
    </article>
  );
}

// Runas: globo de diálogo (canal de voz) y pergamino (documentación)
function Rune({ icon, className = "" }: { icon: Language["icon"]; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {icon === "voice" ? (
        <>
          <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-9l-4.5 3.5v-3.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5Z" fill="currentColor" fillOpacity=".15" />
          <path d="M8 11h.01M12 11h.01M16 11h.01" strokeWidth="2.6" />
        </>
      ) : (
        <>
          <path d="M7 3.5h11.5v14a3 3 0 0 1-3 3H6a3 3 0 0 0 3-3V5a1.5 1.5 0 0 0-1.5-1.5Z" fill="currentColor" fillOpacity=".15" />
          <path d="M7.5 3.5A1.5 1.5 0 0 0 6 5v1.5h3M11.5 8.5h4M11.5 11.5h4M11.5 14.5h2.5M3 17.5h6" />
        </>
      )}
    </svg>
  );
}

function Seal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="9" r="6" />
      <path d="m9 14.5-1.5 7L12 19l4.5 2.5-1.5-7M9.5 9l1.7 1.7L14.5 7.5" />
    </svg>
  );
}
