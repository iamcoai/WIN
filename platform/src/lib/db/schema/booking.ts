import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { user } from "./auth";
import { contact } from "./crm";

// ─── Bookings (eigen engine) ─────────────────────────────────────────
// Source of truth for the agenda page + dashboard widget. Rows are
// written by POST /api/booking (public site) or by admins.

export const booking = pgTable(
  "booking",
  {
    id: text("id").primaryKey(),
    contactId: text("contact_id").references(() => contact.id, {
      onDelete: "set null",
    }),
    // Chosen service from the booking form (Coaching, Mentorschap, …).
    service: text("service"),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    status: text("status", {
      enum: ["confirmed", "rescheduled", "cancelled"],
    })
      .default("confirmed")
      .notNull(),
    location: text("location"),
    // Raw attendee copies — survive contact merges/deletes.
    attendeeName: text("attendee_name"),
    attendeeEmail: text("attendee_email"),
    // All form answers, keyed by booking_field key.
    responses: jsonb("responses").default({}).notNull(),
    // Moment the visitor hit "versturen".
    bookedAt: timestamp("booked_at").notNull(),
    cancellationReason: text("cancellation_reason"),
    // Secret token for visitor-facing cancel/reschedule links (fase 2).
    manageToken: text("manage_token").notNull().unique(),
    source: text("source").default("website").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("booking_starts_idx").on(t.startsAt),
    index("booking_contact_idx").on(t.contactId),
    index("booking_status_idx").on(t.status, t.startsAt),
    // Backstop against double bookings — one live booking per slot start.
    uniqueIndex("booking_slot_unique")
      .on(t.startsAt)
      .where(sql`status <> 'cancelled'`),
  ],
);

// ─── Booking form fields ─────────────────────────────────────────────
// Editable in the dashboard; drives the public form on /kennismaking.
// System fields (voornaam/achternaam/email) can't be deleted.

export const bookingField = pgTable(
  "booking_field",
  {
    id: text("id").primaryKey(),
    key: text("key").notNull().unique(),
    label: text("label").notNull(),
    fieldType: text("field_type", {
      enum: ["text", "textarea", "email", "phone", "select", "checkbox"],
    })
      .default("text")
      .notNull(),
    options: jsonb("options").default([]).notNull(),
    placeholder: text("placeholder"),
    required: boolean("required").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
    system: boolean("system").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("booking_field_position_idx").on(t.position)],
);

// ─── Availability ────────────────────────────────────────────────────
// Weekly windows in wall-clock minutes, interpreted in the settings
// timezone (Europe/Amsterdam). weekday: 1 = maandag … 7 = zondag (ISO).

export const availabilityRule = pgTable(
  "availability_rule",
  {
    id: text("id").primaryKey(),
    weekday: integer("weekday").notNull(),
    startMinute: integer("start_minute").notNull(),
    endMinute: integer("end_minute").notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("availability_rule_weekday_idx").on(t.weekday)],
);

// Single-row settings table (id = "default").
export const bookingSettings = pgTable("booking_settings", {
  id: text("id").primaryKey(),
  active: boolean("active").default(true).notNull(),
  slotMinutes: integer("slot_minutes").default(30).notNull(),
  bufferMinutes: integer("buffer_minutes").default(0).notNull(),
  minNoticeHours: integer("min_notice_hours").default(24).notNull(),
  maxDaysAhead: integer("max_days_ahead").default(60).notNull(),
  timezone: text("timezone").default("Europe/Amsterdam").notNull(),
  location: text("location").default("Videogesprek").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Saved CRM views ─────────────────────────────────────────────────
// Per-user table configurations: visible columns + order, filters,
// sorting and layout. "Alles zelf kunnen aanpassen" lives here.

export const crmView = pgTable(
  "crm_view",
  {
    id: text("id").primaryKey(),
    entity: text("entity", {
      enum: ["contact", "deal", "workshop", "booking"],
    })
      .default("contact")
      .notNull(),
    name: text("name").notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    // Ordered column keys; built-in columns by name, custom fields as "cf:<key>".
    columns: jsonb("columns").default([]).notNull(),
    // [{ field, op, value }] — op depends on field type (contains, eq, gte, …).
    filters: jsonb("filters").default([]).notNull(),
    // [{ field, dir: "asc" | "desc" }]
    sort: jsonb("sort").default([]).notNull(),
    layout: text("layout", { enum: ["table", "cards"] })
      .default("table")
      .notNull(),
    density: text("density", { enum: ["comfortable", "compact"] })
      .default("comfortable")
      .notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("crm_view_user_idx").on(t.userId, t.entity, t.position)],
);

// ─── Relations ────────────────────────────────────────────────────────

export const bookingRelations = relations(booking, ({ one }) => ({
  contact: one(contact, {
    fields: [booking.contactId],
    references: [contact.id],
  }),
}));

export const crmViewRelations = relations(crmView, ({ one }) => ({
  user: one(user, { fields: [crmView.userId], references: [user.id] }),
}));
