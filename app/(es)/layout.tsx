import RootHtml, { siteMetadata } from "@/components/RootHtml";

// Layout raíz de la versión en español ("/")
export const metadata = siteMetadata("es");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="es">{children}</RootHtml>;
}
