import ReviewBox from "@/components/ReviewBox";
import { sectionWidth } from "@/components/Section";
import { profile, recommendations } from "@/data/portfolio";

export default function Recommendations() {
  return (
    <section id="recomendaciones" className={`${sectionWidth} py-16 md:py-24`}>
      <ReviewBox items={recommendations} linkedin={profile.links.linkedin} />
    </section>
  );
}
