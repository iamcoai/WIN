import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-stone-900 w-full py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white font-[family-name:var(--font-headline)]">
              WIN
            </span>
            <span className="text-xs text-win-gold font-semibold uppercase tracking-widest">
              Instituut
            </span>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed">
            Hét Instituut voor Weerbaarheidstherapie &amp; -coaching.
            <br />
            Integratief &amp; Psychofysiek.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold text-sm mb-2">
              Navigatie
            </span>
            <Link
              href="/aanbod"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              Aanbod
            </Link>
            <Link
              href="/coaching"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              Coaching
            </Link>
            <Link
              href="/mentorschap"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              Mentorschap
            </Link>
            <Link
              href="/opleidingen"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              Opleidingen
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold text-sm mb-2">Meer</span>
            <Link
              href="/organisaties"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              Organisaties
            </Link>
            <Link
              href="/kennisinstituut"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              Kennisinstituut
            </Link>
            <Link
              href="/weerbaarheidsmentor"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              De Mentor
            </Link>
            <Link
              href="/ontwikkellijn"
              className="text-stone-400 text-sm hover:text-yellow-500 transition-colors"
            >
              Ontwikkellijn
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-white font-bold text-sm">Locatie</span>
          <p className="text-stone-400 text-sm">
            Landgoed Nimmerdor
            <br />
            Amersfoort, Nederland
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-stone-800/50">
        <p className="text-stone-500 text-xs text-center md:text-left">
          © {new Date().getFullYear()} Weerbaarheids Instituut Nederland.
          Integratief &amp; Psychofysiek.
        </p>
      </div>
    </footer>
  );
}
