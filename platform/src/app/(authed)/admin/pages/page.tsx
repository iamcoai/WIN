import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const PAGES = [
  { slug: "", title: "Home", desc: "Landing", file: "web/src/app/page.tsx" },
  { slug: "aanbod", title: "Aanbod", desc: "Overzicht diensten", file: "web/src/app/aanbod/page.tsx" },
  { slug: "coaching", title: "Coaching", desc: "1-op-1", file: "web/src/app/coaching/page.tsx" },
  { slug: "opleidingen", title: "Opleidingen", desc: "Meerdaags", file: "web/src/app/opleidingen/page.tsx" },
  { slug: "mentorschap", title: "Mentorschap", desc: "Jaartraject", file: "web/src/app/mentorschap/page.tsx" },
  { slug: "ontwikkellijn", title: "Ontwikkellijn", desc: "Methodiek", file: "web/src/app/ontwikkellijn/page.tsx" },
  { slug: "organisaties", title: "Organisaties", desc: "B2B", file: "web/src/app/organisaties/page.tsx" },
  { slug: "weerbaarheidsmentor", title: "Weerbaarheidsmentor", desc: "Rol", file: "web/src/app/weerbaarheidsmentor/page.tsx" },
  { slug: "kennisinstituut", title: "Kennisinstituut", desc: "Kennis", file: "web/src/app/kennisinstituut/page.tsx" },
  { slug: "wininstituut", title: "WIN Instituut", desc: "Over", file: "web/src/app/wininstituut/page.tsx" },
];

export default function PagesExplorer() {
  return (
    <>
      <PageHeader
        title="Pagina's"
        description="Publieke website-pagina's in de /web workspace."
      />
      <PageBody>
        <div className="grid gap-3 md:grid-cols-2">
          {PAGES.map((p) => (
            <Card key={p.slug}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{p.title}</CardTitle>
                    <CardDescription>{p.desc}</CardDescription>
                    <p className="mt-2 text-xs text-muted-foreground">{p.file}</p>
                  </div>
                  <Link
                    href={`https://win.nl/${p.slug}` as never}
                    target="_blank"
                    className="flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs text-foreground hover:bg-muted"
                  >
                    <ExternalLink className="h-3 w-3" /> Open
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Deze explorer is read-only. Content-bewerking gebeurt direct in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">web/src/app/**/page.tsx</code>
          {" "}via de{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">/win-copy-edit</code> skill.
        </p>
      </PageBody>
    </>
  );
}
