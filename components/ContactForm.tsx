"use client";

import { useState, type FormEvent } from "react";
import { Star } from "@/components/CardBack";
import type { UI } from "@/data/ui";

// El contrato de misión: quien me recluta completa los parámetros y "despliega" la misión.
type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "mt-2 w-full rounded-lg border border-glow/30 bg-[#140a1a]/60 px-4 py-3 text-paper placeholder:text-paper/35 transition-[border-color,box-shadow,background-color] hover:border-glow/50 focus:border-glow focus:bg-[#1b0e22]/80 focus:shadow-[0_0_0_3px_rgb(233_168_220/.15),0_0_22px_-4px_var(--color-glow)] focus:outline-none!";
// (el "!" le gana al contorno verde global de :focus-visible: acá el foco es el brillo neón del borde)

function Field({ id, label, hint, children }: { id: string; label: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="font-display text-xs font-bold uppercase tracking-[.15em] text-paper/85">
          {label} <span className="text-glow" aria-hidden>*</span>
        </span>
        <span className="hidden text-[11px] text-paper/45 sm:inline">{hint}</span>
      </label>
      {children}
    </div>
  );
}

// Pergamino con una señal saliendo: "enviar la misión"
function ScrollSignal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 4h10.5v12.5a2.5 2.5 0 0 1-2.5 2.5H4.5A2.5 2.5 0 0 0 7 16.5V5.5A1.5 1.5 0 0 0 5.5 4Z" fill="currentColor" fillOpacity=".15" />
      <path d="M5.5 4A1.5 1.5 0 0 0 4 5.5V7h3M9.5 8.5h3M9.5 11.5h3M2 16.5h5" />
      <path d="M18.5 7.5a4 4 0 0 1 0 5M20.5 5.5a7 7 0 0 1 0 9" />
    </svg>
  );
}

// Esquinas ornamentadas del contrato
function Corner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`absolute size-6 text-glow/70 ${className}`} aria-hidden>
      <path d="M2 14V2h12M2 7h5V2" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

// Estrellas que salen disparadas cuando se acepta la misión
const BURST = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const dist = 170 + (i % 3) * 45;
  return { x: Math.round(Math.cos(angle) * dist), y: Math.round(Math.sin(angle) * dist), delay: (i % 4) * 60 };
});

export default function ContactForm({ email, t }: { email: string; t: UI["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "");
    data.append("subject", t.subject);

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.body?.message);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    // Marco del contrato: borde con degradé rosa, como las cartas
    <div className="rounded-2xl bg-linear-to-br from-[#ffaae9]/80 via-[#d966ba]/40 to-[#803575]/70 p-px shadow-[0_0_40px_-12px_var(--color-glow)]">
      <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-linear-to-b from-[#2f1636]/90 via-[#1e0e25]/90 to-[#150a1c]/95 backdrop-blur-sm">
        <Corner className="left-3 top-3" />
        <Corner className="right-3 top-3 -scale-x-100" />
        <Corner className="bottom-3 left-3 -scale-y-100" />
        <Corner className="bottom-3 right-3 -scale-100" />

        {/* Cabecera del contrato */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-glow/30 px-10 py-5">
          <p className="font-display text-sm font-extrabold uppercase tracking-[.2em] text-paper">{t.contract}</p>
          <p className="flex items-center gap-2 rounded-full border border-accent/50 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider text-accent">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            {status === "sent" ? t.accepted : t.open}
          </p>
        </div>

        {status === "sent" ? (
          <div className="relative grid min-h-[26rem] place-items-center p-8 text-center" role="status">
            <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
              {BURST.map((b, i) => (
                <Star
                  key={i}
                  className="absolute size-5 text-glow opacity-0 motion-safe:animate-[star-burst_1.2s_ease-out_both] motion-reduce:hidden"
                  style={{ "--x": `${b.x}px`, "--y": `${b.y}px`, animationDelay: `${b.delay}ms` } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="relative">
              <p className="font-display text-sm font-bold uppercase tracking-[.3em] text-accent">{t.received}</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-paper drop-shadow-[0_0_14px_var(--color-glow)] md:text-4xl">
                {t.deployed}
              </p>
              <p className="mx-auto mt-4 max-w-xs text-paper/80">{t.thanks}</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 font-display text-sm font-bold uppercase tracking-wider text-glow underline decoration-2 underline-offset-4"
              >
                {t.another}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-6 md:grid-cols-2">
              <Field id="contact-name" label={t.nameLabel} hint={t.nameHint}>
                <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder={t.namePlaceholder} className={fieldClass} />
              </Field>
              <Field id="contact-email" label={t.emailLabel} hint={t.emailHint}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t.emailPlaceholder}
                  className={fieldClass}
                />
              </Field>
            </div>
            <Field id="contact-message" label={t.messageLabel} hint={t.messageHint}>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                placeholder={t.messagePlaceholder}
                className={`${fieldClass} min-h-40 resize-y`}
              />
            </Field>

            {/* Trampa para bots: una persona nunca ve ni marca este campo */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="flex flex-col-reverse items-stretch gap-4 border-t border-dashed border-glow/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-paper/50">
                <span className="text-glow">*</span> {t.required}
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group flex items-center justify-center gap-3 rounded-lg border border-glow/80 bg-[#2a1630] px-6 py-3.5 font-display text-sm font-extrabold uppercase tracking-wider text-paper shadow-[0_0_18px_-4px_var(--color-glow)] transition-[background-color,box-shadow,translate] hover:-translate-y-0.5 hover:bg-[#3a1d42] hover:shadow-[0_0_30px_-2px_var(--color-glow)] disabled:cursor-wait disabled:opacity-80"
              >
                <ScrollSignal
                  className={`size-5 text-glow transition-transform duration-300 group-hover:rotate-[-8deg] ${status === "sending" ? "motion-safe:animate-pulse" : ""}`}
                />
                {status === "sending" ? t.sending : t.send}
              </button>
            </div>

            <div aria-live="polite" className="text-sm empty:hidden">
              {status === "error" && (
                <p className="rounded-lg border border-glow/40 bg-glow/10 px-4 py-3">
                  <span className="font-display font-bold uppercase tracking-wider text-glow">{t.errorTitle}</span> {t.errorText}{" "}
                  <a href={`mailto:${email}`} className="font-semibold underline underline-offset-2">
                    {email}
                  </a>
                  .
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
