import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const funnels = pgTable("funnels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  productType: text("product_type").notNull(), // digital, physical, service, ai-decide
  currentStep: integer("current_step").default(0),
  isCompleted: boolean("is_completed").default(false),
  stepData: jsonb("step_data").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiGenerations = pgTable("ai_generations", {
  id: serial("id").primaryKey(),
  funnelId: integer("funnel_id").notNull(),
  step: integer("step").notNull(),
  aiProvider: text("ai_provider").notNull(), // openai, anthropic, google
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFunnel = z.infer<typeof insertFunnelSchema>;
export type Funnel = typeof funnels.$inferSelect;
export type InsertAIGeneration = z.infer<typeof insertAIGenerationSchema>;
export type AIGeneration = typeof aiGenerations.$inferSelect;
