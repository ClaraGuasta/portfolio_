import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Clara Guastavino | Portfolio",
  description: "Portfolio de Clara Guastavino: experiencia, educación, idiomas y tecnologías.",
  // URL pública del sitio (con https://). En Vercel se carga en Settings → Environment Variables.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}