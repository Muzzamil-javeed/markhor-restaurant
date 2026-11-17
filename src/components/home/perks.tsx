import { HomeSection } from "@/components/home/section";
import { site } from "@/data/site";

export function HomePerks() {
  return (
    <HomeSection
      id="perks"
      eyebrow="At the table"
      title="At the table perks"
      description="Little extras while you eat with us."
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {site.perks.map((perk) => (
          <li
            key={perk.id}
            className="rounded-2xl border border-line bg-white p-5 shadow-sm"
          >
            <h3 className="font-heading text-base font-semibold text-ink">
              {perk.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{perk.body}</p>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
