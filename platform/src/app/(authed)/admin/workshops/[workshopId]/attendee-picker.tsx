"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { addWorkshopAttendee } from "@/modules/crm/actions";

export function AttendeePicker({
  workshopId,
  contacts,
}: {
  workshopId: string;
  contacts: { id: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const filtered = q
    ? contacts.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))
    : contacts;

  function add(id: string) {
    startTransition(async () => {
      await addWorkshopAttendee(workshopId, id);
      setOpen(false);
      setQ("");
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm"><Plus className="h-3.5 w-3.5" /> Aanmelder toevoegen</Button>} />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact toevoegen aan workshop</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Zoek op naam of e-mail…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="mb-3"
        />
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Geen resultaten.</p>
          ) : (
            filtered.slice(0, 50).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => add(c.id)}
                className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {c.label}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
