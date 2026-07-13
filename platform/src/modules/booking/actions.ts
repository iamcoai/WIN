"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { asc, eq, max, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activity,
  availabilityRule,
  booking,
  bookingField,
  bookingSettings,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

const makeId = (p: string) => `${p}_${randomBytes(7).toString("hex")}`;

async function requireAdminOrCoach() {
  const cur = await getCurrentUser();
  if (!cur || (cur.user.role !== "admin" && cur.user.role !== "coach")) {
    throw new Error("Niet geautoriseerd");
  }
  return cur;
}

const BOOKING_PATHS = ["/admin/boekingen", "/admin/boekingen/beschikbaarheid", "/admin/boekingen/formulier"];

function revalidateBooking() {
  for (const p of BOOKING_PATHS) revalidatePath(p);
}

// ─── Settings ────────────────────────────────────────────────────────

export async function updateBookingSettings(patch: {
  active?: boolean;
  slotMinutes?: number;
  bufferMinutes?: number;
  minNoticeHours?: number;
  maxDaysAhead?: number;
  location?: string;
}) {
  await requireAdminOrCoach();
  const clamp = (v: number | undefined, min: number, max: number) =>
    v === undefined ? undefined : Math.max(min, Math.min(max, Math.round(v)));
  await db
    .update(bookingSettings)
    .set({
      active: patch.active,
      slotMinutes: clamp(patch.slotMinutes, 10, 240),
      bufferMinutes: clamp(patch.bufferMinutes, 0, 120),
      minNoticeHours: clamp(patch.minNoticeHours, 0, 336),
      maxDaysAhead: clamp(patch.maxDaysAhead, 1, 365),
      location: patch.location?.trim() || undefined,
      updatedAt: new Date(),
    })
    .where(eq(bookingSettings.id, "default"));
  revalidateBooking();
}

// ─── Availability rules ──────────────────────────────────────────────

export async function addAvailabilityRule(input: {
  weekday: number;
  startMinute: number;
  endMinute: number;
}) {
  await requireAdminOrCoach();
  if (input.weekday < 1 || input.weekday > 7) throw new Error("Ongeldige weekdag");
  if (
    input.startMinute < 0 ||
    input.endMinute > 1440 ||
    input.startMinute >= input.endMinute
  ) {
    throw new Error("Ongeldig tijdvenster");
  }
  await db.insert(availabilityRule).values({
    id: makeId("avr"),
    weekday: input.weekday,
    startMinute: input.startMinute,
    endMinute: input.endMinute,
  });
  revalidateBooking();
}

export async function toggleAvailabilityRule(id: string, active: boolean) {
  await requireAdminOrCoach();
  await db
    .update(availabilityRule)
    .set({ active })
    .where(eq(availabilityRule.id, id));
  revalidateBooking();
}

export async function deleteAvailabilityRule(id: string) {
  await requireAdminOrCoach();
  await db.delete(availabilityRule).where(eq(availabilityRule.id, id));
  revalidateBooking();
}

// ─── Form fields ─────────────────────────────────────────────────────

export async function createBookingField(input: {
  key: string;
  label: string;
  fieldType: "text" | "textarea" | "email" | "phone" | "select" | "checkbox";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}) {
  await requireAdminOrCoach();
  const key = input.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
  if (!key) throw new Error("Key is verplicht");
  const [{ maxPos }] = await db
    .select({ maxPos: max(bookingField.position) })
    .from(bookingField);
  await db.insert(bookingField).values({
    id: makeId("bf"),
    key,
    label: input.label.trim(),
    fieldType: input.fieldType,
    options: input.options ?? [],
    placeholder: input.placeholder?.trim() || null,
    required: input.required ?? false,
    position: (maxPos ?? -1) + 1,
  });
  revalidateBooking();
}

export async function updateBookingField(
  id: string,
  patch: {
    label?: string;
    options?: string[];
    placeholder?: string | null;
    required?: boolean;
    active?: boolean;
  },
) {
  await requireAdminOrCoach();
  await db
    .update(bookingField)
    .set({
      label: patch.label?.trim() || undefined,
      options: patch.options,
      placeholder:
        patch.placeholder === undefined ? undefined : patch.placeholder,
      required: patch.required,
      active: patch.active,
      updatedAt: new Date(),
    })
    .where(eq(bookingField.id, id));
  revalidateBooking();
}

export async function deleteBookingField(id: string) {
  await requireAdminOrCoach();
  const rows = await db
    .select({ system: bookingField.system })
    .from(bookingField)
    .where(eq(bookingField.id, id))
    .limit(1);
  if (rows[0]?.system) throw new Error("Systeemvelden kun je niet verwijderen");
  await db.delete(bookingField).where(eq(bookingField.id, id));
  revalidateBooking();
}

export async function moveBookingField(id: string, direction: "up" | "down") {
  await requireAdminOrCoach();
  const fields = await db
    .select({ id: bookingField.id })
    .from(bookingField)
    .orderBy(asc(bookingField.position));
  const idx = fields.findIndex((f) => f.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swap < 0 || swap >= fields.length) return;
  await Promise.all([
    db.update(bookingField).set({ position: swap }).where(eq(bookingField.id, fields[idx].id)),
    db.update(bookingField).set({ position: idx }).where(eq(bookingField.id, fields[swap].id)),
  ]);
  revalidateBooking();
}

// ─── Bookings ────────────────────────────────────────────────────────

export async function cancelBooking(id: string, reason?: string) {
  await requireAdminOrCoach();
  const rows = await db
    .select()
    .from(booking)
    .where(eq(booking.id, id))
    .limit(1);
  if (!rows.length) throw new Error("Boeking niet gevonden");
  await db
    .update(booking)
    .set({
      status: "cancelled",
      cancellationReason: reason?.trim() || "Geannuleerd via dashboard",
      updatedAt: new Date(),
    })
    .where(eq(booking.id, id));
  await db.insert(activity).values({
    id: makeId("act"),
    type: "meeting",
    title: "Kennismaking geannuleerd",
    content: reason?.trim() || "Geannuleerd via dashboard.",
    contactId: rows[0].contactId,
    occurredAt: new Date(),
  });
  revalidateBooking();
  revalidatePath("/coach/agenda");
}
