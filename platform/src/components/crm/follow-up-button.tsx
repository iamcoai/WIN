"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scheduleFollowUp } from "@/modules/tasks/actions";
import { cn } from "@/lib/utils";

type VariantName = "default" | "outline" | "ghost" | "secondary";

const PRESETS = [
  { days: 1, label: "Morgen" },
  { days: 3, label: "Over 3 dagen" },
  { days: 7, label: "Volgende week" },
  { days: 14, label: "Over 2 weken" },
  { days: 30, label: "Over een maand" },
];

export function FollowUpButton({
  contactId,
  dealId,
  workshopId,
  defaultTitle,
  variant = "outline",
}: {
  contactId?: string;
  dealId?: string;
  workshopId?: string;
  defaultTitle?: string;
  variant?: VariantName;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customDays, setCustomDays] = useState("7");
  const [customTitle, setCustomTitle] = useState(defaultTitle ?? "");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<string | null>(null);
  const router = useRouter();

  function schedule(days: number, title?: string) {
    const t = (title ?? defaultTitle ?? "Follow-up").trim();
    startTransition(async () => {
      await scheduleFollowUp({
        title: t,
        daysFromNow: days,
        contactId,
        dealId,
        workshopId,
      });
      setDone(`Follow-up over ${days} dag${days === 1 ? "" : "en"}`);
      router.refresh();
      setTimeout(() => setDone(null), 2500);
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant={variant} size="sm" disabled={pending}>
              <Clock className="h-3.5 w-3.5" />
              {done ?? "Herinner me"}
              {done ? <Check className="h-3.5 w-3.5 text-success" /> : null}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Herinner me over…</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PRESETS.map((p) => (
            <DropdownMenuItem
              key={p.days}
              onClick={() => schedule(p.days)}
            >
              <Clock className="h-3.5 w-3.5" />
              {p.label}
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                +{p.days}d
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCustomOpen(true)}>
            Zelf instellen…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Follow-up inplannen</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fu-title">Waar gaat het over?</Label>
              <Textarea
                id="fu-title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                rows={2}
                placeholder="Check-in met ..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fu-days">Over hoeveel dagen?</Label>
              <Input
                id="fu-days"
                type="number"
                min="1"
                max="365"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCustomOpen(false)}>
              Annuleren
            </Button>
            <Button
              onClick={() => {
                const n = parseInt(customDays, 10);
                if (!Number.isFinite(n) || n < 1) return;
                schedule(n, customTitle);
                setCustomOpen(false);
              }}
              disabled={pending || !customTitle.trim()}
            >
              Plan in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
