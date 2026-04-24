import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  index,
  uniqueIndex,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { product } from "./enrollment";

// ─── Trajecten + modules ────────────────────────────────────────────────

export const traject = pgTable(
  "traject",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    coachId: text("coach_id").references(() => user.id, { onDelete: "set null" }),
    productId: text("product_id").references(() => product.id, { onDelete: "set null" }),
    status: text("status", { enum: ["draft", "published", "archived"] })
      .default("draft")
      .notNull(),
    coverImage: text("cover_image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("traject_coach_idx").on(t.coachId)],
);

export const trajectModule = pgTable(
  "traject_module",
  {
    id: text("id").primaryKey(),
    trajectId: text("traject_id")
      .notNull()
      .references(() => traject.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    content: text("content"),
    position: integer("position").default(0).notNull(),
    durationDays: integer("duration_days"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("module_traject_idx").on(t.trajectId, t.position)],
);

export const userTraject = pgTable(
  "user_traject",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    trajectId: text("traject_id")
      .notNull()
      .references(() => traject.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["active", "completed", "paused"] })
      .default("active")
      .notNull(),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    progress: integer("progress").default(0).notNull(),
  },
  (t) => [
    unique().on(t.userId, t.trajectId),
    index("user_traject_user_idx").on(t.userId),
  ],
);

// ─── Opdrachten ────────────────────────────────────────────────────────

export const opdracht = pgTable(
  "opdracht",
  {
    id: text("id").primaryKey(),
    moduleId: text("module_id").references(() => trajectModule.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    type: text("type", { enum: ["reflection", "checkbox", "upload", "form"] })
      .default("reflection")
      .notNull(),
    dueOffsetDays: integer("due_offset_days"),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("opdracht_module_idx").on(t.moduleId, t.position)],
);

export const opdrachtResponse = pgTable(
  "opdracht_response",
  {
    id: text("id").primaryKey(),
    opdrachtId: text("opdracht_id")
      .notNull()
      .references(() => opdracht.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: jsonb("content").default({}).notNull(),
    status: text("status", { enum: ["pending", "submitted", "approved", "rejected"] })
      .default("pending")
      .notNull(),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.opdrachtId, t.userId),
    index("opdracht_response_user_idx").on(t.userId),
  ],
);

// ─── Habits ───────────────────────────────────────────────────────────

export const habit = pgTable(
  "habit",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    frequency: text("frequency", { enum: ["daily", "weekdays", "weekly"] })
      .default("daily")
      .notNull(),
    targetCount: integer("target_count").default(1).notNull(),
    archived: boolean("archived").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("habit_user_idx").on(t.userId)],
);

export const habitLog = pgTable(
  "habit_log",
  {
    id: text("id").primaryKey(),
    habitId: text("habit_id")
      .notNull()
      .references(() => habit.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    completed: boolean("completed").default(true).notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.habitId, t.date),
    index("habit_log_user_date_idx").on(t.userId, t.date),
  ],
);

// ─── Chat ─────────────────────────────────────────────────────────────

export const chatThread = pgTable(
  "chat_thread",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    coachId: text("coach_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.clientId, t.coachId),
    index("chat_thread_coach_idx").on(t.coachId),
  ],
);

export const chatMessage = pgTable(
  "chat_message",
  {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => chatThread.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("chat_message_thread_idx").on(t.threadId, t.createdAt)],
);

// ─── Afspraken ────────────────────────────────────────────────────────

export const afspraak = pgTable(
  "afspraak",
  {
    id: text("id").primaryKey(),
    clientId: text("client_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    coachId: text("coach_id").references(() => user.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    startAt: timestamp("start_at").notNull(),
    endAt: timestamp("end_at").notNull(),
    status: text("status", { enum: ["scheduled", "completed", "cancelled", "no_show"] })
      .default("scheduled")
      .notNull(),
    location: text("location"),
    meetingUrl: text("meeting_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("afspraak_client_idx").on(t.clientId, t.startAt),
    index("afspraak_coach_idx").on(t.coachId, t.startAt),
  ],
);

// ─── Forms ────────────────────────────────────────────────────────────

export const form = pgTable("form", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fields: jsonb("fields").default([]).notNull(),
  targetRole: text("target_role", { enum: ["client", "coach", "any"] })
    .default("client")
    .notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const formResponse = pgTable(
  "form_response",
  {
    id: text("id").primaryKey(),
    formId: text("form_id")
      .notNull()
      .references(() => form.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    answers: jsonb("answers").default({}).notNull(),
    submittedAt: timestamp("submitted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("form_response_user_idx").on(t.userId)],
);

// ─── CRM + admin ──────────────────────────────────────────────────────

export const userSessionEvent = pgTable(
  "user_session_event",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["login", "logout"] }).notNull(),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("user_session_event_user_idx").on(t.userId, t.createdAt)],
);

export const lead = pgTable(
  "lead",
  {
    id: text("id").primaryKey(),
    email: text("email"),
    name: text("name"),
    phone: text("phone"),
    source: text("source"),
    status: text("status", {
      enum: ["new", "contacted", "qualified", "won", "lost"],
    })
      .default("new")
      .notNull(),
    notes: text("notes"),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    assignedTo: text("assigned_to").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("lead_status_idx").on(t.status)],
);

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["active", "archived", "completed"] })
    .default("active")
    .notNull(),
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id").references(() => project.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    column: text("column", { enum: ["todo", "doing", "review", "done"] })
      .default("todo")
      .notNull(),
    position: integer("position").default(0).notNull(),
    assigneeId: text("assignee_id").references(() => user.id, { onDelete: "set null" }),
    dueAt: timestamp("due_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("task_project_col_idx").on(t.projectId, t.column, t.position)],
);

// Relations
export const trajectRelations = relations(traject, ({ many, one }) => ({
  modules: many(trajectModule),
  coach: one(user, { fields: [traject.coachId], references: [user.id] }),
}));

export const moduleRelations = relations(trajectModule, ({ one, many }) => ({
  traject: one(traject, { fields: [trajectModule.trajectId], references: [traject.id] }),
  opdrachten: many(opdracht),
}));

export const opdrachtRelations = relations(opdracht, ({ one, many }) => ({
  module: one(trajectModule, { fields: [opdracht.moduleId], references: [trajectModule.id] }),
  responses: many(opdrachtResponse),
}));
