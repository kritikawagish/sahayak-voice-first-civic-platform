import {
  pgTable,
  serial,
  varchar,
  text,
  jsonb,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "under_review",
  "approved",
  "rejected",
  "escalated",
]);

export const complaintStatusEnum = pgEnum("complaint_status", [
  "open",
  "in_progress",
  "resolved",
  "escalated",
]);

export const complaintCategoryEnum = pgEnum("complaint_category", [
  "road",
  "water",
  "ration",
  "electricity",
  "sanitation",
  "other",
]);

export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  nameHi: varchar("name_hi", { length: 200 }),
  description: text("description").notNull(),
  eligibility: jsonb("eligibility").notNull().$type<string[]>(),
  requiredDocs: jsonb("required_docs").notNull().$type<string[]>(),
  benefits: text("benefits"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  referenceNumber: varchar("reference_number", { length: 32 }).notNull().unique(),
  schemeId: integer("scheme_id").references(() => schemes.id),
  citizenName: varchar("citizen_name", { length: 200 }),
  phone: varchar("phone", { length: 20 }),
  language: varchar("language", { length: 10 }).default("en"),
  extractedData: jsonb("extracted_data").$type<Record<string, string>>(),
  missingDocs: jsonb("missing_docs").$type<string[]>(),
  status: applicationStatusEnum("status").default("pending"),
  confidence: integer("confidence"),
  submittedAt: timestamp("submitted_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  referenceNumber: varchar("reference_number", { length: 32 }).notNull().unique(),
  category: complaintCategoryEnum("category").notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 200 }),
  citizenPhone: varchar("citizen_phone", { length: 20 }),
  status: complaintStatusEnum("status").default("open"),
  priority: integer("priority").default(1),
  slaHours: integer("sla_hours").default(72),
  openedAt: timestamp("opened_at", { mode: "date" }).defaultNow(),
  escalatedAt: timestamp("escalated_at", { mode: "date" }),
  rtiDraft: text("rti_draft"),
  officialId: integer("official_id"),
});

export const officials = pgTable("officials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  jurisdiction: varchar("jurisdiction", { length: 200 }),
  active: boolean("active").default(true),
  workloadScore: integer("workload_score").default(0),
  decisionNotes: jsonb("decision_notes").$type<string[]>(),
});

export const proxyRatings = pgTable("proxy_ratings", {
  id: serial("id").primaryKey(),
  sessionType: varchar("session_type", { length: 40 }).notNull(),
  proxyName: varchar("proxy_name", { length: 200 }),
  citizenPhone: varchar("citizen_phone", { length: 20 }),
  rating: integer("rating").notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export type Scheme = typeof schemes.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Complaint = typeof complaints.$inferSelect;
export type Official = typeof officials.$inferSelect;
export type ProxyRating = typeof proxyRatings.$inferSelect;
