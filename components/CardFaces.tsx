import Image from "next/image";
import { Star } from "@/components/CardBack";
import type { ProfileCard } from "@/data/portfolio";

export const faceClass = "absolute inset-0 overflow-hidden rounded-2xl shadow-[0_0_28px_-6px_var(--color-glow)] backface-hidden";

export function InfoFace({ card }: { card: ProfileCard }) {
  return (
    <div className={`${faceClass} bg-linear-to-br from-[#5d3366] via-wine to-[#2b1631] text-paper`}>
      <div className="absolute inset-2 rounded-xl border border-glow/70" />
      <span className="absolute left-4 top-3.5 flex items-center gap-1 font-bold text-glow">
        <Star className="size-3" />
      </span>
      <span className="absolute bottom-3.5 right-4 flex rotate-180 items-center gap-1 font-bold text-glow" aria-hidden>
        <Star className="size-3" />
      </span>
      <div className="flex h-full flex-col justify-center px-6 py-10 text-left">
        <h3 className="font-display text-lg font-bold leading-tight text-glow">{card.title}</h3>
        <p className="mt-2.5 text-[13px] leading-snug lg:text-sm">{card.text}</p>
      </div>
    </div>
  );
}

// Estrella de cuatro puntas con lados curvos (la del diseño de Gemini)
function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-11 -11 22 22" fill="currentColor" className={className} aria-hidden>
      <path d="M0-11Q0 0 11 0Q0 0 0 11Q0 0-11 0Q0 0 0-11Z" />
    </svg>
  );
}

// Dato corto y grande. Mide todo en `em`: escala con el tamaño de fuente de la carta.
// Borde con degradé rosa (el fondo de afuera hace de borde) y fondo ciruela de arriba hacia abajo.
export function FactFace({ card }: { card: ProfileCard }) {
  return (
    <div className={`${faceClass} bg-linear-to-b from-[#ffaae9] via-[#d966ba] to-[#803575] p-[1.5px] text-white`}>
      <div className="relative size-full rounded-[calc(1rem-1.5px)] bg-linear-to-b from-[#47204e] via-[#311537] to-[#210d26]">
        <Sparkle className="absolute left-[.65em] top-[.65em] size-[.55em] text-[#ea9de0]/85" />
        <Sparkle className="absolute bottom-[.65em] right-[.65em] size-[.55em] text-[#ea9de0]/85" />
        <div className="flex h-full flex-col items-center px-[.8em] pt-[22%] text-center gap-[14px]">
          <Sparkle className="size-[1.4em] shrink-0 text-[#ffc2f4] drop-shadow-[0_0_6px_#ffaae9]" />
          <h3 className="mt-[1.1em] font-display text-[1.3em] font-bold leading-tight">{card.title}</h3>
          <p className="mt-[.6em] text-[.9em] leading-snug text-[#eddbee]">{card.text}</p>
        </div>
      </div>
    </div>
  );
}

export function JokerFace({ photo, name, photoOf = "Foto de" }: { photo: string; name: string; photoOf?: string }) {
  return (
    <div className={`${faceClass} bg-wine shadow-[0_0_40px_-2px_var(--color-glow)]`}>
      <Image src={photo} alt={`${photoOf} ${name}`} width={480} height={640} loading="eager" sizes="288px" className="size-full origin-[50%_35%] scale-125 object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-wine to-transparent" />
      <div className="absolute inset-2 rounded-xl border-2 border-glow" />
      <Star className="absolute right-4 top-4 size-6 text-white drop-shadow-[0_0_4px_var(--color-glow)]" />
      <Star className="absolute left-4 top-4 size-6 text-white drop-shadow-[0_0_4px_var(--color-glow)]" />
      <div className="absolute inset-x-0 bottom-4 text-center text-paper">
        <p className="mt-1 text-xs font-semibold">{name}</p>
      </div>
    </div>
  );
}
