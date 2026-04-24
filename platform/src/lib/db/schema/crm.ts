import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { project, task } from "./core";

// ─── Pipelines ────────────────────────────────────────────────────────

export const pipeline = pgTable("pipeline", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false).notNull(),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pipelineStage = pgTable(
  "pipeline_stage",
  {
    id: text("id").primaryKey(),
    pipelineId: text("pipeline_id")
      .notNull()
      .references(() => pipeline.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").default("neutral").notNull(),
    position: integer("position").default(0).notNull(),
    probability: integer("probability"),
    isWon: boolean("is_won").default(false).notNull(),
    isLost: boolean("is_lost").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("pipeline_stage_pipeline_idx").on(t.pipelineId, t.position)],
);

// ─── Tags ─────────────────────────────────────────────────────────────

export const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").default("neutral").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Contacts ─────────────────────────────────────────────────────────

export const contact = pgTable(
  "contact",
  {
    id: text("id").primaryKey(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    jobTitle: text("job_title"),
    avatarUrl: text("avatar_url"),
    source: text("source"),
    lifecycle: text("lifecycle", {
      enum: ["lead", "prospect", "customer", "archived"],
    })
      .default("lead")
      .notNull(),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    notes: text("notes"),
    customFields: jsonb("custom_fields").default({}).notNull(),
    lastContactedAt: timestamp("last_contacted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("contact_owner_idx").on(t.ownerId),
    index("contact_lifecycle_idx").on(t.lifecycle),
    index("contact_email_idx").on(t.email),
  ],
);

export const contactTag = pgTable(
  "contact_tag",
  {
    contactId: text("contact_id")
      .notNull()
      .references(() => contact.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.contactId, t.tagId] })],
);

// ─── Deals ────────────────────────────────────────────────────────────

export const deal = pgTable(
  "deal",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    contactId: text("contact_id").references(() => contact.id, { onDelete: "set null" }),
    pipelineId: text("pipeline_id")
      .notNull()
      .references(() => pipeline.id, { onDelete: "restrict" }),
    stageId: text("stage_id")
      .notNull()
      .references(() => pipelineStage.id, { onDelete: "restrict" }),
    amountCents: integer("amount_cents"),
    currency: text("currency").default("EUR").notNull(),
    probability: integer("probability"),
    status: text("status", { enum: ["open", "won", "lost", "archived"] })
      .default("open")
      .notNull(),
    expectedCloseAt: timestamp("expected_close_at"),
    closedAt: timestamp("closed_at"),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
    projectId: text("project_id").references(() => project.id, { onDelete: "set null" }),
    workshopId: text("workshop_id"),
    position: integer("position").default(0).notNull(),
    notes: text("notes"),
    customFields: jsonb("custom_fields").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("deal_pipeline_stage_idx").on(t.pipelineId, t.stageId, t.position),
    index("deal_contact_idx").on(t.contactId),
    index("deal_status_idx").on(t.status),
  ],
);

export const dealTag = pgTable(
  "deal_tag",
  {
    dealId: text("deal_id")
      .notNull()
      .references(() => deal.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.dealId, t.tagId] })],
);

// ─── Activities ───────────────────────────────────────────────────────

export const activity = pgTable(
  "activity",
  {
    id: text("id").primaryKey(),
    type: text("type", {
      enum: ["note", "call", "meeting", "email", "task", "stage_change", "custom"],
    }).notNull(),
    title: text("title"),
    content: text("content"),
    contactId: text("contact_id").references(() => contact.id, { onDelete: "cascade" }),
    dealId: text("deal_id").references(() => deal.id, { onDelete: "cascade" }),
    workshopId: text("workshop_id"),
    authorId: text("author_id").references(() => user.id, { onDelete: "set null" }),
    occurredAt: timestamp("occurred_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("activity_contact_idx").on(t.contactId, t.occurredAt),
    index("activity_deal_idx").on(t.dealId, t.occurredAt),
  ],
);

// ─── Workshops ────────────────────────────────────────────────────────

export const workshop = pgTable(
  "workshop",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    type: text("type", {
      enum: ["workshop", "lezing", "training", "masterclass", "retreat"],
    })
      .default("workshop")
      .notNull(),
    status: text("status", {
      enum: ["planned", "open", "closed", "cancelled", "completed"],
    })
      .default("planned")
      .notNull(),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    location: text("location"),
    capacity: integer("capacity"),
    priceCents: integer("price_cents"),
    currency: text("currency").default("EUR").notNull(),
    ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
    projectId: text("project_id").references(() => project.id, { onDelete: "set null" }),
    customFields: jsonb("custom_fields").default({}).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("workshop_starts_idx").on(t.startsAt),
    index("workshop_status_idx").on(t.status),
  ],
);

export const workshopAttendee = pgTable(
  "workshop_attendee",
  {
    id: text("id").primaryKey(),
    workshopId: text("workshop_id")
      .notNull()
      .references(() => workshop.id, { onDelete: "cascade" }),
    contactId: text("contact_id")
      .notNull()
      .references(() => contact.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["registered", "confirmed", "attended", "no_show", "cancelled"],
    })
      .default("registered")
      .notNull(),
    notes: text("notes"),
    registeredAt: timestamp("registered_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.workshopId, t.contactId),
    index("workshop_attendee_workshop_idx").on(t.workshopId),
  ],
);

export const workshopTag = pgTable(
  "workshop_tag",
  {
    workshopId: text("workshop_id")
      .notNull()
      .references(() => workshop.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.workshopId, t.tagId] })],
);

// ─── Custom field definitions ────────────────────────────────────────

export const customField = pgTable(
  "custom_field",
  {
    id: text("id").primaryKey(),
    entity: text("entity", { enum: ["contact", "deal", "workshop"] }).notNull(),
    key: text("key").notNull(),
    label: text("label").notNull(),
    fieldType: text("field_type", {
      enum: ["text", "textarea", "number", "date", "select", "multi_select", "boolean", "url", "email"],
    }).notNull(),
    options: jsonb("options").default([]).notNull(),
    required: boolean("required").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.entity, t.key),
    index("custom_field_entity_idx").on(t.entity, t.position),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────

export const pipelineRelations = relations(pipeline, ({ many }) => ({
  stages: many(pipelineStage),
  deals: many(deal),
}));

export const stageRelations = relations(pipelineStage, ({ one, many }) => ({
  pipeline: one(pipeline, { fields: [pipelineStage.pipelineId], references: [pipeline.id] }),
  deals: many(deal),
}));

export const contactRelations = relations(contact, ({ many, one }) => ({
  deals: many(deal),
  activities: many(activity),
  tags: many(contactTag),
  owner: one(user, { fields: [contact.ownerId], references: [user.id] }),
}));

export const dealRelations = relations(deal, ({ one, many }) => ({
  contact: one(contact, { fields: [deal.contactId], references: [contact.id] }),
  stage: one(pipelineStage, { fields: [deal.stageId], references: [pipelineStage.id] }),
  pipeline: one(pipeline, { fields: [deal.pipelineId], references: [pipeline.id] }),
  owner: one(user, { fields: [deal.ownerId], references: [user.id] }),
  project: one(project, { fields: [deal.projectId], references: [project.id] }),
  activities: many(activity),
  tags: many(dealTag),
  tasks: many(task),
}));

export const workshopRelations = relations(workshop, ({ many, one }) => ({
  attendees: many(workshopAttendee),
  tags: many(workshopTag),
  owner: one(user, { fields: [workshop.ownerId], references: [user.id] }),
  project: one(project, { fields: [workshop.projectId], references: [project.id] }),
}));
