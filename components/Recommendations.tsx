import ReviewBox from "@/components/ReviewBox";
import { sectionWidth } from "@/components/Section";
import type { Recommendation } from "@/data/portfolio";
import type { UI } from "@/data/ui";

export default function Recommendations({ items, linkedin, t }: { items: Recommendation[]; linkedin: string; t: UI["reviews"] }) {
  return (
    <section id="recomendaciones" className={`${sectionWidth} py-16 md:py-24`}>
      <ReviewBox items={items} linkedin={linkedin} t={t} />
    </section>
  );
}
