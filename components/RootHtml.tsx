import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { homePath, locales, ui, type Lang } from "@/data/ui";
import "@/app/globals.css";

// Lo que comparten los dos layouts raíz (app/(es)/layout.tsx y app/(en)/en/layout.tsx):
// la fuente, el <html lang> correcto y los metadatos de cada idioma.

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export function siteMetadata(lang: Lang): Metadata {
  const t = ui[lang].meta;
  return {
    title: t.title,
    description: t.description,
    // URL pública del sitio (con https://). En Vercel se carga en Settings → Environment Variables.
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    // Le avisa a Google que el sitio existe en los dos idiomas
    alternates: {
      canonical: homePath[lang],
      languages: Object.fromEntries(locales.map((l) => [l, homePath[l]])),
    },
    openGraph: { locale: t.ogLocale, type: "website" },
  };
}

export default function RootHtml({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
