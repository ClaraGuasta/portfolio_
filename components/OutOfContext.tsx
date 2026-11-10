import PolaroidDice from "@/components/PolaroidDice";
import { DIE_FACES } from "@/components/dieFaces";
import { personal, outOfContext } from "@/data/portfolio";
import { SectionTitle, sectionWidth } from "@/components/Section";

export default function OutOfContext() {
  if (outOfContext.length !== DIE_FACES) {
    throw new Error(`El dado tiene ${DIE_FACES} caras y hay ${outOfContext.length} cartas en Out of Context: tienen que coincidir.`);
  }

  return (
    <section id="fuera-del-codigo" className={`${sectionWidth} py-16 md:py-24`}>
      <SectionTitle>{personal.title}</SectionTitle>
      <p className="mt-4 text-lg text-muted">{personal.intro}</p>

      <PolaroidDice cards={outOfContext} />
    </section>
  );
}
