const nav = [
  ["Sobre mí", "#sobre-mi"],
  ["Experiencia", "#experiencia"],
  ["Skills", "#skills"],
  ["Recomendaciones", "#recomendaciones"],
  ["Contacto", "#contacto"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-5 px-6 py-4">
        <a href="#" className="font-display text-xl font-bold">CG</a>
        <nav aria-label="Principal" className="min-w-0">
          <ul className="flex gap-5 overflow-x-auto text-sm text-muted">
            {nav.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="whitespace-nowrap hover:text-ink">{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}