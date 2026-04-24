import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, MessageSquare, Calendar } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function ClientHome() {
  const current = await getCurrentUser();
  const name = current?.user.name ?? "";

  const cards = [
    {
      href: "/app/trajecten",
      icon: BookOpen,
      title: "Mijn traject",
      desc: "Waar sta ik nu, wat is de volgende stap.",
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
  ];

  return (
    <>
      <PageHeader
        title={`Welkom terug${name ? `, ${name.split(" ")[0]}` : ""}`}
        description="Je persoonlijke ruimte. Adem. Landt in wat er nu is, dan zetten we een stap."
      />
      <PageBody>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Zin
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Betekenis
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Vrijheid
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={{ pathname: c.href }} className="group">
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{c.title}</CardTitle>
                    </div>
                    <CardDescription className="pt-1">{c.desc}</CardDescription>
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
