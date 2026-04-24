"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/aanbod", label: "Aanbod" },
  { href: "/coaching", label: "Coaching" },
  { href: "/mentorschap", label: "Mentorschap" },
  { href: "/opleidingen", label: "Opleidingen" },
  { href: "/organisaties", label: "Organisaties" },
  { href: "/wininstituut", label: "Over WIN" },
];

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-win-olive font-[family-name:var(--font-headline)]">
            WIN
          </span>
          <span className="hidden md:block text-[10px] uppercase tracking-widest text-win-gold font-bold border-l border-stone-300 pl-3">
            Integratief &amp; Psychofysiek
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-stone-600 font-medium hover:text-win-gold transition-colors duration-300 text-sm"
            >
              {link.label}
            </Link>
          ))}
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
            href="#kennismaking"
            className="bg-win-gold text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-win-olive transition-colors"
          >
            Gratis Kennismaking
          </Link>
          <button
            className="md:hidden text-win-olive p-2"
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
