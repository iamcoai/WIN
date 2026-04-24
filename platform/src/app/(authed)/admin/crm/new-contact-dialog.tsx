"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createContact } from "@/modules/crm/actions";

type Tag = { id: string; name: string; color: string };
type CustomField = {
  id: string;
  key: string;
  label: string;
  fieldType: string;
  options: unknown;
  required: boolean;
};

export function NewContactDialog({
  tags,
  customFields,
}: {
  tags: Tag[];
  customFields: CustomField[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const customFieldValues: Record<string, unknown> = {};
    for (const cf of customFields) {
      const v = formData.get(`cf_${cf.key}`);
      if (v != null && v !== "") customFieldValues[cf.key] = v;
    }

    startTransition(async () => {
      await createContact({
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? "") || undefined,
        phone: String(formData.get("phone") ?? "") || undefined,
        company: String(formData.get("company") ?? "") || undefined,
        jobTitle: String(formData.get("jobTitle") ?? "") || undefined,
        source: String(formData.get("source") ?? "") || undefined,
        lifecycle: (formData.get("lifecycle") as "lead" | "prospect" | "customer") ?? "lead",
        notes: String(formData.get("notes") ?? "") || undefined,
        tags: selectedTags,
        customFields: customFieldValues,
      });
      setOpen(false);
      setSelectedTags([]);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="h-4 w-4" /> Nieuw contact</Button>} />
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nieuw contact</DialogTitle>
          <DialogDescription>
            Voeg een persoon toe aan je CRM.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Voornaam</Label>
              <Input id="firstName" name="firstName" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Achternaam</Label>
              <Input id="lastName" name="lastName" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Telefoon</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source">Bron</Label>
              <Input id="source" name="source" placeholder="website, verwijzing…" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="company">Bedrijf</Label>
              <Input id="company" name="company" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="jobTitle">Functie</Label>
              <Input id="jobTitle" name="jobTitle" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lifecycle">Lifecycle</Label>
            <select
              id="lifecycle"
              name="lifecycle"
              defaultValue="lead"
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
            >
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Tags */}
          {tags.length ? (
            <div className="flex flex-col gap-1.5">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => {
                  const active = selectedTags.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setSelectedTags((cur) =>
                          active ? cur.filter((x) => x !== t.id) : [...cur, t.id],
                        )
                      }
                      className={
                        active
                          ? "rounded-full border border-primary bg-primary/15 px-2.5 py-1 text-xs text-primary"
                          : "rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
                      }
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Custom fields */}
          {customFields.length ? (
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Eigen velden
              </p>
              {customFields.map((cf) => {
                const opts = (cf.options as string[] | null) ?? [];
                if (cf.fieldType === "textarea") {
                  return (
                    <div key={cf.id} className="flex flex-col gap-1.5">
                      <Label htmlFor={`cf_${cf.key}`}>{cf.label}</Label>
                      <Textarea
                        id={`cf_${cf.key}`}
                        name={`cf_${cf.key}`}
                        required={cf.required}
                      />
                    </div>
                  );
                }
                if (cf.fieldType === "select") {
                  return (
                    <div key={cf.id} className="flex flex-col gap-1.5">
                      <Label htmlFor={`cf_${cf.key}`}>{cf.label}</Label>
                      <select
                        id={`cf_${cf.key}`}
                        name={`cf_${cf.key}`}
                        required={cf.required}
                        className="h-8 rounded-lg border border-border bg-card px-2.5 text-sm"
                      >
                        <option value="">—</option>
                        {opts.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                const inputType =
                  cf.fieldType === "date"
                    ? "date"
                    : cf.fieldType === "number"
                      ? "number"
                      : cf.fieldType === "email"
                        ? "email"
                        : cf.fieldType === "url"
                          ? "url"
                          : "text";
                return (
                  <div key={cf.id} className="flex flex-col gap-1.5">
                    <Label htmlFor={`cf_${cf.key}`}>{cf.label}</Label>
                    <Input
                      id={`cf_${cf.key}`}
                      name={`cf_${cf.key}`}
                      type={inputType}
                      required={cf.required}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notities</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Opslaan…" : "Contact toevoegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
