"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addActivity } from "@/modules/crm/actions";

export function ActivityForm({
  contactId,
  dealId,
  workshopId,
}: {
  contactId?: string;
  dealId?: string;
  workshopId?: string;
}) {
  const [type, setType] = useState<"note" | "call" | "meeting" | "email">("note");
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState("");
  const router = useRouter();

  function submit() {
    if (!content.trim()) return;
    startTransition(async () => {
      await addActivity({
        type,
        content,
        contactId,
        dealId,
        workshopId,
      });
      setContent("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-2 flex gap-1.5">
        {(["note", "call", "meeting", "email"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={
              type === t
                ? "rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                : "rounded-full bg-card px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
            }
          >
            {t === "note"
              ? "Notitie"
              : t === "call"
                ? "Telefoon"
                : t === "meeting"
                  ? "Meeting"
                  : "E-mail"}
          </button>
        ))}
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={type === "note" ? "Wat wil je vastleggen?" : "Vat het gesprek kort samen…"}
        rows={3}
      />
      <div className="mt-2 flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={submit}
          disabled={pending || !content.trim()}
        >
          {pending ? "Opslaan…" : "Toevoegen"}
        </Button>
      </div>
    </div>
  );
}
