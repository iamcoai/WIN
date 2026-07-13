import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-stone-900 w-full py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Link href="/" className="inline-block" aria-label="WIN Instituut — naar home">
            <Image
              src="/brand/win-logo-2026-trim.png"
              alt="WIN Instituut"
              width={257}
              height={219}
              className="h-20 w-auto brightness-0 invert opacity-90"
            />
          </Link>
          <p className="text-stone-400 text-sm leading-relaxed">
            Hét Instituut voor Weerbaarheidstherapie &amp; -coaching.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold text-sm mb-2">
              Navigatie
            </span>
            <Link
              href="/aanbod"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              Aanbod
            </Link>
            <Link
              href="/coaching"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              Coaching
            </Link>
            <Link
              href="/mentorschap"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              Mentorschap
            </Link>
            <Link
              href="/opleidingen"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              Opleidingen
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-bold text-sm mb-2">Meer</span>
            <Link
              href="/organisaties"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              Organisaties
            </Link>
            <Link
              href="/kennisinstituut"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              Kennisinstituut
            </Link>
            <Link
              href="/weerbaarheidsmentor"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              De Mentor
            </Link>
            <Link
              href="/ontwikkellijn"
              className="text-stone-400 text-sm hover:text-win-gold transition-colors"
            >
              Ontwikkellijn
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-white font-bold text-sm">Locatie</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Zuiderinslag+8N%2C+3871+MR+Hoevelaken"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-start gap-2 text-stone-400 text-sm hover:text-win-gold transition-colors"
          >
            <svg
              className="w-4 h-4 mt-0.5 shrink-0 text-win-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>
              Zuiderinslag 8N
              <br />
              3871 MR Hoevelaken
              <span className="block mt-1 text-xs text-stone-500 group-hover:text-win-gold/80">
                Bekijk op Google Maps →
              </span>
            </span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-stone-800/50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p className="text-stone-500 text-xs text-center md:text-left">
          © {new Date().getFullYear()} Weerbaarheids Instituut Nederland.
          Integratief · Psychofysiek · Systemisch.
        </p>
        <p className="text-stone-500 text-xs text-center md:text-right">
          KVK: 50946315
        </p>
      </div>
    </footer>
  );
}
