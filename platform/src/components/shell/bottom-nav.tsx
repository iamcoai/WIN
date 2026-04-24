"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/config/nav";
import { navConfig } from "@/config/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (pathname === href) return true;
  if (href === "/app" || href === "/coach" || href === "/admin") return false;
  return pathname.startsWith(href);
}

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navConfig[role].filter((i) => i.mobilePrimary);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="Hoofdnavigatie"
    >
      <div className="flex justify-around px-1 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={{ pathname: item.href }}
              aria-current={active ? "page" : undefined}
              className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[0.6875rem] font-medium"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-[1.625rem] top-0 h-[2px] rounded-full bg-primary transition-all duration-[var(--duration-fast)]",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-[var(--duration-fast)]",
                  active
                    ? "text-primary scale-[1.04]"
                    : "text-foreground/55 group-hover:text-foreground",
                )}
                strokeWidth={active ? 2.15 : 1.85}
              />
              <span
                className={cn(
                  "truncate transition-colors duration-[var(--duration-fast)]",
                  active ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
