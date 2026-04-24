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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { createCustomField } from "@/modules/crm/actions";

export function NewCustomFieldDialog() {
  const [open, setOpen] = useState(false);
  const [fieldType, setFieldType] = useState("text");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const opts = String(formData.get("options") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      await createCustomField({
        entity: formData.get("entity") as "contact" | "deal" | "workshop",
        key: String(formData.get("key") ?? "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
        label: String(formData.get("label") ?? ""),
        fieldType: formData.get("fieldType") as never,
        options: opts,
        required: formData.get("required") === "on",
        description: String(formData.get("description") ?? "") || undefined,
      });
      setOpen(false);
      router.refresh();
    });
  }

  const showOptions = fieldType === "select" || fieldType === "multi_select";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Nieuw veld</Button>} />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nieuw custom field</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="entity">Voor welke entiteit?</Label>
            <select
              id="entity"
              name="entity"
              defaultValue="contact"
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
            >
              <option value="contact">Contact</option>
              <option value="deal">Deal</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="label">Label</Label>
            <Input id="label" name="label" required placeholder="bv. Niche" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="key">Key (technisch)</Label>
            <Input id="key" name="key" required placeholder="niche" />
            <p className="text-xs text-muted-foreground">
              kleine letters, underscore, geen spaties
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fieldType">Type</Label>
            <select
              id="fieldType"
              name="fieldType"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
            >
              <option value="text">Tekst</option>
              <option value="textarea">Lang tekst</option>
              <option value="number">Nummer</option>
              <option value="date">Datum</option>
              <option value="select">Enkele keuze</option>
              <option value="multi_select">Meerdere keuzes</option>
              <option value="boolean">Ja/nee</option>
              <option value="url">URL</option>
              <option value="email">E-mail</option>
            </select>
          </div>
          {showOptions ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="options">Opties (één per regel)</Label>
              <Textarea id="options" name="options" rows={4} placeholder="Coaching&#10;Organisatie&#10;Opleiding" />
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <Checkbox id="required" name="required" />
            <Label htmlFor="required" className="cursor-pointer">
              Verplicht veld
            </Label>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Omschrijving (optioneel)</Label>
            <Input id="description" name="description" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Opslaan…" : "Veld toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
