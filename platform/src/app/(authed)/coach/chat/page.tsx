import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";
import { db } from "@/lib/db";
import { chatThread, user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function CoachChatPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const threads = await db
    .select({
      id: chatThread.id,
      lastMessageAt: chatThread.lastMessageAt,
      clientName: user.name,
      clientEmail: user.email,
      clientId: user.id,
    })
    .from(chatThread)
    .innerJoin(user, eq(user.id, chatThread.clientId))
    .where(
      current.user.role === "admin"
        ? undefined
        : eq(chatThread.coachId, current.user.id),
    )
    .orderBy(desc(chatThread.lastMessageAt));

  return (
    <>
      <PageHeader title="Chat" description="Gesprekken met je cliënten." />
      <PageBody>
        {threads.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Geen actieve gesprekken" />
        ) : (
          <div className="grid gap-3">
            {threads.map((t) => (
              <Link key={t.id} href={{ pathname: `/coach/clienten/${t.clientId}` }}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {t.clientName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <CardTitle>{t.clientName}</CardTitle>
                        <CardDescription className="text-xs">
                          {t.lastMessageAt
                            ? `Laatste bericht: ${new Intl.DateTimeFormat("nl-NL", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(t.lastMessageAt))}`
                            : "Nog geen bericht"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
