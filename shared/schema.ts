import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  boolean, 
  jsonb
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

// Projetos criados pelos usuários no canvas
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // copy, vsl, funnel, ads, email, landing, analysis, strategy
  status: varchar("status").default("draft"), // processing, completed, failed, draft
  progress: integer("progress").default(0),
  position: jsonb("position").notNull(), // { x: number, y: number }
  size: jsonb("size").notNull(), // { width: number, height: number }
  content: jsonb("content"), // Generated content
  videoUrl: varchar("video_url"), // Associated video URL
  links: jsonb("links"), // Array of CTA links
  connections: jsonb("connections"), // Connected project IDs
  zIndex: integer("z_index").default(1),
  isExpanded: boolean("is_expanded").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interações com Furion.AI
export const furionSessions = pgTable("furion_sessions", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: varchar("project_id").references(() => projects.id),
  type: varchar("type").notNull(), // produto, copy, anuncio, funil, estrategia
  prompt: text("prompt").notNull(),
  response: jsonb("response").notNull(),
  metadata: jsonb("metadata"), // Dados adicionais da sessão
  creditsUsed: integer("credits_used").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Campanhas de marketing criadas
export const campaigns = pgTable("campaigns", {
  id: integer("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: varchar("project_id").references(() => projects.id).notNull(),
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

// Funis completos do sistema infinite board
export const funnels = pgTable("funnels", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  templateId: varchar("template_id"),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // acquisition, conversion, retention, monetization
  status: varchar("status").default("draft"), // draft, active, paused, completed, archived
  nodes: jsonb("nodes").default([]), // Array of node IDs
  connections: jsonb("connections").default([]), // Node connections
  metrics: jsonb("metrics").default({}), // Overall funnel metrics
  settings: jsonb("settings").default({}), // Funnel configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Nodes individuais dos funis (landing pages, VSLs, etc.)
export const funnelNodes = pgTable("funnel_nodes", {
  id: varchar("id").primaryKey(),
  funnelId: varchar("funnel_id").references(() => funnels.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // landing, vsl, checkout, upsell, email, traffic, analytics, api
  category: varchar("category").notNull(), // acquisition, conversion, retention, monetization
  status: varchar("status").default("draft"), // draft, active, processing, completed, paused, error
  position: jsonb("position").notNull(), // { x: number, y: number }
  size: jsonb("size").notNull(), // { width: number, height: number }
  connections: jsonb("connections").default([]), // Connected node IDs
  content: jsonb("content").default({}), // Node configuration and generated content
  metrics: jsonb("metrics").default({}), // Node-specific metrics
  assets: jsonb("assets").default({}), // Images, videos, scripts
  metadata: jsonb("metadata").default({}), // Tags, priority, version, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics avançado para funis
export const funnelAnalytics = pgTable("funnel_analytics", {
  id: serial("id").primaryKey(),
  funnelId: varchar("funnel_id").references(() => funnels.id),
  nodeId: varchar("node_id").references(() => funnelNodes.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  event: varchar("event").notNull(), // view, click, conversion, purchase, exit
  sessionId: varchar("session_id"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  data: jsonb("data").default({}), // Event-specific data
  value: varchar("value"), // Monetary value if applicable
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Testes A/B para componentes dos funis
export const abTests = pgTable("ab_tests", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  nodeId: varchar("node_id").references(() => funnelNodes.id),
  name: varchar("name").notNull(),
  testType: varchar("test_type").notNull(), // headline, cta, layout, color, copy
  status: varchar("status").default("draft"), // draft, active, paused, completed
  variants: jsonb("variants").notNull(), // Test variants with content and metrics
  settings: jsonb("settings").default({}), // Traffic split, duration, confidence level
  results: jsonb("results").default({}), // Test results and winner
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Estados do canvas infinito
export const canvasStates = pgTable("canvas_states", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").default("Workspace"),
  viewport: jsonb("viewport").default({}), // Zoom, pan, viewport settings
  selectedNodes: jsonb("selected_nodes").default([]),
  gridSettings: jsonb("grid_settings").default({}),
  minimapSettings: jsonb("minimap_settings").default({}),
  boardSettings: jsonb("board_settings").default({}),
  lastSaved: timestamp("last_saved").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const insertFunnelSchema = createInsertSchema(funnels).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertFunnelNodeSchema = createInsertSchema(funnelNodes).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertFunnelAnalyticsSchema = createInsertSchema(funnelAnalytics).omit({
  id: true,
  timestamp: true,
  createdAt: true,
});

export const insertABTestSchema = createInsertSchema(abTests).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCanvasStateSchema = createInsertSchema(canvasStates).omit({
  id: true,
  lastSaved: true,
  createdAt: true,
  updatedAt: true,
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

export type Funnel = typeof funnels.$inferSelect;
export type InsertFunnel = z.infer<typeof insertFunnelSchema>;

export type FunnelNode = typeof funnelNodes.$inferSelect;
export type InsertFunnelNode = z.infer<typeof insertFunnelNodeSchema>;

export type FunnelAnalytics = typeof funnelAnalytics.$inferSelect;
export type InsertFunnelAnalytics = z.infer<typeof insertFunnelAnalyticsSchema>;

export type ABTest = typeof abTests.$inferSelect;
export type InsertABTest = z.infer<typeof insertABTestSchema>;

export type CanvasState = typeof canvasStates.$inferSelect;
export type InsertCanvasState = z.infer<typeof insertCanvasStateSchema>;