import {
  pgTable,
  text,
  integer,
  boolean,
  bigint,
  timestamp,
  jsonb,
  date,
  index,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { contact, deal, workshop, activity } from "./crm";

// ─── Calendar accounts ────────────────────────────────────────────────

export const calendarAccount = pgTable(
  "calendar_account",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: text("provider", {
      enum: ["google", "outlook", "apple", "caldav"],
    }).notNull(),
    externalId: text("external_id").notNull(),
    email: text("email"),
    displayName: text("display_name"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at"),
    syncToken: text("sync_token"),
    syncEnabled: boolean("sync_enabled").default(true).notNull(),
    lastSyncedAt: timestamp("last_synced_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.userId, t.provider, t.externalId),
    index("calendar_account_user_idx").on(t.userId),
  ],
);

export const externalEvent = pgTable(
  "external_event",
  {
    id: text("id").primaryKey(),
    calendarAccountId: text("calendar_account_id")
      .notNull()
      .references(() => calendarAccount.id, { onDelete: "cascade" }),
    externalId: text("external_id").notNull(),
    title: text("title"),
    description: text("description"),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    allDay: boolean("all_day").default(false).notNull(),
    location: text("location"),
    htmlLink: text("html_link"),
    status: text("status"),
    syncedAt: timestamp("synced_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.calendarAccountId, t.externalId),
    index("external_event_starts_idx").on(t.startsAt),
    index("external_event_account_idx").on(t.calendarAccountId, t.startsAt),
  ],
);

// ─── Documents ────────────────────────────────────────────────────────

export const document = pgTable(
  "document",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    filePath: text("file_path").notNull(),
    mimeType: text("mime_type"),
    sizeBytes: bigint("size_bytes", { mode: "number" }),
    uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
    contactId: text("contact_id").references(() => contact.id, { onDelete: "cascade" }),
    dealId: text("deal_id").references(() => deal.id, { onDelete: "cascade" }),
    workshopId: text("workshop_id").references(() => workshop.id, { onDelete: "cascade" }),
    activityId: text("activity_id").references(() => activity.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("document_contact_idx").on(t.contactId),
    index("document_deal_idx").on(t.dealId),
    index("document_workshop_idx").on(t.workshopId),
  ],
);

// ─── Journal ──────────────────────────────────────────────────────────

export const journalEntry = pgTable(
  "journal_entry",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: date("date").defaultNow().notNull(),
    prompt: text("prompt"),
    content: text("content").notNull(),
    mood: integer("mood"),
    tags: text("tags").array().default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("journal_user_date_idx").on(t.userId, t.date)],
);

// ─── User settings ────────────────────────────────────────────────────

export const userSetting = pgTable(
  "user_setting",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
);

// Relations
export const calendarAccountRelations = relations(calendarAccount, ({ many }) => ({
  events: many(externalEvent),
}));

export const externalEventRelations = relations(externalEvent, ({ one }) => ({
  account: one(calendarAccount, {
    fields: [externalEvent.calendarAccountId],
    references: [calendarAccount.id],
  }),
}));
