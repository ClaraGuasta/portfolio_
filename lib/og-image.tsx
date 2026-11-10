import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/data/portfolio";

// Imagen para compartir el link (LinkedIn, WhatsApp, Slack…): cielo de estrellas como el sitio,
// la foto en una carta con borde rosa y el nombre con el rol. Se genera en el build.
// La usan app/(es)/opengraph-image.tsx y app/(en)/en/opengraph-image.tsx (nombre, rol y stack son iguales en los dos idiomas).
// ✏️ Los textos salen de data/portfolio.ts; las tecnologías de abajo se editan acá.
const STACK = ["React", "Next.js", "TypeScript", "Tailwind CSS"];

export const ogAlt = `${profile.name} · ${profile.role}`;
export const ogSize = { width: 1200, height: 630 };

// Archivos que no dependen del pedido: se leen una sola vez
const [photo, semibold, extrabold] = await Promise.all([
  readFile(join(process.cwd(), "public", profile.photo), "base64"),
  readFile(join(process.cwd(), "assets/fonts/Montserrat-600.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Montserrat-800.ttf")),
]);
const photoSrc = `data:image/jpeg;base64,${photo}`;

const GLOW = "#e9a8dc";
const MARKER = "#b3c7f8";
const PAPER = "#f6f7fd";

// Estrellas fijas (x, y, tamaño, brillo)
const STARS: [number, number, number, number][] = [
  [70, 60, 3, 0.9], [210, 540, 2, 0.6], [330, 40, 2, 0.7], [520, 90, 3, 0.8], [640, 560, 2, 0.6],
  [760, 40, 2, 0.5], [900, 110, 3, 0.9], [1120, 70, 2, 0.7], [1150, 330, 3, 0.8], [1060, 580, 2, 0.6],
  [470, 590, 3, 0.7], [40, 320, 2, 0.5], [600, 250, 2, 0.4], [1000, 250, 2, 0.5], [860, 520, 2, 0.7],
];

function Sparkle({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y }}>
      <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill={color} />
    </svg>
  );
}

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          fontFamily: "Montserrat",
          color: PAPER,
          backgroundColor: "#0a0d2c",
          backgroundImage:
            "radial-gradient(ellipse 70% 80% at 85% 0%, rgba(67,37,72,.75), transparent 70%), radial-gradient(ellipse 50% 70% at 22% 55%, rgba(116,130,232,.45), transparent 70%), linear-gradient(180deg, #0a0d2c, #161b5e 60%, #0a0d2c)",
        }}
      >
        {STARS.map(([x, y, r, o], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, backgroundColor: "white", opacity: o }} />
        ))}
        <Sparkle x={1080} y={150} s={26} color={GLOW} />
        <Sparkle x={560} y={470} s={18} color="white" />
        <Sparkle x={90} y={500} s={20} color={GLOW} />

        {/* La carta con la foto */}
        <div
          style={{
            display: "flex",
            marginLeft: 110,
            padding: 5,
            borderRadius: 30,
            transform: "rotate(-4deg)",
            backgroundImage: "linear-gradient(180deg, #ffaae9, #d966ba 55%, #803575)",
            boxShadow: `0 0 60px 4px rgba(233,168,220,.55)`,
          }}
        >
          <div style={{ display: "flex", padding: 12, borderRadius: 25, backgroundImage: "linear-gradient(180deg, #47204e, #2b1631)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og dibuja con <img>, no con next/image */}
            <img src={photoSrc} width={300} height={400} style={{ objectFit: "cover", borderRadius: 18 }} alt="" />
          </div>
        </div>

        {/* Nombre y rol */}
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 90, width: 610 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, fontWeight: 600, letterSpacing: 7, color: MARKER }}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 14 }}>
              <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill={GLOW} />
            </svg>
            PORTFOLIO
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -1, textShadow: `0 0 28px ${MARKER}` }}>
            {profile.name}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 36, fontWeight: 600, color: GLOW, textShadow: `0 0 18px ${GLOW}` }}>
            {profile.role}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 36 }}>
            {STACK.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  marginRight: 10,
                  marginBottom: 10,
                  padding: "8px 15px",
                  borderRadius: 10,
                  border: `2px solid rgba(233,168,220,.8)`,
                  backgroundColor: "#2a1630",
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Montserrat", data: semibold, weight: 600, style: "normal" },
        { name: "Montserrat", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
