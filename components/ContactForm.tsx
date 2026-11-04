"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 placeholder:text-muted/70";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold">
      {children} <span className="text-wine" aria-hidden>*</span>
    </label>
  );
}

export default function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "");
    data.append("subject", "Nuevo mensaje desde tu portfolio");

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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-white/60 p-6 md:p-8">
      <div>
        <Label htmlFor="contact-name">Nombre</Label>
        <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Ingresá tu nombre..." className={fieldClass} />
      </div>
      <div>
        <Label htmlFor="contact-email">Email</Label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="Ingresá tu email..." className={fieldClass} />
      </div>
      <div>
        <Label htmlFor="contact-message">Mensaje</Label>
        <textarea id="contact-message" name="message" required rows={5} placeholder="Ingresá tu mensaje..." className={`${fieldClass} resize-y`} />
      </div>

      {/* Trampa para bots: una persona nunca ve ni marca este campo */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-wine px-6 py-3.5 font-semibold text-paper hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Enviar"}
      </button>

      <div aria-live="polite" className="text-sm empty:hidden">
        {status === "sent" && <p>¡Gracias! Recibí tu mensaje y te respondo lo antes posible.</p>}
        {status === "error" && (
          <p>
            No se pudo enviar el mensaje. Probá de nuevo o escribime a{" "}
            <a href={`mailto:${email}`} className="font-semibold underline underline-offset-2">{email}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
