import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { and, asc, desc, eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare } from "lucide-react";
import { db } from "@/lib/db";
import { chatMessage, chatThread, user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { cn } from "@/lib/utils";

async function sendMessage(formData: FormData) {
  "use server";
  const content = String(formData.get("content") ?? "").trim();
  const threadId = String(formData.get("threadId") ?? "");
  const senderId = String(formData.get("senderId") ?? "");
  if (!content || !threadId || !senderId) return;
  const id = `msg_${randomBytes(8).toString("hex")}`;
  await db.insert(chatMessage).values({ id, threadId, senderId, content });
  await db
    .update(chatThread)
    .set({ lastMessageAt: new Date() })
    .where(eq(chatThread.id, threadId));
  revalidatePath("/app/chat");
}

export default async function ChatPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  // Pick first thread as a client.
  const [thread] = await db
    .select()
    .from(chatThread)
    .where(eq(chatThread.clientId, current.user.id))
    .orderBy(desc(chatThread.lastMessageAt))
    .limit(1);

  if (!thread) {
    return (
      <>
        <PageHeader title="Chat" description="1-op-1 met je coach." />
        <PageBody>
          <EmptyState
            icon={MessageSquare}
            title="Nog geen chat actief"
            description="Zodra je aan een coach gekoppeld bent verschijnt de chat hier."
          />
        </PageBody>
      </>
    );
  }

  const [coach] = await db.select().from(user).where(eq(user.id, thread.coachId)).limit(1);

  const messages = await db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.threadId, thread.id))
    .orderBy(asc(chatMessage.createdAt));

  return (
    <>
      <PageHeader
        title={`Chat met ${coach?.name ?? "je coach"}`}
        description="Stuur berichten, stel vragen, check-in."
      />
      <PageBody>
        <Card className="flex h-[calc(100vh-14rem)] flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {messages.map((m) => {
                const mine = m.senderId === current.user.id;
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      mine
                        ? "self-end bg-primary text-primary-foreground"
                        : "self-start bg-muted text-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                );
              })}
              {messages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Nog geen berichten. Begin het gesprek.
                </p>
              ) : null}
            </div>
          </CardContent>
          <div className="border-t border-border p-3">
            <form action={sendMessage} className="flex gap-2">
              <input type="hidden" name="threadId" value={thread.id} />
              <input type="hidden" name="senderId" value={current.user.id} />
              <Input name="content" placeholder="Schrijf een bericht…" required className="flex-1" />
              <Button type="submit">Verstuur</Button>
            </form>
          </div>
        </Card>
      </PageBody>
    </>
  );
}
