"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { createWorkshop } from "@/modules/crm/actions";

export function NewWorkshopDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handle(formData: FormData) {
    const priceEuro = Number(formData.get("price") ?? 0);
    startTransition(async () => {
      await createWorkshop({
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? "") || undefined,
        type: (formData.get("type") as never) ?? "workshop",
        startsAt: String(formData.get("startsAt") ?? "") || undefined,
        endsAt: String(formData.get("endsAt") ?? "") || undefined,
        location: String(formData.get("location") ?? "") || undefined,
        capacity: Number(formData.get("capacity") ?? 0) || undefined,
        priceCents: priceEuro ? Math.round(priceEuro * 100) : undefined,
      });
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Nieuwe workshop</Button>} />
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nieuwe workshop</DialogTitle>
        </DialogHeader>
        <form action={handle} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Titel</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Omschrijving</Label>
            <Textarea id="description" name="description" rows={2} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                defaultValue="workshop"
                className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
              >
                <option value="workshop">Workshop</option>
                <option value="lezing">Lezing</option>
                <option value="training">Training</option>
                <option value="masterclass">Masterclass</option>
                <option value="retreat">Retreat</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="capacity">Max. deelnemers</Label>
              <Input id="capacity" name="capacity" type="number" min="1" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startsAt">Start</Label>
              <Input id="startsAt" name="startsAt" type="datetime-local" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endsAt">Eind</Label>
              <Input id="endsAt" name="endsAt" type="datetime-local" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Locatie</Label>
            <Input id="location" name="location" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Prijs (EUR)</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Opslaan…" : "Workshop aanmaken"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
