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
import { Plus } from "lucide-react";
import { createTag } from "@/modules/crm/actions";

export function NewTagDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handle(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return;
    startTransition(async () => {
      await createTag(name, String(formData.get("color") ?? "neutral"));
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Nieuwe tag</Button>} />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nieuwe tag</DialogTitle>
        </DialogHeader>
        <form action={handle} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Naam</Label>
            <Input id="name" name="name" required placeholder="bv. HR / Management" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="color">Kleur</Label>
            <select
              id="color"
              name="color"
              defaultValue="neutral"
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
            >
              <option value="neutral">Neutraal</option>
              <option value="gold">Goud</option>
              <option value="olive">Olijf</option>
              <option value="success">Groen</option>
              <option value="warn">Oranje</option>
              <option value="danger">Rood</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={pending}>
              Toevoegen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
