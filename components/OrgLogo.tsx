import Image from "next/image";
import type { Logo } from "@/data/portfolio";

// Decorativo: el nombre de la organización siempre va al lado, por eso alt vacío.
// Se muestra a 32px, pero el zoom lo amplía: width/height piden una versión más
// grande para que no se pixele al escalar.
export default function OrgLogo({ logo }: { logo: Logo }) {
  return (
    <span className="size-8 shrink-0 overflow-hidden rounded-lg">
      <Image
        src={logo.src}
        alt=""
        width={128}
        height={128}
        className="size-full object-cover"
        style={{ transform: `scale(${logo.zoom})` }}
      />
    </span>
  );
}
