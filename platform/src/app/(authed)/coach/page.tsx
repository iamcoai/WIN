import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Calendar, MessageSquare, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function CoachHome() {
  const current = await getCurrentUser();
  const name = current?.user.name ?? "coach";

  const tiles = [
    { href: "/coach/clienten", icon: Users, title: "Cliënten", desc: "Overzicht van je cliënten." },
    { href: "/coach/trajecten", icon: BookOpen, title: "Trajecten", desc: "Bouw en beheer trajecten." },
    { href: "/coach/sessies", icon: Calendar, title: "Sessies", desc: "Volgende afspraken." },
    { href: "/coach/chat", icon: MessageSquare, title: "Chat", desc: "Ongelezen berichten." },
    { href: "/coach/rapportage", icon: BarChart3, title: "Rapportage", desc: "Voortgang per cliënt." },
  ];

  return (
    <>
      <PageHeader
        title={`Hallo ${name.split(" ")[0]}`}
        description="Coach-dashboard: cliënten, trajecten, sessies en voortgang."
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={{ pathname: t.href }} className="group">
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{t.title}</CardTitle>
                    </div>
                    <CardDescription className="pt-1">{t.desc}</CardDescription>
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
