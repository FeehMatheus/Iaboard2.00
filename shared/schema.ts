import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  boolean, 
  jsonb,
  serial 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Usuários da plataforma
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  password: varchar("password").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  plan: varchar("plan").default("starter"), // starter, professional, enterprise
  subscriptionStatus: varchar("subscription_status").default("trial"),
  subscriptionData: jsonb("subscription_data"),
  furionCredits: integer("furion_credits").default(1000), // Créditos para usar Furion
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projetos criados pelos usuários
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // produto, servico, infoproduto, curso
  phase: integer("phase").default(1), // Fase atual do método (1-5)
  status: varchar("status").default("active"), // active, completed, archived
  data: jsonb("data"), // Dados específicos do projeto
  furionResults: jsonb("furion_results"), // Resultados gerados pelo Furion
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interações com Furion.AI
export const furionSessions = pgTable("furion_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  type: varchar("type").notNull(), // produto, copy, anuncio, funil, estrategia
  prompt: text("prompt").notNull(),
  response: jsonb("response").notNull(),
  metadata: jsonb("metadata"), // Dados adicionais da sessão
  creditsUsed: integer("credits_used").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Campanhas de marketing criadas
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // meta_ads, google_ads, email, organic
  platform: varchar("platform"), // facebook, instagram, google, etc
  budget: varchar("budget"),
  status: varchar("status").default("draft"), // draft, active, paused, completed
  data: jsonb("data"), // Dados específicos da campanha
  results: jsonb("results"), // Resultados e métricas
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics e métricas
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  event: varchar("event").notNull(), // view, click, conversion, sale
  data: jsonb("data"),
  value: varchar("value"), // Valor monetário se aplicável
  createdAt: timestamp("created_at").defaultNow(),
});

// Pagamentos e assinaturas
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: varchar("amount").notNull(),
  currency: varchar("currency").default("BRL"),
  status: varchar("status").notNull(), // pending, completed, failed, refunded
  method: varchar("method"), // pix, card, boleto
  planType: varchar("plan_type"), // basic, pro, premium
  installments: integer("installments").default(1),
  stripeSessionId: varchar("stripe_session_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sessões para autenticação
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Schemas de inserção e tipos
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFurionSessionSchema = createInsertSchema(furionSessions).omit({
  id: true,
  createdAt: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type FurionSession = typeof furionSessions.$inferSelect;
export type InsertFurionSession = z.infer<typeof insertFurionSessionSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;