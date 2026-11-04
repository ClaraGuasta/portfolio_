import RecommendationsCarousel from "@/components/RecommendationsCarousel";
import { profile, recommendations } from "@/data/portfolio";

export default function Recommendations() {
  return (
    <section id="recomendaciones" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <h2 className="font-display text-3xl font-extrabold md:text-5xl">Qué dicen de mí</h2>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Personas con las que compartí equipo, en sus propias palabras.
      </p>

      <RecommendationsCarousel items={recommendations} />

      <a
        href={profile.links.linkedin}
        className="mt-8 inline-block font-semibold underline decoration-wine decoration-2 underline-offset-4"
      >
        Leé las recomendaciones completas en LinkedIn
      </a>
    </section>
  );
}
