import type { CSSProperties } from "react";
import type { UI } from "@/data/ui";

// Skills como fichas de póker: cada grupo es un color de ficha, con los tonos de la página.
// `ink` = texto oscuro (para las fichas claras).
type Chip = { color: string; edge: string; stripe: string; ink?: boolean };

const CHIPS: Chip[] = [
  { color: "#e9a8dc", edge: "#b06aa2", stripe: "#ffffff", ink: true }, // rosa (glow)
  { color: "#6f86e6", edge: "#3f53a8", stripe: "#ffffff" }, // azul (casillas de trabajo)
  { color: "#a3b16f", edge: "#6c7740", stripe: "#ffffff", ink: true }, // verde (accent)
  { color: "#5b3fa0", edge: "#33215f", stripe: "#e9a8dc" }, // violeta profundo, texto claro
  { color: "#432548", edge: "#22122a", stripe: "#e9a8dc" }, // ciruela (wine)
];
const SOFT: Chip = { color: "#b3c7f8", edge: "#6f86e6", stripe: "#ffffff", ink: true }; // celeste (marker)

// La letra se achica según la palabra más larga para que entre en el centro de la ficha
// (se mide en cqw: porcentaje del ancho de la ficha). Las palabras muy largas se cortan con guion.
// Con tres palabras o más (por ejemplo "React Testing Library") va un poco más chica: el círculo
// se angosta arriba y abajo.
function labelSize(label: string) {
  const words = label.split(" ");
  const longest = Math.max(...words.map((w) => w.length));
  const max = words.length >= 3 ? 10.5 : 12;
  return `${Math.min(max, 92 / Math.min(longest, 10)).toFixed(2)}cqw`;
}

function ChipFace({ label, chip }: { label: string; chip: Chip }) {
  return (
    <li
      className="group relative size-[5.25rem] shrink-0 select-none @container sm:size-24"
      style={{ "--chip": chip.color, "--edge": chip.edge, "--stripe": chip.stripe } as CSSProperties}
    >
      <div className="relative size-full rounded-full bg-(--chip) shadow-[0_5px_0_0_var(--edge),0_8px_14px_-4px_rgb(0_0_0/.6)] transition-[translate,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_7px_0_0_var(--edge),0_0_26px_-2px_var(--color-glow)]">
        {/* Borde con las franjas: gira al pasar el mouse */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-700 ease-out group-hover:rotate-90"
          style={{ background: "repeating-conic-gradient(from 11.25deg, var(--stripe) 0 22.5deg, transparent 22.5deg 45deg)" }}
          aria-hidden
        />
        {/* Centro de la ficha con el anillo punteado */}
        <div className="absolute inset-[13%] rounded-full bg-(--chip) shadow-[inset_0_2px_4px_rgb(0_0_0/.25)]" aria-hidden />
        <div className="absolute inset-[18%] rounded-full border-2 border-dashed border-(--stripe) opacity-80" aria-hidden />
        <span
          style={{ fontSize: labelSize(label) }}
          className={`absolute inset-[17%] flex items-center justify-center text-center font-display font-bold leading-[1.1] hyphens-auto ${
            chip.ink ? "text-ink" : "text-paper"
          }`}
        >
          {/* Con tres palabras, una por línea: así ninguna línea llega al anillo punteado */}
          {label.split(" ").length >= 3 ? (
            <span>
              {label.split(" ").map((w) => (
                <span key={w} className="block">
                  {w}
                </span>
              ))}
            </span>
          ) : (
            label
          )}
        </span>
      </div>
    </li>
  );
}

// Pila vista de costado, como en la foto: una moneda por skill del grupo.
function Stack({ count, chip }: { count: number; chip: Chip }) {
  return (
    <span className="relative inline-block h-8 w-7" aria-hidden>
      {Array.from({ length: Math.min(count, 6) }, (_, i) => (
        <span
          key={i}
          className="absolute inset-x-0 h-2 rounded-[50%] border"
          style={{ bottom: i * 4, background: chip.color, borderColor: chip.edge }}
        />
      ))}
    </span>
  );
}

export default function SkillChips({ groups, soft, t }: { groups: { group: string; items: string[] }[]; soft: string[]; t: UI["skills"] }) {
  const all = [...groups.map((g, i) => ({ ...g, chip: CHIPS[i % CHIPS.length] })), { group: t.soft, items: soft, chip: SOFT }];

  return (
    <div className="space-y-10">
      {all.map((g) => (
        <div key={g.group}>
          <h3 className="flex items-end gap-3 font-display text-lg font-bold">
            <Stack count={g.items.length} chip={g.chip} />
            {g.group}
            <span className="mb-0.5 text-xs font-semibold text-muted">
              {g.items.length} {t.chips}
            </span>
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2 sm:gap-3">
            {g.items.map((item) => (
              <ChipFace key={item} label={item} chip={g.chip} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
