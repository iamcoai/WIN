"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteCustomField } from "@/modules/crm/actions";

export function DeleteFieldButton({ id, label }: { id: string; label: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Veld "${label}" verwijderen?`)) return;
        startTransition(async () => {
          await deleteCustomField(id);
          router.refresh();
        });
      }}
      className="rounded p-1.5 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
      aria-label="Verwijderen"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
