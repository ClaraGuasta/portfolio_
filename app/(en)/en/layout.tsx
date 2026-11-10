import RootHtml, { siteMetadata } from "@/components/RootHtml";

// Layout raíz de la versión en inglés ("/en")
export const metadata = siteMetadata("en");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
