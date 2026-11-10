import PolaroidDice, { type DiceCard } from "@/components/PolaroidDice";
import { DIE_FACES } from "@/components/dieFaces";
import { SectionTitle, sectionWidth } from "@/components/Section";
import type { UI } from "@/data/ui";

export default function OutOfContext({
  personal,
  cards,
  t,
}: {
  personal: { title: string; intro: string };
  cards: DiceCard[];
  t: UI["dice"];
}) {
  if (cards.length !== DIE_FACES) {
    throw new Error(`El dado tiene ${DIE_FACES} caras y hay ${cards.length} cartas en Out of Context: tienen que coincidir.`);
  }

  return (
    <section id="fuera-del-codigo" className={`${sectionWidth} py-16 md:py-24`}>
      <SectionTitle>{personal.title}</SectionTitle>
      <p className="mt-4 text-lg text-muted">{personal.intro}</p>

      <PolaroidDice cards={cards} t={t} />
    </section>
  );
}
