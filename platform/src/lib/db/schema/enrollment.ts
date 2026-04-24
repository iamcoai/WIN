import { pgTable, text, integer, boolean, timestamp, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

export const product = pgTable("product", {
  id: text("id").primaryKey(),
  externalId: text("external_id").unique(),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents"),
  currency: text("currency").default("EUR").notNull(),
  trajectId: text("traject_id"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enrollment = pgTable(
  "enrollment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => product.id, { onDelete: "set null" }),
    externalId: text("external_id"),
    source: text("source").default("plugandpay").notNull(),
    status: text("status", {
      enum: ["active", "cancelled", "ended", "paused", "pending"],
    })
      .default("active")
      .notNull(),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    endedAt: timestamp("ended_at"),
    metadata: jsonb("metadata").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("enrollment_user_idx").on(t.userId),
    index("enrollment_status_idx").on(t.status),
    uniqueIndex("enrollment_external_idx").on(t.source, t.externalId),
  ],
);

export const webhookEvent = pgTable(
  "webhook_event",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    eventType: text("event_type").notNull(),
    externalId: text("external_id"),
    payload: jsonb("payload").notNull(),
    processedAt: timestamp("processed_at"),
    error: text("error"),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
  },
  (t) => [
    index("webhook_event_source_idx").on(t.source, t.eventType),
    index("webhook_event_processed_idx").on(t.processedAt),
  ],
);

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  user: one(user, { fields: [enrollment.userId], references: [user.id] }),
  product: one(product, { fields: [enrollment.productId], references: [product.id] }),
}));

export const productRelations = relations(product, ({ many }) => ({
  enrollments: many(enrollment),
}));
