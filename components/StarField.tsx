// Cielo de estrellas de todo el sitio, fijo detrás del contenido. Las posiciones salen de un generador con semilla fija:
// tienen que dar lo mismo en el servidor y en el navegador.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

const random = seeded(7);
const STARS = Array.from({ length: 70 }, (_, i) => ({
  left: random() * 100,
  top: random() * 100,
  size: 1 + random() * 2.5,
  sparkle: i % 7 === 0, // algunas son destellos de cuatro puntas
  delay: random() * 4,
}));

export default function StarField() {
  return (
    <div className="site-sky pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {STARS.map((s, i) =>
        s.sparkle ? (
          <svg
            key={i}
            viewBox="-1 -1 2 2"
            fill="currentColor"
            className="absolute text-white drop-shadow-[0_0_4px_var(--color-marker)] motion-safe:animate-twinkle"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size * 5, height: s.size * 5, animationDelay: `${s.delay}s` }}
          >
            <path d="M0 -1 C.1 -.3 .3 -.1 1 0 C.3 .1 .1 .3 0 1 C-.1 .3 -.3 .1 -1 0 C-.3 -.1 -.1 -.3 0 -1Z" />
          </svg>
        ) : (
          <span
            key={i}
            className="absolute rounded-full bg-white motion-safe:animate-twinkle"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ),
      )}
    </div>
  );
}
