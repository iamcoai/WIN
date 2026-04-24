"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/config/nav";
import { navConfig } from "@/config/nav";
import { cn } from "@/lib/utils";

export function DesktopRail({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navConfig[role];

  return (
    <aside
      className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-win-charcoal/10 bg-white/70 p-3 md:block"
      aria-label="Zijmenu"
    >
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/app" &&
              item.href !== "/coach" &&
              item.href !== "/admin" &&
              pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={{ pathname: item.href }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-win-gold/10 text-win-gold"
                  : "text-win-charcoal/80 hover:bg-win-charcoal/5 hover:text-win-charcoal",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
