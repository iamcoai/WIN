"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Pen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addActivity } from "@/modules/crm/actions";

export function SessionNotesPad({ contactId }: { contactId: string }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"meeting" | "note" | "call">("meeting");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function save() {
    if (!content.trim()) return;
    startTransition(async () => {
      await addActivity({
        type,
        title: title.trim() || "Sessie-notitie",
        content: content.trim(),
        contactId,
      });
      setSaved(true);
      setContent("");
      setTitle("");
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <Card className="sticky top-20">
      <CardHeader className="px-5 pt-5 pb-2">
        <CardTitle className="flex items-center gap-2 text-[1rem]">
          <Pen className="h-4 w-4 text-primary" />
          Live notities
        </CardTitle>
        <p className="text-[0.8125rem] text-muted-foreground">
          Wat wil je niet vergeten? Landt direct op het cliënt-dossier.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 px-5 pb-5">
        <div className="flex gap-1.5">
          {(["meeting", "note", "call"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={
                type === t
                  ? "rounded-full bg-primary px-3 py-1 text-[0.6875rem] font-medium text-primary-foreground"
                  : "rounded-full bg-muted px-3 py-1 text-[0.6875rem] text-muted-foreground hover:bg-muted/80"
              }
            >
              {t === "meeting" ? "Sessie" : t === "note" ? "Notitie" : "Telefoon"}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Titel (optioneel)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-card px-3 text-[0.9375rem] outline-none transition-colors focus:border-primary/40"
        />
        <Textarea
          placeholder="Kernpunten, inzichten, volgende stap…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="text-[0.9375rem]"
        />
        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={pending || !content.trim()}>
            {pending ? "Opslaan…" : "Opslaan op dossier"}
          </Button>
          {saved ? (
            <span className="flex items-center gap-1 text-xs text-success animate-fade-in">
              <Check className="h-3.5 w-3.5" /> opgeslagen
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
