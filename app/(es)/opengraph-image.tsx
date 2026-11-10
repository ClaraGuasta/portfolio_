import { ogAlt, ogSize, renderOgImage } from "@/lib/og-image";

// Imagen para compartir el link de "/" (español): el diseño está en lib/og-image.tsx
export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
