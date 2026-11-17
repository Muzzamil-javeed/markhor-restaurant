/**
 * TODO(owner): Enable when Markhor has an approved pitmaster / brand story.
 * This section is intentionally unused — import into the home page when ready.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export function HomeStory() {
  return (
    <section className="paper-texture bg-cream">
      <div className="mx-auto max-w-[1100px] px-4 py-16">
        <SectionEyebrow>Our story</SectionEyebrow>
        <h2 className="font-display mt-3 text-4xl text-ink uppercase">
          Coming soon.
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted">
          Placeholder for a Markhor pitmaster story once the owner shares copy
          and photos.
        </p>
      </div>
    </section>
  );
}
