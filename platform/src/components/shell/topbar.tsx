"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Role } from "@/config/nav";
import { navConfig, roleHome } from "@/config/nav";
import { cn } from "@/lib/utils";

export function Topbar({ role, userName }: { role: Role; userName: string }) {
  const [open, setOpen] = useState(false);
  const items = navConfig[role];

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-win-charcoal/10 bg-white/90 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Menu openen"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-win-charcoal hover:bg-win-charcoal/5 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href={{ pathname: roleHome(role) }} className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-win-charcoal">
            WIN
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-wider text-win-gold sm:block">
            {role === "admin" ? "Admin" : role === "coach" ? "Coach" : "Platform"}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={{ pathname: "/app/profiel" }}
            className="hidden items-center gap-2 rounded-full border border-win-charcoal/10 bg-white px-3 py-1.5 text-sm text-win-charcoal transition hover:bg-win-charcoal/5 sm:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-win-gold/20 text-xs font-semibold text-win-gold">
              {userName.slice(0, 2).toUpperCase()}
            </span>
            <span className="max-w-[8rem] truncate">{userName}</span>
          </Link>
          <form action="/api/auth/sign-out" method="post">
            <button
              type="submit"
              className="rounded-lg border border-win-charcoal/10 bg-white px-3 py-1.5 text-sm text-win-charcoal transition hover:bg-win-charcoal/5"
            >
              Uitloggen
            </button>
          </form>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-win-charcoal/40"
            onClick={() => setOpen(false)}
          />
          <nav className="relative z-10 flex h-full w-72 flex-col gap-1 overflow-y-auto border-r border-win-charcoal/10 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-win-charcoal">WIN</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-win-charcoal hover:bg-win-charcoal/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={{ pathname: item.href }}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-win-charcoal transition hover:bg-win-charcoal/5",
                  )}
                >
                  <Icon className="h-4 w-4 text-win-gold" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
