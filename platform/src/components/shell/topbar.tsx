"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LogOut, User2, ChevronDown } from "lucide-react";
import type { Role } from "@/config/nav";
import { navConfig, roleHome } from "@/config/nav";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  coach: "Coach",
  client: "Platform",
};

export function Topbar({ role, userName }: { role: Role; userName: string }) {
  const [open, setOpen] = useState(false);
  const items = navConfig[role];
  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "··";

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-4 backdrop-blur-xl md:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Menu openen"
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted md:hidden"
          >
            <Menu className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
          </button>

          <Link
            href={{ pathname: roleHome(role) }}
            className="flex items-center gap-2 rounded-md px-1 py-1 transition-opacity hover:opacity-80"
          >
            <span className="relative flex items-center gap-1.5">
              <span className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
                WIN
              </span>
              <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
              <span className="hidden text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:block">
                {ROLE_LABEL[role]}
              </span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="group flex items-center gap-2 rounded-full border border-border bg-card px-1.5 py-1 text-sm font-medium text-foreground transition-all duration-[var(--duration-fast)] hover:border-border-strong hover:shadow-xs"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="hidden max-w-[9rem] truncate pr-0.5 sm:block">
                    {userName}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-aria-expanded:rotate-180 sm:block" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {ROLE_LABEL[role]}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={
                  <Link href={{ pathname: "/app/profiel" }}>
                    <User2 className="h-4 w-4" /> Profiel
                  </Link>
                }
              />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={
                  <form action="/api/auth/sign-out" method="post">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Uitloggen
                    </button>
                  </form>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Sluit menu"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <nav className="relative z-10 flex h-full w-[20rem] max-w-[85vw] flex-col gap-1 overflow-y-auto border-r border-border bg-surface p-4 shadow-xl animate-slide-in-right">
            <div className="mb-5 flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold tracking-tight">WIN</span>
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {ROLE_LABEL[role]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted"
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium text-foreground/85 transition-colors duration-[var(--duration-fast)] hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon
                    className="h-[1.125rem] w-[1.125rem] text-primary/70"
                    strokeWidth={2}
                  />
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
