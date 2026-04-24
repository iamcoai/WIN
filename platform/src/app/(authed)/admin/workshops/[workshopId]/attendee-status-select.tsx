"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAttendeeStatus } from "@/modules/crm/actions";

const OPTIONS = ["registered", "confirmed", "attended", "no_show", "cancelled"] as const;

export function AttendeeStatusSelect({
  attendeeId,
  initial,
}: {
  attendeeId: string;
  initial: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={initial}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value as (typeof OPTIONS)[number];
        startTransition(async () => {
          await updateAttendeeStatus(attendeeId, v);
          router.refresh();
        });
      }}
      className="h-7 rounded-md border border-border bg-card px-2 text-xs disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o === "registered"
            ? "Aangemeld"
            : o === "confirmed"
              ? "Bevestigd"
              : o === "attended"
                ? "Aanwezig"
                : o === "no_show"
                  ? "Niet verschenen"
                  : "Afgemeld"}
        </option>
      ))}
    </select>
  );
}
