// Todas las secciones comparten ancho (el mismo que las cartas del inicio) y estilo de título.

export const sectionWidth = "mx-auto max-w-6xl px-4 md:px-6";

// Título de sección: rosa, en mayúsculas y con brillo
export const titleClass =
  "font-display text-base font-bold uppercase tracking-[.12em] text-glow drop-shadow-[0_0_8px_var(--color-glow)] md:text-lg md:tracking-[.2em]";

export function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`${titleClass} ${className}`}>{children}</h2>;
}

export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title?: string; // sin título, el contenido pone el suyo
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${sectionWidth} py-16 md:py-24`}>
      {title && <SectionTitle className="mb-8">{title}</SectionTitle>}
      {children}
    </section>
  );
}
