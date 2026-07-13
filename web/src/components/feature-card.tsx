import type { ReactNode } from "react";

type FeatureCardProps = {
  /** Optioneel icoon (svg). Zonder icoon verschijnt een goud accent-streepje. */
  icon?: ReactNode;
  title: string;
  description: string;
};

/**
 * De WIN-kaart, exact in de stijl van de "4 Domeinen"-kaarten op de homepage:
 * crème kaart die op hover wit wordt en oplicht, gouden icoon-box die invult,
 * navy kop. Gebruik dit voor ALLE kolom-/feature-grids op de site voor consistentie.
 */
export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-win-cream/50 p-8 rounded-xl border border-stone-100 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-1 transition-all duration-300 text-center">
      {icon ? (
        <div className="w-14 h-14 bg-win-gold/10 rounded-lg flex items-center justify-center mb-6 mx-auto text-win-gold group-hover:bg-win-gold group-hover:text-white transition-colors">
          {icon}
        </div>
      ) : (
        <div className="w-10 h-1 bg-win-gold mb-6 mx-auto group-hover:w-16 transition-all duration-300"></div>
      )}
      <h3 className="text-2xl font-bold mb-4 text-win-navy font-[family-name:var(--font-headline)] hyphens-auto break-words">
        {title}
      </h3>
      <p className="text-win-charcoal/70 leading-relaxed">{description}</p>
    </div>
  );
}

/** De vier vaste domein-iconen, gedeeld tussen homepage en methodiek-pagina. */
export const domainIcons: Record<string, ReactNode> = {
  Fysiek: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Mentaal: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  Sociaal: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  Emotioneel: (
    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ),
};
