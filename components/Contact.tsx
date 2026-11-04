import ContactForm from "@/components/ContactForm";
import { profile } from "@/data/portfolio";

const channels = [
  {
    label: "GitHub",
    href: profile.links.github,
    icon: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  },
  {
    label: "LinkedIn",
    href: profile.links.linkedin,
    icon: "M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.46-1.84-5.17-4.3-5.17a3.72 3.72 0 0 0-3.37 1.85V8.5H9.52c.04 1.05 0 11.5 0 11.5h3.25v-6.42c0-.34.03-.69.12-.93.27-.69.89-1.4 1.93-1.4 1.36 0 1.9 1.05 1.9 2.59V20h3.72v-6.6Z",
  },
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    icon: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l8 5.2 8-5.2V7H4Zm16 2.8-7.46 4.84a1 1 0 0 1-1.08 0L4 9.8V17h16V9.8Z",
  },
];

export default function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_26rem] md:gap-16">
        <div>
          <h2 className="font-display text-2xl font-bold">Contacto</h2>
          <p className="mt-8 max-w-xl text-lg">
            ¿Tenés una propuesta, una consulta o querés saludar? Completá el formulario o escribime directamente, y te respondo lo antes posible.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-6 inline-block break-all font-display text-xl font-bold underline decoration-wine decoration-2 underline-offset-4"
          >
            {profile.email}
          </a>
          <ul className="mt-8 flex gap-4">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  aria-label={c.label}
                  className="flex size-12 items-center justify-center rounded-full border border-line transition-colors hover:border-wine hover:bg-wine hover:text-paper"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d={c.icon} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm email={profile.email} />
      </div>
    </section>
  );
}
