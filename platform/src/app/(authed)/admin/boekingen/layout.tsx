import Link from "next/link";

const tabs = [
  { href: "/admin/boekingen", label: "Overzicht" },
  { href: "/admin/boekingen/beschikbaarheid", label: "Beschikbaarheid" },
  { href: "/admin/boekingen/formulier", label: "Formulier" },
];

export default function BoekingenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="flex items-center gap-1 overflow-x-auto border-b border-border bg-background/50 px-5 md:px-8">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={{ pathname: t.href }}
            className="relative px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
