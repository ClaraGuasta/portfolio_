export default function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="grid gap-8 md:grid-cols-[12rem_1fr]">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <div>{children}</div>
      </div>
    </section>
  );
}
