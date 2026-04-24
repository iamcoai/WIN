"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/config/nav";
import { navConfig } from "@/config/nav";
import { cn } from "@/lib/utils";

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navConfig[role].filter((i) => i.mobilePrimary);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-win-charcoal/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-md md:hidden"
      aria-label="Hoofdnavigatie"
    >
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
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-xs font-medium transition-colors",
              active
                ? "text-win-gold"
                : "text-win-charcoal/60 hover:text-win-charcoal",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
