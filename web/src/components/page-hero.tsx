import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Cta = { label: string; href: string };

type PageHeroProps = {
  /** Niet meer gebruikt (pill is verwijderd) — blijft geaccepteerd voor compatibiliteit. */
  eyebrow?: string;
  /** H1 — mag een gouden accent bevatten via <span className="text-win-gold"> */
  title: ReactNode;
  /** Ondertitel onder de titel */
  subtitle?: ReactNode;
  image: string;
  imageAlt: string;
  /** object-position, bv. "center 25%" om een gezicht in beeld te houden */
  imagePosition?: string;
  cta?: Cta;
  secondaryCta?: Cta;
};

/**
 * Consistente pagina-hero voor alle subpagina's (niet de homepage).
 *
 * Ontwerp-keuze: de titel staat LINKS-uitgelijnd en offset, niet dood-gecentreerd.
 * Omdat Reza op de header-foto's centraal (of rechts, bij coaching) staat, blijft
 * zijn gezicht zo vrij naast de tekst — geen tekst dwars over zijn gezicht.
 * Een navy-scrim links houdt de witte tekst leesbaar terwijl het beeld helder blijft
 * (geen doffe overlay). Gemodelleerd naar de methodiek-plaatsing die Chris fijn vindt.
 */
export function PageHero({
  title,
  subtitle,
  image,
  imageAlt,
  imagePosition = "center 25%",
  cta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] w-full flex items-center overflow-hidden -mt-20 pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.78]"
          style={{ objectPosition: imagePosition }}
        />
        {/* Navy-scrim: donker links (tekst leesbaar) → helder rechts (Reza in beeld) */}
        <div className="absolute inset-0 bg-gradient-to-r from-win-navy/90 via-win-navy/45 to-win-navy/5"></div>
        {/* Zachte fade onderin naar de pagina */}
        <div className="absolute inset-0 bg-gradient-to-t from-win-charcoal/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 font-[family-name:var(--font-headline)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-2xl font-medium text-white/95 leading-relaxed border-l-2 border-win-gold pl-6 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
              {subtitle}
            </p>
          )}
          {(cta || secondaryCta) && (
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              {cta && (
                <Link
                  href={cta.href}
                  className="w-full sm:w-auto text-center bg-win-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-win-navy transition-all shadow-xl"
                >
                  {cta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="w-full sm:w-auto text-center bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
