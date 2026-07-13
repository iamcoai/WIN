"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  addAvailabilityRule,
  deleteAvailabilityRule,
  toggleAvailabilityRule,
  updateBookingSettings,
} from "@/modules/booking/actions";

const WEEKDAYS = [
  { n: 1, label: "Maandag" },
  { n: 2, label: "Dinsdag" },
  { n: 3, label: "Woensdag" },
  { n: 4, label: "Donderdag" },
  { n: 5, label: "Vrijdag" },
  { n: 6, label: "Zaterdag" },
  { n: 7, label: "Zondag" },
];

type Rule = {
  id: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
  active: boolean;
};

type Settings = {
  active: boolean;
  slotMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  maxDaysAhead: number;
  location: string;
};

function minuteToTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function timeToMinute(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function AvailabilityEditor({
  settings,
  rules,
}: {
  settings: Settings;
  rules: Rule[];
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  function saveSettings(formData: FormData) {
    run(() =>
      updateBookingSettings({
        active: formData.get("active") === "on",
        slotMinutes: Number(formData.get("slotMinutes")),
        bufferMinutes: Number(formData.get("bufferMinutes")),
        minNoticeHours: Number(formData.get("minNoticeHours")),
        maxDaysAhead: Number(formData.get("maxDaysAhead")),
        location: String(formData.get("location") ?? ""),
      }),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      {/* Weekly windows */}
      <div className="space-y-3">
        {WEEKDAYS.map((day) => {
          const dayRules = rules.filter((r) => r.weekday === day.n);
          return (
            <Card key={day.n}>
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="text-sm">{day.label}</CardTitle>
                <AddWindowButton weekday={day.n} onAdd={run} pending={pending} />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {dayRules.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Niet beschikbaar</p>
                ) : (
                  <div className="space-y-1.5">
                    {dayRules.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-1.5"
                      >
                        <span className="text-sm tabular-nums">
                          {minuteToTime(r.startMinute)} – {minuteToTime(r.endMinute)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={r.active}
                            disabled={pending}
                            onCheckedChange={(v) =>
                              run(() => toggleAvailabilityRule(r.id, Boolean(v)))
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            disabled={pending}
                            onClick={() => run(() => deleteAvailabilityRule(r.id))}
                            aria-label="Venster verwijderen"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Settings */}
      <Card className="h-fit">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Instellingen</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <form action={saveSettings} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="active">Online boeken aan</Label>
              <Switch id="active" name="active" defaultChecked={settings.active} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slotMinutes">Duur per kennismaking (minuten)</Label>
              <Input
                id="slotMinutes"
                name="slotMinutes"
                type="number"
                min={10}
                max={240}
                step={5}
                defaultValue={settings.slotMinutes}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bufferMinutes">Buffer tussen afspraken (minuten)</Label>
              <Input
                id="bufferMinutes"
                name="bufferMinutes"
                type="number"
                min={0}
                max={120}
                step={5}
                defaultValue={settings.bufferMinutes}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="minNoticeHours">Minimaal vooraf boeken (uren)</Label>
              <Input
                id="minNoticeHours"
                name="minNoticeHours"
                type="number"
                min={0}
                max={336}
                defaultValue={settings.minNoticeHours}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maxDaysAhead">Maximaal vooruit boeken (dagen)</Label>
              <Input
                id="maxDaysAhead"
                name="maxDaysAhead"
                type="number"
                min={1}
                max={365}
                defaultValue={settings.maxDaysAhead}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Locatie / vorm</Label>
              <Input
                id="location"
                name="location"
                defaultValue={settings.location}
                placeholder="bv. Videogesprek"
              />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Opslaan…" : "Opslaan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AddWindowButton({
  weekday,
  onAdd,
  pending,
}: {
  weekday: number;
  onAdd: (fn: () => Promise<void>) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 gap-1 text-xs"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3 w-3" /> Venster
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="h-7 w-24 text-xs"
      />
      <span className="text-xs text-muted-foreground">–</span>
      <Input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="h-7 w-24 text-xs"
      />
      <Button
        size="sm"
        className="h-7 text-xs"
        disabled={pending || timeToMinute(start) >= timeToMinute(end)}
        onClick={() => {
          onAdd(() =>
            addAvailabilityRule({
              weekday,
              startMinute: timeToMinute(start),
              endMinute: timeToMinute(end),
            }),
          );
          setOpen(false);
        }}
      >
        Toevoegen
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs"
        onClick={() => setOpen(false)}
      >
        ×
      </Button>
    </div>
  );
}
