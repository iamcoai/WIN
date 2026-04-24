"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleHabitToday } from "./actions";

type Habit = {
  id: string;
  title: string;
  description?: string;
  doneToday: boolean;
};

export function HabitTicker({
  userId,
  habits,
}: {
  userId: string;
  habits: Habit[];
}) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const [optimistic, setOptimistic] = useState<Record<string, boolean>>(
    Object.fromEntries(habits.map((h) => [h.id, h.doneToday])),
  );

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {habits.map((h) => {
        const done = optimistic[h.id];
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => {
              setOptimistic((o) => ({ ...o, [h.id]: !o[h.id] }));
              startTransition(async () => {
                await toggleHabitToday(h.id, userId);
                router.refresh();
              });
            }}
            className={cn(
              "group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-all duration-[var(--duration-fast)]",
              done
                ? "border-primary/40 bg-primary/5"
                : "border-border hover:border-border-strong hover:bg-muted/40",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-[var(--duration-fast)]",
                done
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-transparent group-hover:border-primary/40",
              )}
            >
              <Check
                className={cn(
                  "h-4 w-4 transition-all duration-[var(--duration-fast)]",
                  done ? "opacity-100 scale-100" : "opacity-0 scale-50",
                )}
                strokeWidth={2.5}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  done ? "text-foreground line-through decoration-primary/40 decoration-1" : "text-foreground",
                )}
              >
                {h.title}
              </p>
              {h.description ? (
                <p className="truncate text-xs text-muted-foreground">
                  {h.description}
                </p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
