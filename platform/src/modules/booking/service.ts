import { randomBytes } from "node:crypto";
import { and, asc, eq, gte, lte, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activity,
  availabilityRule,
  booking,
  bookingField,
  bookingSettings,
  contact,
} from "@/lib/db/schema";

const makeId = (p: string) => `${p}_${randomBytes(7).toString("hex")}`;

// ─── Timezone helpers (dependency-free) ──────────────────────────────
// Availability windows are wall-clock times in the settings timezone;
// bookings are stored as UTC instants.

function tzOffsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value]),
  );
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return (asUTC - date.getTime()) / 60_000;
}

/** "2026-07-15" + 540 wall-clock minutes in `tz` → UTC Date (DST-safe). */
function wallTimeToUtc(dateStr: string, minuteOfDay: number, tz: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const naive = Date.UTC(y, m - 1, d, 0, minuteOfDay);
  let offset = tzOffsetMinutes(new Date(naive), tz);
  let utc = naive - offset * 60_000;
  const offset2 = tzOffsetMinutes(new Date(utc), tz);
  if (offset2 !== offset) utc = naive - offset2 * 60_000;
  return new Date(utc);
}

function dateStrInTz(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** ISO weekday (1 = maandag … 7 = zondag) of a calendar date. */
function isoWeekday(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return dow === 0 ? 7 : dow;
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return next.toISOString().slice(0, 10);
}

// ─── Config ──────────────────────────────────────────────────────────

export async function getSettings() {
  const rows = await db
    .select()
    .from(bookingSettings)
    .where(eq(bookingSettings.id, "default"))
    .limit(1);
  if (!rows.length) throw new Error("booking_settings ontbreekt (seed niet gedraaid)");
  return rows[0];
}

export async function getPublicConfig() {
  const [settings, fields] = await Promise.all([
    getSettings(),
    db
      .select({
        key: bookingField.key,
        label: bookingField.label,
        fieldType: bookingField.fieldType,
        options: bookingField.options,
        placeholder: bookingField.placeholder,
        required: bookingField.required,
      })
      .from(bookingField)
      .where(eq(bookingField.active, true))
      .orderBy(asc(bookingField.position)),
  ]);
  return {
    active: settings.active,
    slotMinutes: settings.slotMinutes,
    maxDaysAhead: settings.maxDaysAhead,
    timezone: settings.timezone,
    location: settings.location,
    fields,
  };
}

// ─── Slot computation ────────────────────────────────────────────────

export type DaySlots = Record<string, string[]>; // "2026-07-15" → ISO starts

export async function getAvailableSlots(
  fromStr: string,
  toStr: string,
): Promise<DaySlots> {
  const settings = await getSettings();
  if (!settings.active) return {};
  const tz = settings.timezone;
  const now = new Date();

  const earliest = new Date(
    now.getTime() + settings.minNoticeHours * 3_600_000,
  );
  const firstDay = dateStrInTz(earliest, tz);
  // Calendar days, not 24h blocks — keeps the horizon DST-exact and in
  // sync with the widget's own max-date arithmetic.
  const lastDay = addDays(dateStrInTz(now, tz), settings.maxDaysAhead);
  let cursor = fromStr < firstDay ? firstDay : fromStr;
  const end = toStr > lastDay ? lastDay : toStr;
  if (cursor > end) return {};

  const rules = await db
    .select()
    .from(availabilityRule)
    .where(eq(availabilityRule.active, true));
  if (!rules.length) return {};
  const rulesByDay = new Map<number, typeof rules>();
  for (const r of rules) {
    const list = rulesByDay.get(r.weekday) ?? [];
    list.push(r);
    rulesByDay.set(r.weekday, list);
  }

  // All live bookings in the window (buffer-padded) for overlap checks.
  const windowStart = wallTimeToUtc(cursor, 0, tz);
  const windowEnd = wallTimeToUtc(addDays(end, 1), 0, tz);
  const busy = await db
    .select({ startsAt: booking.startsAt, endsAt: booking.endsAt })
    .from(booking)
    .where(
      and(
        ne(booking.status, "cancelled"),
        gte(booking.endsAt, new Date(windowStart.getTime() - 86_400_000)),
        lte(booking.startsAt, new Date(windowEnd.getTime() + 86_400_000)),
      ),
    );

  const bufferMs = settings.bufferMinutes * 60_000;
  const slotMs = settings.slotMinutes * 60_000;
  const result: DaySlots = {};

  while (cursor <= end) {
    const dayRules = rulesByDay.get(isoWeekday(cursor)) ?? [];
    // Set: the DST spring-gap maps two wall times onto one instant.
    const slots = new Set<string>();
    for (const rule of dayRules) {
      for (
        let min = rule.startMinute;
        min + settings.slotMinutes <= rule.endMinute;
        min += settings.slotMinutes
      ) {
        const start = wallTimeToUtc(cursor, min, tz);
        if (start < earliest) continue;
        const endMs = start.getTime() + slotMs;
        const overlaps = busy.some(
          (b) =>
            start.getTime() < b.endsAt.getTime() + bufferMs &&
            endMs + bufferMs > b.startsAt.getTime(),
        );
        if (!overlaps) slots.add(start.toISOString());
      }
    }
    if (slots.size) result[cursor] = [...slots].sort();
    cursor = addDays(cursor, 1);
  }
  return result;
}

// ─── Contact upsert + activity (shared with CRM) ─────────────────────

async function upsertContact(input: {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  company: string | null;
}): Promise<string> {
  // Oldest first — repeat bookings attach deterministically to the
  // original contact if duplicates ever exist.
  const existing = await db
    .select({ id: contact.id })
    .from(contact)
    .where(sql`lower(${contact.email}) = ${input.email.toLowerCase()}`)
    .orderBy(asc(contact.createdAt))
    .limit(1);

  if (existing.length) {
    const id = existing[0].id;
    // Only fill empty fields — CRM edits by Chris/Reza always win.
    await db
      .update(contact)
      .set({
        firstName: sql`COALESCE(NULLIF(${contact.firstName}, ''), ${input.firstName})`,
        lastName: sql`COALESCE(NULLIF(${contact.lastName}, ''), ${input.lastName})`,
        phone: sql`COALESCE(NULLIF(${contact.phone}, ''), ${input.phone})`,
        company: sql`COALESCE(NULLIF(${contact.company}, ''), ${input.company})`,
        lastContactedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contact.id, id));
    return id;
  }

  const id = makeId("ct");
  await db.insert(contact).values({
    id,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    company: input.company,
    source: "kennismaking",
    lifecycle: "lead",
    lastContactedAt: new Date(),
  });
  return id;
}

const dateFmt = new Intl.DateTimeFormat("nl-NL", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Europe/Amsterdam",
});

// ─── Create booking (public) ─────────────────────────────────────────

export type CreateBookingInput = {
  startsAt: string;
  responses: Record<string, unknown>;
};

export type CreateBookingResult =
  | { ok: true; bookingId: string; startsAt: string }
  | { ok: false; error: string; code: "invalid" | "slot_taken" | "closed" };

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const settings = await getSettings();
  if (!settings.active) {
    return { ok: false, code: "closed", error: "Boekingen staan tijdelijk uit." };
  }

  const fields = await db
    .select()
    .from(bookingField)
    .where(eq(bookingField.active, true));

  const responses: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = input.responses?.[f.key];
    const val = typeof raw === "string" ? raw.trim() : raw;
    // Widget stuurt checkboxes als string ("ja"); accepteer gangbare vormen.
    const checked =
      val === true || ["true", "ja", "on", "1"].includes(String(val ?? ""));
    const missing =
      val === undefined ||
      val === null ||
      val === "" ||
      (f.fieldType === "checkbox" && !checked);
    if (f.required && missing) {
      return { ok: false, code: "invalid", error: `"${f.label}" is verplicht.` };
    }
    if (val === undefined || val === null || val === "") continue;
    if (f.fieldType === "select") {
      const options = (f.options as string[]) ?? [];
      if (typeof val !== "string" || !options.includes(val)) {
        return { ok: false, code: "invalid", error: `Ongeldige keuze voor "${f.label}".` };
      }
    }
    if (f.fieldType === "checkbox") {
      responses[f.key] = checked;
      continue;
    }
    if (typeof val !== "string" || val.length > 5000) {
      return { ok: false, code: "invalid", error: `Ongeldige waarde voor "${f.label}".` };
    }
    responses[f.key] = val;
  }

  const email = responses.email;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, code: "invalid", error: "Vul een geldig e-mailadres in." };
  }

  const startsAt = new Date(input.startsAt ?? "");
  if (Number.isNaN(startsAt.getTime())) {
    return { ok: false, code: "invalid", error: "Ongeldig tijdstip." };
  }
  // Server-side slot validation: the requested start must be in the
  // freshly computed availability for that day.
  const day = dateStrInTz(startsAt, settings.timezone);
  const slots = await getAvailableSlots(day, day);
  if (!slots[day]?.includes(startsAt.toISOString())) {
    return {
      ok: false,
      code: "slot_taken",
      error: "Dit tijdstip is helaas net bezet. Kies een ander moment.",
    };
  }

  const firstName = typeof responses.voornaam === "string" ? responses.voornaam : null;
  const lastName = typeof responses.achternaam === "string" ? responses.achternaam : null;
  const contactId = await upsertContact({
    email,
    firstName,
    lastName,
    phone: typeof responses.telefoon === "string" ? responses.telefoon : null,
    company: typeof responses.bedrijf === "string" ? responses.bedrijf : null,
  });

  const service = typeof responses.dienst === "string" ? responses.dienst : null;
  const bookedAt = new Date();
  const id = makeId("bk");

  try {
    await db.insert(booking).values({
      id,
      contactId,
      service,
      startsAt,
      endsAt: new Date(startsAt.getTime() + settings.slotMinutes * 60_000),
      status: "confirmed",
      location: settings.location,
      attendeeName: [firstName, lastName].filter(Boolean).join(" ") || null,
      attendeeEmail: email,
      responses,
      bookedAt,
      manageToken: randomBytes(24).toString("hex"),
    });
  } catch (err) {
    // Unique index on starts_at — two visitors raced for the same slot.
    // drizzle wraps the driver error; the constraint lives on the cause chain.
    let cause: unknown = err;
    while (cause instanceof Error && cause.cause) cause = cause.cause;
    const pgErr = cause as { code?: string; constraint_name?: string; message?: string };
    const isSlotRace =
      pgErr?.code === "23505" &&
      (pgErr.constraint_name === "booking_slot_unique" ||
        String(pgErr.message ?? "").includes("booking_slot_unique"));
    if (isSlotRace) {
      return {
        ok: false,
        code: "slot_taken",
        error: "Dit tijdstip is helaas net bezet. Kies een ander moment.",
      };
    }
    throw err;
  }

  await db.insert(activity).values({
    id: makeId("act"),
    type: "meeting",
    title: "Kennismaking geboekt",
    content: `${service ? `Dienst: ${service}. ` : ""}Afspraak op ${dateFmt.format(startsAt)}.`,
    contactId,
    occurredAt: bookedAt,
  });

  return { ok: true, bookingId: id, startsAt: startsAt.toISOString() };
}
