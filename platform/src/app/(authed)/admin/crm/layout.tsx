import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin/crm", label: "Contacten" },
  { href: "/admin/crm/pipeline", label: "Pipeline" },
  { href: "/admin/crm/tags", label: "Tags" },
  { href: "/admin/crm/custom-fields", label: "Custom fields" },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex items-center gap-1 overflow-x-auto border-b border-border bg-background/50 px-5 md:px-8">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={{ pathname: t.href }}
            className={cn(
              "relative px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
