"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { DIE_FACES } from "@/components/dieFaces";

// Dado de 10 caras (trapezoedro pentagonal, el d10 de los juegos de rol), dibujado en SVG.
// La geometría se calcula acá: cada cara es un "barrilete" con su normal; para mostrar una
// cara se rota el dado hasta que esa normal mira a la pantalla. Se dibujan solo las caras de
// frente (el sólido es convexo), sombreadas según la luz.

type V = [number, number, number];
type M = [V, V, V]; // filas

const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V) => mul(a, 1 / Math.hypot(...a));
const apply = (m: M, v: V): V => [dot(m[0], v), dot(m[1], v), dot(m[2], v)];
const transpose = (m: M): M => [0, 1, 2].map((i) => [m[0][i], m[1][i], m[2][i]] as V) as M;
const matmul = (a: M, b: M): M => {
  const bt = transpose(b);
  return a.map((row) => bt.map((col) => dot(row, col)) as V) as M;
};

// Rotación de ángulo t alrededor del eje k (Rodrigues)
function axisAngle(k: V, t: number): M {
  const [x, y, z] = k;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const C = 1 - c;
  return [
    [c + x * x * C, x * y * C - z * s, x * z * C + y * s],
    [y * x * C + z * s, c + y * y * C, y * z * C - x * s],
    [z * x * C - y * s, z * y * C + x * s, c + z * z * C],
  ];
}

function toAxisAngle(m: M): { axis: V; angle: number } {
  const angle = Math.acos(Math.min(1, Math.max(-1, (m[0][0] + m[1][1] + m[2][2] - 1) / 2)));
  const raw: V = [m[2][1] - m[1][2], m[0][2] - m[2][0], m[1][0] - m[0][1]];
  const len = Math.hypot(...raw);
  if (len < 1e-4) return { axis: norm([Math.random() - 0.5, Math.random() - 0.5, 0.3]), angle: 0 };
  return { axis: mul(raw, 1 / len), angle };
}

// ---- Geometría del d10 (eje z = eje largo del dado) ----
const RING = 1; // radio de los vértices del medio
const A = 0.105; // zig-zag de los vértices del medio
const c36 = Math.cos(Math.PI / 5);
const TIP = (A * (1 + c36)) / (1 - c36); // altura de las puntas para que cada cara sea plana

const top: V = [0, 0, TIP];
const bottom: V = [0, 0, -TIP];
const upper = (k: number): V => [RING * Math.cos((k * 2 * Math.PI) / 5), RING * Math.sin((k * 2 * Math.PI) / 5), A];
const lower = (k: number): V => [RING * Math.cos(((k + 0.5) * 2 * Math.PI) / 5), RING * Math.sin(((k + 0.5) * 2 * Math.PI) / 5), -A];

type Face = { pts: V[]; center: V; n: V; up: V; right: V; label: number };

const FACES: Face[] = Array.from({ length: DIE_FACES }, (_, i) => {
  const k = i >> 1;
  // Caras de arriba (impares) y de abajo (pares), alternadas como en un d10 de verdad
  const pts: V[] = i % 2 === 0 ? [top, upper(k), lower(k), upper(k + 1)] : [bottom, lower(k), upper(k + 1), lower(k + 1)];
  const center = mul(pts.reduce(add), 1 / 4);
  let n = norm(cross(sub(pts[1], pts[0]), sub(pts[3], pts[0])));
  if (dot(n, center) < 0) n = mul(n, -1);
  const tip = pts[0];
  const toTip = sub(tip, center);
  const up = norm(sub(toTip, mul(n, dot(toTip, n)))); // el número se lee con la punta hacia arriba
  return { pts, center, n, up, right: cross(n, up), label: i + 1 };
});

// Pantalla: x a la derecha, y hacia abajo, z hacia quien mira. Orientación que muestra la cara i.
// Queda apenas inclinado hacia atrás, para que se vean las caras de arriba y se note el volumen.
const REST_TILT = axisAngle([1, 0, 0], -0.4);
function showing(i: number): M {
  const f = FACES[i];
  return matmul(REST_TILT, [f.right, mul(f.up, -1), f.n]);
}

const LIGHT = norm([-0.5, -0.8, 1]);
// Redondeo: el servidor y el navegador pueden diferir en el último decimal y romper la hidratación
const r4 = (x: number) => Math.round(x * 1e4) / 1e4;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export type Die3DHandle = { roll: (face: number) => Promise<void> };

export default function Die3D({ ref, className = "" }: { ref?: Ref<Die3DHandle>; className?: string }) {
  // Arranca mostrando el 10 un poco inclinado, para que se note que es 3D
  const [rot, setRot] = useState<M>(() => matmul(axisAngle(norm([1, 0.6, 0]), 0.45), showing(9)));
  const rotRef = useRef(rot);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useImperativeHandle(ref, () => ({
    roll(face) {
      const target = showing(face - 1);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cancelAnimationFrame(raf.current);
      if (reduce) {
        rotRef.current = target;
        setRot(target);
        return Promise.resolve();
      }
      // Gira alrededor de un solo eje desde donde está hasta la cara elegida, con vueltas extra
      const { axis, angle } = toAxisAngle(matmul(transpose(target), rotRef.current));
      const total = angle + 2 * Math.PI * 3;
      const duration = 1500;
      const start = performance.now();
      return new Promise((resolve) => {
        const frame = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const r = matmul(target, axisAngle(axis, total * (1 - easeOut(t))));
          rotRef.current = r;
          setRot(r);
          if (t < 1) raf.current = requestAnimationFrame(frame);
          else resolve();
        };
        raf.current = requestAnimationFrame(frame);
      });
    },
  }));

  const visible = FACES.map((f) => ({ f, n: apply(rot, f.n) }))
    .filter(({ n }) => n[2] > 0.02)
    .sort((a, b) => a.n[2] - b.n[2]);

  return (
    <svg viewBox="-1.1 -1.1 2.2 2.2" className={className} aria-hidden>
      {visible.map(({ f, n }) => {
        const p = f.pts.map((v) => apply(rot, v));
        const c = apply(rot, f.center);
        const right = apply(rot, f.right);
        const down = mul(apply(rot, f.up), -1);
        const light = 0.62 + 0.38 * Math.max(0, dot(n, LIGHT));
        const s = 0.3; // tamaño del número
        return (
          <g key={f.label}>
            <polygon
              points={p.map((v) => `${r4(v[0])},${r4(v[1])}`).join(" ")}
              fill={`hsl(234 70% ${Math.round(light * 98)}%)`}
              stroke="var(--color-glow)"
              strokeWidth="0.045"
              strokeLinejoin="round"
            />
            <text
              transform={`matrix(${[right[0] * s, right[1] * s, down[0] * s, down[1] * s, c[0], c[1]].map(r4).join(" ")})`}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="1"
              fontWeight="800"
              fill="var(--color-wine)"
              opacity={r4(Math.min(1, n[2] * 1.6))}
              className="font-display"
            >
              {f.label}
              {/* Punto en el 6 y el 9 para no confundirlos, como en los dados reales */}
              {(f.label === 6 || f.label === 9) && "."}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
