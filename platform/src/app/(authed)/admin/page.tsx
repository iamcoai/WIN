import { sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  CreditCard,
  Kanban,
  Inbox,
  PanelsTopLeft,
  Link as LinkIcon,
  Settings,
  Calendar,
  Tags,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { contact, deal, workshop, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Section = {
  title: string;
  tiles: {
    href: string;
    icon: typeof Users;
    title: string;
    desc: string;
    accent?: boolean;
  }[];
};

export default async function AdminHome() {
  // Quick stats for the header strip
  const [{ totalContacts }] = await db
    .select({ totalContacts: sql<number>`COUNT(*)::int` })
    .from(contact);
  const [{ openDeals }] = await db
    .select({ openDeals: sql<number>`COUNT(*)::int` })
    .from(deal)
    .where(eq(deal.status, "open"));
  const [{ pipelineValue }] = await db
    .select({
      pipelineValue: sql<number>`COALESCE(SUM(${deal.amountCents}), 0)::bigint`,
    })
    .from(deal)
    .where(eq(deal.status, "open"));
  const [{ upcomingWorkshops }] = await db
    .select({ upcomingWorkshops: sql<number>`COUNT(*)::int` })
    .from(workshop)
    .where(eq(workshop.status, "open"));
  const [{ totalUsers }] = await db
    .select({ totalUsers: sql<number>`COUNT(*)::int` })
    .from(user);

  const stats = [
    { label: "Contacten", value: totalContacts.toLocaleString("nl-NL") },
    { label: "Open deals", value: openDeals.toLocaleString("nl-NL") },
    {
      label: "Pipeline-waarde",
      value: `€${(Number(pipelineValue) / 100).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`,
    },
    { label: "Workshops live", value: upcomingWorkshops.toLocaleString("nl-NL") },
    { label: "Gebruikers", value: totalUsers.toLocaleString("nl-NL") },
  ];

  const sections: Section[] = [
    {
      title: "CRM",
      tiles: [
        {
          href: "/admin/crm",
          icon: Users,
          title: "Contacten",
          desc: "Leads, prospects, klanten — zoek en filter.",
          accent: true,
        },
        {
          href: "/admin/crm/pipeline",
          icon: Kanban,
          title: "Pipeline",
          desc: "Deals verslepen tussen stages.",
        },
        {
          href: "/admin/crm/tags",
          icon: Tags,
          title: "Tags",
          desc: "Niches en segmentatie-labels.",
        },
        {
          href: "/admin/crm/custom-fields",
          icon: SlidersHorizontal,
          title: "Eigen velden",
          desc: "Velden op maat per entiteit.",
        },
      ],
    },
    {
      title: "Programma",
      tiles: [
        {
          href: "/admin/workshops",
          icon: Calendar,
          title: "Workshops",
          desc: "Events, aanmeldingen en capaciteit.",
        },
        {
          href: "/admin/projecten",
          icon: Briefcase,
          title: "Projecten",
          desc: "Interne projecten en teams.",
        },
        {
          href: "/admin/kanban",
          icon: Kanban,
          title: "Taken-board",
          desc: "Alle open taken in één blik.",
        },
      ],
    },
    {
      title: "Platform",
      tiles: [
        {
          href: "/admin/users",
          icon: Users,
          title: "Gebruikers",
          desc: "Rollen en toegang.",
        },
        {
          href: "/admin/payments",
          icon: CreditCard,
          title: "Betalingen",
          desc: "Plug-and-Pay inschrijvingen.",
        },
        {
          href: "/admin/inbox",
          icon: Inbox,
          title: "Inbox",
          desc: "Meldingen en systeem-events.",
        },
        {
          href: "/admin/pages",
          icon: PanelsTopLeft,
          title: "Pagina's",
          desc: "Publieke website-content.",
        },
        {
          href: "/admin/integrations",
          icon: LinkIcon,
          title: "Integraties",
          desc: "Supabase, Plug-and-Pay, Stitch.",
        },
        {
          href: "/admin/settings",
          icon: Settings,
          title: "Instellingen",
          desc: "Platform-configuratie.",
        },
      ],
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overzicht van cliënten, pipeline, events en platform-gezondheid."
      />
      <PageBody>
        {/* Stat strip */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card px-4 py-3 shadow-xs"
            >
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 font-heading text-[1.375rem] font-semibold tabular-nums tracking-tight text-foreground">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Grouped tile sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {section.title}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.tiles.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.href}
                      href={{ pathname: t.href }}
                      className="group"
                    >
                      <Card
                        className={
                          "relative overflow-hidden transition-all duration-[var(--duration-fast)] group-hover:-translate-y-[1px] group-hover:shadow-md group-hover:border-border-strong"
                        }
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={
                                t.accent
                                  ? "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary"
                                  : "flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground/80"
                              }
                            >
                              <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.8} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 -translate-x-1 -translate-y-0 text-muted-foreground/40 transition-all duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0 group-hover:text-primary" />
                          </div>
                          <CardTitle className="mt-3">{t.title}</CardTitle>
                          <CardDescription>{t.desc}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </PageBody>
    </>
  );
}
