"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role, NavItem } from "@/config/nav";
import { navConfig } from "@/config/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (pathname === href) return true;
  // Only treat as active on prefix match for non-root hrefs.
  if (href === "/app" || href === "/coach" || href === "/admin") return false;
  return pathname.startsWith(href);
}

export function DesktopRail({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navConfig[role];

  // Split in primary (mobilePrimary) + secondary
  const primary: NavItem[] = items.filter((i) => i.mobilePrimary);
  const secondary: NavItem[] = items.filter((i) => !i.mobilePrimary);

  return (
    <aside
      className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[15.5rem] shrink-0 overflow-y-auto border-r border-border bg-sidebar py-4 md:block"
      aria-label="Zijmenu"
    >
      <nav className="flex flex-col gap-4 px-2.5">
        <NavGroup label="Hoofdmenu" items={primary} pathname={pathname} />
        {secondary.length ? (
          <NavGroup label="Meer" items={secondary} pathname={pathname} />
        ) : null}
      </nav>
    </aside>
  );
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavItem[];
  pathname: string | null;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="px-3 pb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80">
        {label}
      </div>
      {items.map((item) => (
        <RailItem key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}
    </div>
  );
}

function RailItem({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={{ pathname: item.href }}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-[0.4375rem] text-[0.8125rem] font-medium transition-all duration-[var(--duration-fast)]",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-foreground/72 hover:bg-muted/70 hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-primary transition-opacity duration-[var(--duration-fast)]",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
      <Icon
        className={cn(
          "h-[1.0625rem] w-[1.0625rem] shrink-0 transition-colors",
          active
            ? "text-primary"
            : "text-foreground/55 group-hover:text-foreground/75",
        )}
        strokeWidth={1.8}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
