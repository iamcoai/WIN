import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, BookOpen, Sparkles, MessageSquare, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function ClientHome() {
  const current = await getCurrentUser();
  const name = current?.user.name ?? "";
  const firstName = name.split(" ")[0];

  const tiles = [
    {
      href: "/app/trajecten",
      icon: BookOpen,
      title: "Mijn traject",
      desc: "Waar sta ik — wat is de volgende stap.",
    },
    {
      href: "/app/habits",
      icon: Sparkles,
      title: "Habits",
      desc: "Dagelijkse oefening, streak en reflectie.",
    },
    {
      href: "/app/chat",
      icon: MessageSquare,
      title: "Chat met coach",
      desc: "Berichten, vragen en check-ins.",
    },
    {
      href: "/app/afspraken",
      icon: Calendar,
      title: "Afspraken",
      desc: "Intake, sessies en herinneringen.",
    },
    {
      href: "/app/formulieren",
      icon: FileText,
      title: "Formulieren",
      desc: "Intake en reflectie — op je eigen tempo.",
    },
  ];

  return (
    <>
      <PageHeader
        title={firstName ? `Welkom terug, ${firstName}` : "Welkom terug"}
        description="Je persoonlijke ruimte. Adem. Land in wat er nu is — dan zetten we een stap."
      />
      <PageBody>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Badge variant="gold">Zin</Badge>
          <Badge variant="gold">Betekenis</Badge>
          <Badge variant="gold">Vrijheid</Badge>
          <span className="ml-1 text-xs text-muted-foreground/80">
            · waar we samen naartoe werken
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={{ pathname: t.href }} className="group">
                <Card className="relative overflow-hidden transition-all duration-[var(--duration-fast)] group-hover:-translate-y-[1px] group-hover:shadow-md group-hover:border-border-strong">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 -translate-x-1 text-muted-foreground/40 transition-all duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0 group-hover:text-primary" />
                    </div>
                    <CardTitle className="mt-3 text-base">{t.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {t.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
