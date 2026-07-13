"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/methodiek", label: "Methodiek" },
  { href: "/aanbod", label: "Aanbod" },
  { href: "/coaching", label: "Coaching" },
  { href: "/mentorschap", label: "Mentorschap" },
  { href: "/opleidingen", label: "Opleidingen" },
  { href: "/organisaties", label: "Organisaties" },
  { href: "/wininstituut", label: "Over WIN" },
];

// Belangrijk, maar houden we uit de hoofdbalk om die rustig te houden.
// Bereikbaar via de "Meer"-dropdown (desktop) en onderin het mobiele menu.
const moreLinks = [
  { href: "/kennisinstituut", label: "Kennisinstituut" },
  { href: "/weerbaarheidsmentor", label: "De Mentor" },
  { href: "/ontwikkellijn", label: "Ontwikkellijn" },
];

function LogoLockup() {
  return (
    <Link href="/" className="flex items-center" aria-label="WIN Instituut — naar home">
      <Image
        src="/brand/win-logo-2026-trim.png"
        alt="WIN Instituut — Integratief, Psychofysiek, Systemisch"
        width={257}
        height={219}
        priority
        className="h-14 w-auto"
      />
    </Link>
  );
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <LogoLockup />

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-600 font-medium hover:text-win-gold transition-colors duration-300 text-sm"
            >
              {link.label}
            </Link>
          ))}

          {/* Meer-dropdown: extra pagina's zonder de balk vol te maken */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 text-stone-600 font-medium hover:text-win-gold transition-colors duration-300 text-sm"
              aria-haspopup="true"
            >
              Meer
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200">
              <div className="min-w-[190px] bg-white rounded-xl shadow-xl border border-stone-100 py-2">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-win-gold hover:bg-win-cream/60 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3002/login"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:border-win-gold hover:text-win-gold transition-colors"
          >
            Inloggen
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <Link
            href="/kennismaking"
            className="bg-win-gold text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-win-navy transition-colors"
          >
            Gratis Kennismaking
          </Link>
          <button
            className="md:hidden text-win-navy p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-stone-600 font-medium hover:text-win-gold py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-stone-200 pt-3 space-y-3">
            <span className="block text-[11px] uppercase tracking-widest text-win-gold font-bold">
              Meer
            </span>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-stone-600 font-medium hover:text-win-gold py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <a
            href="http://localhost:3002/login"
            className="block border-t border-stone-200 pt-3 text-stone-600 font-medium hover:text-win-gold"
          >
            Inloggen →
          </a>
        </div>
      )}
    </nav>
  );
}
