import Link from "next/link";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  FileText,
  UserCircle,
  MessageSquare,
  Sparkles,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

const items = [
  { href: "/app", icon: BookOpen, title: "Thuis", desc: "Jouw overzicht." },
  { href: "/app/trajecten", icon: BookOpen, title: "Traject", desc: "Waar sta je in je reis." },
  { href: "/app/habits", icon: Sparkles, title: "Habits", desc: "Dagelijkse praktijk." },
  { href: "/app/chat", icon: MessageSquare, title: "Chat met coach", desc: "Berichten en check-ins." },
  { href: "/app/afspraken", icon: Calendar, title: "Afspraken", desc: "Intake en sessies." },
  { href: "/app/formulieren", icon: FileText, title: "Formulieren", desc: "Intake en reflectie." },
  { href: "/app/profiel", icon: UserCircle, title: "Profiel", desc: "Je gegevens en uitloggen." },
];

export default function MoreClientPage() {
  return (
    <>
      <PageHeader title="Meer" description="Alles op een rij." />
      <PageBody>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={{ pathname: t.href }} className="group">
                <Card className="relative overflow-hidden transition-all duration-[var(--duration-fast)] group-hover:-translate-y-[1px] group-hover:shadow-md group-hover:border-border-strong">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <CardTitle className="mt-3">{t.title}</CardTitle>
                    <CardDescription>{t.desc}</CardDescription>
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
