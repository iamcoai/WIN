"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createBookingField,
  deleteBookingField,
  moveBookingField,
  updateBookingField,
} from "@/modules/booking/actions";

type FieldType = "text" | "textarea" | "email" | "phone" | "select" | "checkbox";

export function NewBookingFieldDialog() {
  const [open, setOpen] = useState(false);
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const opts = String(formData.get("options") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    startTransition(async () => {
      await createBookingField({
        key: String(formData.get("key") ?? ""),
        label: String(formData.get("label") ?? ""),
        fieldType,
        options: opts,
        placeholder: String(formData.get("placeholder") ?? "") || undefined,
        required: formData.get("required") === "on",
      });
      setOpen(false);
      setFieldType("text");
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Nieuw veld</Button>} />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nieuw formulierveld</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nf-label">Label</Label>
            <Input id="nf-label" name="label" required placeholder="bv. Hoe heb je ons gevonden?" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nf-key">Key (technisch)</Label>
            <Input id="nf-key" name="key" required placeholder="bron" />
            <p className="text-xs text-muted-foreground">kleine letters, underscore, geen spaties</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nf-type">Type</Label>
            <select
              id="nf-type"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as FieldType)}
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
            >
              <option value="text">Tekst</option>
              <option value="textarea">Lange tekst</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefoon</option>
              <option value="select">Keuzelijst</option>
              <option value="checkbox">Ja/nee</option>
            </select>
          </div>
          {fieldType === "select" ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nf-options">Opties (één per regel)</Label>
              <Textarea id="nf-options" name="options" rows={4} placeholder="Via Google&#10;Via LinkedIn&#10;Aanbeveling" />
            </div>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nf-placeholder">Placeholder (optioneel)</Label>
            <Input id="nf-placeholder" name="placeholder" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="nf-required" name="required" />
            <Label htmlFor="nf-required" className="cursor-pointer">Verplicht veld</Label>
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

export function FieldRowActions({
  field,
  isFirst,
  isLast,
}: {
  field: {
    id: string;
    label: string;
    fieldType: string;
    options: string[];
    placeholder: string | null;
    required: boolean;
    active: boolean;
    system: boolean;
  };
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  function handleEdit(formData: FormData) {
    const opts = String(formData.get("options") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    run(async () => {
      await updateBookingField(field.id, {
        label: String(formData.get("label") ?? ""),
        options: field.fieldType === "select" ? opts : undefined,
        placeholder: String(formData.get("placeholder") ?? "") || null,
        required: formData.get("required") === "on",
        active: formData.get("active") === "on",
      });
      setEditOpen(false);
    });
  }

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={pending || isFirst}
        onClick={() => run(() => moveBookingField(field.id, "up"))}
        aria-label="Omhoog"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={pending || isLast}
        onClick={() => run(() => moveBookingField(field.id, "down"))}
        aria-label="Omlaag"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </Button>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Bewerken">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          }
        />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Veld bewerken</DialogTitle>
          </DialogHeader>
          <form action={handleEdit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`ef-label-${field.id}`}>Label</Label>
              <Input id={`ef-label-${field.id}`} name="label" required defaultValue={field.label} />
            </div>
            {field.fieldType === "select" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`ef-options-${field.id}`}>Opties (één per regel)</Label>
                <Textarea
                  id={`ef-options-${field.id}`}
                  name="options"
                  rows={4}
                  defaultValue={field.options.join("\n")}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`ef-placeholder-${field.id}`}>Placeholder</Label>
              <Input
                id={`ef-placeholder-${field.id}`}
                name="placeholder"
                defaultValue={field.placeholder ?? ""}
              />
            </div>
            {field.system ? (
              <p className="text-xs text-muted-foreground">
                Systeemveld — altijd actief en verplicht (nodig om te kunnen boeken).
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox id={`ef-required-${field.id}`} name="required" defaultChecked={field.required} />
                  <Label htmlFor={`ef-required-${field.id}`} className="cursor-pointer">Verplicht</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id={`ef-active-${field.id}`} name="active" defaultChecked={field.active} />
                  <Label htmlFor={`ef-active-${field.id}`} className="cursor-pointer">
                    Actief (zichtbaar op de site)
                  </Label>
                </div>
              </>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                Annuleren
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Opslaan…" : "Opslaan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {!field.system ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          disabled={pending}
          onClick={() => {
            if (confirm(`Veld "${field.label}" verwijderen?`)) {
              run(() => deleteBookingField(field.id));
            }
          }}
          aria-label="Verwijderen"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
