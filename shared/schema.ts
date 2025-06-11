import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  plan: varchar("plan"),
  subscriptionStatus: varchar("subscription_status"),
  subscriptionData: jsonb("subscription_data"),
  furionCredits: integer("furion_credits").default(100),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(),
  status: varchar("status").default("pending"),
  progress: integer("progress").default(0),
  content: jsonb("content"),
  position: jsonb("position").default({ x: 0, y: 0 }),
  size: jsonb("size").default({ width: 300, height: 200 }),
  zIndex: integer("z_index").default(1),
  isExpanded: boolean("is_expanded").default(false),
  connections: jsonb("connections").default([]),
  links: jsonb("links").default([]),
  videoUrl: varchar("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Generations table
export const aiGenerations = pgTable("ai_generations", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: varchar("type").notNull(),
  prompt: text("prompt").notNull(),
  response: jsonb("response").notNull(),
  metadata: jsonb("metadata").default({}),
  projectId: varchar("project_id"),
  creditsUsed: integer("credits_used").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  projectId: varchar("project_id").notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  status: varchar("status").default("draft"),
  platform: varchar("platform"),
  budget: varchar("budget"),
  data: jsonb("data").default({}),
  results: jsonb("results").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics table
export const analytics = pgTable("analytics", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  projectId: integer("project_id"),
  campaignId: integer("campaign_id"),
  event: varchar("event").notNull(),
  data: jsonb("data").default({}),
  value: varchar("value"),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  amount: varchar("amount").notNull(),
  currency: varchar("currency").default("BRL"),
  status: varchar("status").notNull(),
  method: varchar("method"),
  planType: varchar("plan_type"),
  installments: integer("installments"),
  stripeSessionId: varchar("stripe_session_id"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type AIGeneration = typeof aiGenerations.$inferSelect;
export type InsertAIGeneration = typeof aiGenerations.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

export const insertAIGenerationSchema = createInsertSchema(aiGenerations);
export const selectAIGenerationSchema = createSelectSchema(aiGenerations);

export const insertCampaignSchema = createInsertSchema(campaigns);
export const selectCampaignSchema = createSelectSchema(campaigns);

export const insertAnalyticsSchema = createInsertSchema(analytics);
export const selectAnalyticsSchema = createSelectSchema(analytics);

export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);