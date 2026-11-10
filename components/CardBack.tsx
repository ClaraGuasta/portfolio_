// Estrella de cuatro puntas, centrada en (0, 0) y con radio 1: se ajusta con `transform`.
const STAR = "M0 -1 C.1 -.3 .3 -.1 1 0 C.3 .1 .1 .3 0 1 C-.1 .3 -.3 .1 -1 0 C-.3 -.1 -.1 -.3 0 -1Z";

export function Star({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="-1 -1 2 2" fill="currentColor" className={className} style={style} aria-hidden>
      <path d={STAR} />
    </svg>
  );
}

// Adorno de una esquina; las otras tres son la misma figura espejada.
const FLOURISH = "M30 110 C28 68 42 44 78 30 C60 50 56 70 62 96 C52 84 40 90 30 110Z M96 28 C78 34 70 42 66 54 C76 46 86 40 112 36 C106 34 100 32 96 28Z";
const corners = (w: number, h: number) => ["", `translate(${w} 0) scale(-1 1)`, `translate(0 ${h}) scale(1 -1)`, `translate(${w} ${h}) scale(-1 -1)`];

// `wide`: dorso horizontal (5:4, como una foto apaisada con su epígrafe).
// `ratio`: alto / ancho de un dorso vertical (por defecto 4/3). El dibujo se arma a esa medida exacta,
// así no se recorta nada: la estrella grande se estira con el alto y los adornos quedan en las esquinas.
export default function CardBack({ wide = false, ratio = 4 / 3 }: { wide?: boolean; ratio?: number }) {
  const w = wide ? 450 : 300;
  const h = wide ? 360 : Math.round(300 * ratio);
  const [cx, cy] = [w / 2, h /  2];
  // La estrella grande se estira a lo largo de la carta; las chicas van en los extremos de ese eje
  const [sx, sy] = wide ? [1.28, 1] : [1, (1.28 * h) / 400];
  const tips = wide ? [[48, cy], [w - 48, cy]] : [[cx, 52], [cx, h - 52]];
  // Ids propios por medida: si hay dos dorsos distintos en la página, no se pisan los gradientes
  const id = (name: string) => `${name}-${w}x${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <defs>
        <linearGradient id={id("card-base")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d3366" />
          <stop offset=".5" stopColor="#432548" />
          <stop offset="1" stopColor="#2b1631" />
        </linearGradient>
        <radialGradient id={id("card-halo")}>
          <stop offset="0" stopColor="#e9a8dc" stopOpacity=".55" />
          <stop offset="1" stopColor="#e9a8dc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("card-edge")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe4f6" />
          <stop offset=".5" stopColor="#e9a8dc" />
          <stop offset="1" stopColor="#b3c7f8" />
        </linearGradient>
      </defs>

      <rect width={w} height={h} fill={`url(#${id("card-base")})`} />
      <circle cx={cx} cy={cy} r={wide ? 130 : (130 * h) / 400} fill={`url(#${id("card-halo")})`} />
      <rect x="14" y="14" width={w - 28} height={h - 28} rx="18" fill="none" stroke={`url(#${id("card-edge")})`} strokeWidth="2.5" />

      {corners(w, h).map((transform) => (
        <path key={transform} d={FLOURISH} transform={transform} fill="#e9a8dc" fillOpacity=".75" />
      ))}

      <path d={STAR} transform={`translate(${cx} ${cy}) scale(${92 * sx} ${92 * sy})`} fill="none" stroke={`url(#${id("card-edge")})`} strokeWidth=".022" />
      <path d={STAR} transform={`translate(${cx} ${cy}) scale(${62 * sx} ${62 * sy})`} fill="#e9a8dc" fillOpacity=".5" />
      <path d={STAR} transform={`translate(${cx} ${cy}) scale(${30 * sx} ${30 * sy})`} fill="#fbe4f6" />
      {tips.map(([x, y]) => (
        <path key={`${x}-${y}`} d={STAR} transform={`translate(${x} ${y}) scale(11)`} fill="#fbe4f6" />
      ))}
    </svg>
  );
}
