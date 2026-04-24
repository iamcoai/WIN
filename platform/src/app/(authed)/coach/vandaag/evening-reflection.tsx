"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Moon, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { saveJournalEntry } from "./actions";

const PROMPT = "Wat voelde vandaag af? Wat wil ik morgen laten landen?";

export function EveningReflectionCard({
  userId,
  existing,
}: {
  userId: string;
  existing: { id: string; content: string; mood: number | null } | null;
}) {
  const [content, setContent] = useState(existing?.content ?? "");
  const [mood, setMood] = useState<number | null>(existing?.mood ?? null);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function onSave() {
    if (!content.trim()) return;
    startTransition(async () => {
      await saveJournalEntry({ userId, content: content.trim(), mood, prompt: PROMPT });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <Card>
      <CardHeader className="px-5 pt-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
            <Moon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-caption mb-0.5">Vanavond</p>
            <CardTitle className="text-[1.0625rem]">{PROMPT}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Textarea
          rows={3}
          placeholder="Twee zinnen is genoeg."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-[0.9375rem]"
        />

        {/* Mood 1-7 */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-caption">Gevoel</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMood(n === mood ? null : n)}
                className={cn(
                  "h-7 w-7 rounded-md text-xs font-medium transition-all duration-[var(--duration-fast)]",
                  mood === n
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted",
                )}
                aria-label={`Stemming ${n}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button type="button" onClick={onSave} disabled={pending || !content.trim()}>
            {pending ? "Opslaan…" : existing ? "Bijwerken" : "Opslaan"}
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
