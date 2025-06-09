import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

// Enhanced users table for authentication and subscriptions
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username").unique(),
  password: text("password"),
  plan: text("plan").default("free"), // free, starter, pro, enterprise
  subscriptionStatus: text("subscription_status").default("inactive"), // active, inactive, canceled
  subscriptionId: text("subscription_id"),
  customerId: text("customer_id"),
  planLimits: jsonb("plan_limits").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const funnels = pgTable("funnels", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  title: text("title"),
  description: text("description"),
  productType: text("product_type").notNull(), // digital, physical, service, ai-decide
  targetAudience: text("target_audience"),
  currentStep: integer("current_step").default(0),
  isCompleted: boolean("is_completed").default(false),
  stepData: jsonb("step_data").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiGenerations = pgTable("ai_generations", {
  id: serial("id").primaryKey(),
  funnelId: integer("funnel_id").notNull(),
  stepNumber: integer("step_number").notNull(),
  provider: text("provider").notNull(), // openai, anthropic, google
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  tokensUsed: integer("tokens_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// New tables for tools and analytics
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // funnel, spy, traffic, etc
  planRequired: text("plan_required").default("free"),
  isActive: boolean("is_active").default(true),
});

export const userAnalytics = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  toolUsed: text("tool_used").notNull(),
  action: text("action").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema validations
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertFunnelSchema = createInsertSchema(funnels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAIGenerationSchema = createInsertSchema(aiGenerations).omit({
  id: true,
  createdAt: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
});

export const insertAnalyticsSchema = createInsertSchema(userAnalytics).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFunnel = z.infer<typeof insertFunnelSchema>;
export type Funnel = typeof funnels.$inferSelect;
export type InsertAIGeneration = z.infer<typeof insertAIGenerationSchema>;
export type AIGeneration = typeof aiGenerations.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type UserAnalytics = typeof userAnalytics.$inferSelect;
