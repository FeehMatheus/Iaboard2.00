import {
  users,
  projects,
  funnels,
  funnelNodes,
  funnelAnalytics,
  abTests,
  canvasStates,
  furionSessions,
  campaigns,
  analytics,
  payments,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Funnel,
  type InsertFunnel,
  type FunnelNode,
  type InsertFunnelNode,
  type FunnelAnalytics,
  type InsertFunnelAnalytics,
  type ABTest,
  type InsertABTest,
  type CanvasState,
  type InsertCanvasState,
  type FurionSession,
  type InsertFurionSession,
  type Campaign,
  type InsertCampaign,
  type Analytics,
  type InsertAnalytics,
  type Payment,
  type InsertPayment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface completa para todas as operações do sistema
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    plan?: string;
    subscriptionStatus?: string;
    furionCredits?: number;
  }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(id: string, credits: number): Promise<User>;
  
  // Project operations (Canvas)
  createProject(project: any): Promise<any>;
  getProject(id: string): Promise<any | undefined>;
  getProjectsByUser(userId: string): Promise<any[]>;
  getUserProjects(userId: string): Promise<Project[]>;
  updateProject(id: string, data: Partial<any>): Promise<any>;
  deleteProject(id: string): Promise<void>;
  
  // Funnel operations (Infinite Board)
  getUserFunnels(userId: string): Promise<FunnelNode[]>;
  createFunnel(funnel: InsertFunnel): Promise<Funnel>;
  getFunnel(id: string): Promise<Funnel | undefined>;
  updateFunnel(id: string, data: Partial<Funnel>): Promise<Funnel>;
  deleteFunnel(id: string): Promise<void>;
  
  // Funnel Node operations
  createFunnelNode(node: InsertFunnelNode): Promise<FunnelNode>;
  getFunnelNode(id: string): Promise<FunnelNode | undefined>;
  updateFunnelNode(id: string, data: Partial<FunnelNode>): Promise<FunnelNode>;
  deleteFunnelNode(id: string): Promise<void>;
  getFunnelNodesByFunnel(funnelId: string): Promise<FunnelNode[]>;
  
  // Funnel Analytics
  createFunnelAnalytics(analytics: InsertFunnelAnalytics): Promise<FunnelAnalytics>;
  getFunnelAnalytics(nodeId: string, timeframe: string): Promise<any>;
  getFunnelMetrics(funnelId: string): Promise<any>;
  
  // A/B Testing
  createABTest(test: InsertABTest): Promise<ABTest>;
  getABTest(id: string): Promise<ABTest | undefined>;
  updateABTest(id: string, data: Partial<ABTest>): Promise<ABTest>;
  getActiveABTests(userId: string): Promise<ABTest[]>;
  
  // Canvas state management
  saveCanvasState(userId: string, canvasData: any): Promise<void>;
  getCanvasState(userId: string): Promise<any | null>;
  
  // Furion operations
  createFurionSession(session: InsertFurionSession): Promise<FurionSession>;
  getUserFurionSessions(userId: string): Promise<FurionSession[]>;
  getProjectFurionSessions(projectId: number): Promise<FurionSession[]>;
  
  // Campaign operations
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getUserCampaigns(userId: string): Promise<Campaign[]>;
  getProjectCampaigns(projectId: number): Promise<Campaign[]>;
  updateCampaign(id: number, data: Partial<Campaign>): Promise<Campaign>;
  
  // Analytics operations
  logAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getUserAnalytics(userId: string): Promise<Analytics[]>;
  getProjectAnalytics(projectId: number): Promise<Analytics[]>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getUserPayments(userId: string): Promise<Payment[]>;
  updatePaymentStatus(id: number, status: string): Promise<Payment>;
}

// Implementação usando MemStorage para desenvolvimento
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private canvasProjects: Map<string, any> = new Map();
  private canvasStates: Map<string, any> = new Map();
  private furionSessions: Map<number, FurionSession> = new Map();
  private campaigns: Map<number, Campaign> = new Map();
  private analytics: Map<number, Analytics> = new Map();
  private payments: Map<number, Payment> = new Map();
  
  private currentProjectId = 1;
  private currentFurionId = 1;
  private currentCampaignId = 1;
  private currentAnalyticsId = 1;
  private currentPaymentId = 1;

  constructor() {
    this.initializeDemo();
  }

  private async initializeDemo() {
    // Criando usuários de teste
    const users = [
      {
        id: "demo-user",
        email: "demo@maquinamilionaria.com",
        firstName: "Usuário",
        lastName: "Demo",
        profileImageUrl: null,
        plan: "premium",
        subscriptionStatus: "active",
        subscriptionData: {
          planType: "premium",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
        furionCredits: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "test-user",
        email: "teste@email.com",
        firstName: "João",
        lastName: "Silva",
        profileImageUrl: null,
        plan: "pro",
        subscriptionStatus: "active",
        subscriptionData: {
          planType: "pro",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
        furionCredits: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    
    users.forEach(user => this.users.set(user.id, user));

    // Criando projeto demo
    const demoProject: Project = {
      id: 1,
      userId: "demo-user",
      name: "Meu Primeiro Produto Digital",
      type: "infoproduto",
      phase: 1,
      status: "active",
      data: {
        description: "Curso online sobre marketing digital",
        targetAudience: "Empreendedores iniciantes",
        priceRange: "R$ 197 - R$ 497",
      },
      furionResults: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.projects.set(1, demoProject);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: any): Promise<User> {
    const userId = Date.now().toString();
    const firstName = userData.name ? userData.name.split(' ')[0] : null;
    const lastName = userData.name ? userData.name.split(' ').slice(1).join(' ') : null;
    
    const newUser: User = {
      id: userId,
      email: userData.email,
      firstName: firstName,
      lastName: lastName,
      profileImageUrl: null,
      plan: userData.plan || "pro",
      subscriptionStatus: userData.subscriptionStatus || "active",
      subscriptionData: null,
      furionCredits: userData.furionCredits || 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(userId, newUser);
    return newUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      const newUser: User = {
        ...userData,
        plan: userData.plan || "free",
        subscriptionStatus: userData.subscriptionStatus || "inactive",
        subscriptionData: userData.subscriptionData || null,
        furionCredits: userData.furionCredits || 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }

  async updateUserCredits(id: string, credits: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser: User = {
      ...user,
      furionCredits: credits,
      updatedAt: new Date(),
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Project operations
  async createProject(projectData: InsertProject): Promise<Project> {
    const project: Project = {
      id: this.currentProjectId++,
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.projects.set(project.id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.userId === userId);
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject: Project = {
      ...project,
      ...data,
      updatedAt: new Date(),
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async updateProjectPhase(id: number, phase: number): Promise<Project> {
    return this.updateProject(id, { phase });
  }

  // Furion operations
  async createFurionSession(sessionData: InsertFurionSession): Promise<FurionSession> {
    const session: FurionSession = {
      id: this.currentFurionId++,
      ...sessionData,
      createdAt: new Date(),
    };
    
    this.furionSessions.set(session.id, session);
    return session;
  }

  async getUserFurionSessions(userId: string): Promise<FurionSession[]> {
    return Array.from(this.furionSessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getProjectFurionSessions(projectId: number): Promise<FurionSession[]> {
    return Array.from(this.furionSessions.values())
      .filter(s => s.projectId === projectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Campaign operations
  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const campaign: Campaign = {
      id: this.currentCampaignId++,
      ...campaignData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(c => c.userId === userId);
  }

  async getProjectCampaigns(projectId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(c => c.projectId === projectId);
  }

  async updateCampaign(id: number, data: Partial<Campaign>): Promise<Campaign> {
    const campaign = this.campaigns.get(id);
    if (!campaign) throw new Error("Campaign not found");
    
    const updatedCampaign: Campaign = {
      ...campaign,
      ...data,
      updatedAt: new Date(),
    };
    
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  // Analytics operations
  async logAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const analytics: Analytics = {
      id: this.currentAnalyticsId++,
      ...analyticsData,
      createdAt: new Date(),
    };
    
    this.analytics.set(analytics.id, analytics);
    return analytics;
  }

  async getUserAnalytics(userId: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(a => a.userId === userId);
  }

  async getProjectAnalytics(projectId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(a => a.projectId === projectId);
  }

  // Payment operations
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const payment: Payment = {
      id: this.currentPaymentId++,
      ...paymentData,
      createdAt: new Date(),
    };
    
    this.payments.set(payment.id, payment);
    return payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    const payment = this.payments.get(id);
    if (!payment) throw new Error("Payment not found");
    
    const updatedPayment: Payment = {
      ...payment,
      status,
    };
    
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  // Enhanced Canvas Project methods
  async createProject(projectData: any): Promise<any> {
    const project = {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.canvasProjects.set(project.id, project);
    return project;
  }

  async getProject(id: string): Promise<any | undefined> {
    return this.canvasProjects.get(id);
  }

  async getProjectsByUser(userId: string): Promise<any[]> {
    return Array.from(this.canvasProjects.values()).filter(p => p.userId === userId);
  }

  async updateProject(id: string, data: Partial<any>): Promise<any> {
    const project = this.canvasProjects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject = {
      ...project,
      ...data,
      updatedAt: new Date()
    };
    
    this.canvasProjects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    this.canvasProjects.delete(id);
  }

  // Canvas state management
  async saveCanvasState(userId: string, canvasData: any): Promise<void> {
    this.canvasStates.set(userId, canvasData);
  }

  async getCanvasState(userId: string): Promise<any | null> {
    return this.canvasStates.get(userId) || null;
  }

  // Funnel operations (Infinite Board)
  async getUserFunnels(userId: string): Promise<FunnelNode[]> {
    return Array.from(this.canvasProjects.values())
      .filter(p => p.userId === userId && p.type?.includes('funnel'))
      .map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        category: p.category || 'conversion',
        status: p.status || 'draft',
        position: p.position,
        size: p.size,
        connections: p.connections || [],
        content: {
          config: p.content || {},
          metrics: p.metrics || {},
          assets: p.assets || {}
        },
        metadata: {
          created: p.createdAt,
          updated: p.updatedAt,
          owner: userId,
          tags: p.tags || [],
          priority: 'medium',
          version: '1.0.0'
        }
      }));
  }

  async createFunnel(funnel: InsertFunnel): Promise<Funnel> {
    const newFunnel = {
      ...funnel,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.canvasProjects.set(funnel.id!, newFunnel);
    return newFunnel as Funnel;
  }

  async getFunnel(id: string): Promise<Funnel | undefined> {
    return this.canvasProjects.get(id) as Funnel;
  }

  async updateFunnel(id: string, data: Partial<Funnel>): Promise<Funnel> {
    const funnel = this.canvasProjects.get(id);
    if (!funnel) throw new Error("Funnel not found");
    
    const updatedFunnel = {
      ...funnel,
      ...data,
      updatedAt: new Date()
    };
    
    this.canvasProjects.set(id, updatedFunnel);
    return updatedFunnel as Funnel;
  }

  async deleteFunnel(id: string): Promise<void> {
    this.canvasProjects.delete(id);
  }

  // Funnel Node operations
  async createFunnelNode(node: InsertFunnelNode): Promise<FunnelNode> {
    const newNode = {
      ...node,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.canvasProjects.set(node.id!, newNode);
    return newNode as FunnelNode;
  }

  async getFunnelNode(id: string): Promise<FunnelNode | undefined> {
    return this.canvasProjects.get(id) as FunnelNode;
  }

  async updateFunnelNode(id: string, data: Partial<FunnelNode>): Promise<FunnelNode> {
    const node = this.canvasProjects.get(id);
    if (!node) throw new Error("Funnel node not found");
    
    const updatedNode = {
      ...node,
      ...data,
      updatedAt: new Date()
    };
    
    this.canvasProjects.set(id, updatedNode);
    return updatedNode as FunnelNode;
  }

  async deleteFunnelNode(id: string): Promise<void> {
    this.canvasProjects.delete(id);
  }

  async getFunnelNodesByFunnel(funnelId: string): Promise<FunnelNode[]> {
    return Array.from(this.canvasProjects.values())
      .filter(p => p.funnelId === funnelId)
      .map(p => p as FunnelNode);
  }

  // Funnel Analytics
  async createFunnelAnalytics(analytics: InsertFunnelAnalytics): Promise<FunnelAnalytics> {
    const newAnalytics = {
      ...analytics,
      id: Date.now(),
      timestamp: new Date(),
      createdAt: new Date()
    };
    // Store in analytics collection
    return newAnalytics as FunnelAnalytics;
  }

  async getFunnelAnalytics(nodeId: string, timeframe: string): Promise<any> {
    return {
      conversionRate: Math.random() * 15 + 5,
      revenue: Math.random() * 50000 + 10000,
      visitors: Math.floor(Math.random() * 1000 + 100),
      conversions: Math.floor(Math.random() * 100 + 10)
    };
  }

  async getFunnelMetrics(funnelId: string): Promise<any> {
    return {
      totalRevenue: Math.random() * 100000 + 50000,
      totalConversions: Math.floor(Math.random() * 500 + 100),
      avgCTR: Math.random() * 20 + 5
    };
  }

  // A/B Testing
  async createABTest(test: InsertABTest): Promise<ABTest> {
    const newTest = {
      ...test,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.canvasProjects.set(test.id!, newTest);
    return newTest as ABTest;
  }

  async getABTest(id: string): Promise<ABTest | undefined> {
    return this.canvasProjects.get(id) as ABTest;
  }

  async updateABTest(id: string, data: Partial<ABTest>): Promise<ABTest> {
    const test = this.canvasProjects.get(id);
    if (!test) throw new Error("A/B test not found");
    
    const updatedTest = {
      ...test,
      ...data,
      updatedAt: new Date()
    };
    
    this.canvasProjects.set(id, updatedTest);
    return updatedTest as ABTest;
  }

  async getActiveABTests(userId: string): Promise<ABTest[]> {
    return Array.from(this.canvasProjects.values())
      .filter(p => p.userId === userId && p.status === 'active')
      .map(p => p as ABTest);
  }
}

// DatabaseStorage implementation with PostgreSQL
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    plan?: string;
    subscriptionStatus?: string;
    furionCredits?: number;
  }): Promise<User> {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        plan: userData.plan || 'starter',
        subscriptionStatus: userData.subscriptionStatus || 'trial',
        furionCredits: userData.furionCredits || 1000,
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserCredits(id: string, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ furionCredits: credits, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Project operations (Canvas)
  async createProject(projectData: any): Promise<any> {
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  }

  async getProject(id: string): Promise<any | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectsByUser(userId: string): Promise<any[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async updateProject(id: string, data: Partial<any>): Promise<any> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Funnel operations (Infinite Board)
  async getUserFunnels(userId: string): Promise<FunnelNode[]> {
    return await db.select().from(funnelNodes).where(eq(funnelNodes.userId, userId));
  }

  async createFunnel(funnelData: InsertFunnel): Promise<Funnel> {
    const [funnel] = await db.insert(funnels).values(funnelData).returning();
    return funnel;
  }

  async getFunnel(id: string): Promise<Funnel | undefined> {
    const [funnel] = await db.select().from(funnels).where(eq(funnels.id, id));
    return funnel;
  }

  async updateFunnel(id: string, data: Partial<Funnel>): Promise<Funnel> {
    const [funnel] = await db
      .update(funnels)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(funnels.id, id))
      .returning();
    return funnel;
  }

  async deleteFunnel(id: string): Promise<void> {
    await db.delete(funnels).where(eq(funnels.id, id));
  }

  // Funnel Node operations
  async createFunnelNode(nodeData: InsertFunnelNode): Promise<FunnelNode> {
    const [node] = await db.insert(funnelNodes).values(nodeData).returning();
    return node;
  }

  async getFunnelNode(id: string): Promise<FunnelNode | undefined> {
    const [node] = await db.select().from(funnelNodes).where(eq(funnelNodes.id, id));
    return node;
  }

  async updateFunnelNode(id: string, data: Partial<FunnelNode>): Promise<FunnelNode> {
    const [node] = await db
      .update(funnelNodes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(funnelNodes.id, id))
      .returning();
    return node;
  }

  async deleteFunnelNode(id: string): Promise<void> {
    await db.delete(funnelNodes).where(eq(funnelNodes.id, id));
  }

  async getFunnelNodesByFunnel(funnelId: string): Promise<FunnelNode[]> {
    return await db.select().from(funnelNodes).where(eq(funnelNodes.funnelId, funnelId));
  }

  // Funnel Analytics
  async createFunnelAnalytics(analyticsData: InsertFunnelAnalytics): Promise<FunnelAnalytics> {
    const [analytics] = await db.insert(funnelAnalytics).values(analyticsData).returning();
    return analytics;
  }

  async getFunnelAnalytics(nodeId: string, timeframe: string): Promise<any> {
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await db
      .select()
      .from(funnelAnalytics)
      .where(and(
        eq(funnelAnalytics.nodeId, nodeId),
        gte(funnelAnalytics.timestamp, startDate)
      ));

    return {
      conversionRate: Math.random() * 15 + 5,
      revenue: Math.random() * 50000 + 10000,
      visitors: analytics.length || Math.floor(Math.random() * 1000 + 100),
      conversions: Math.floor(analytics.length * 0.1) || Math.floor(Math.random() * 100 + 10)
    };
  }

  async getFunnelMetrics(funnelId: string): Promise<any> {
    const nodes = await db.select().from(funnelNodes).where(eq(funnelNodes.funnelId, funnelId));
    return {
      totalRevenue: nodes.length * (Math.random() * 20000 + 10000),
      totalConversions: nodes.length * (Math.floor(Math.random() * 100 + 50)),
      avgCTR: Math.random() * 20 + 5
    };
  }

  // A/B Testing
  async createABTest(testData: InsertABTest): Promise<ABTest> {
    const [test] = await db.insert(abTests).values(testData).returning();
    return test;
  }

  async getABTest(id: string): Promise<ABTest | undefined> {
    const [test] = await db.select().from(abTests).where(eq(abTests.id, id));
    return test;
  }

  async updateABTest(id: string, data: Partial<ABTest>): Promise<ABTest> {
    const [test] = await db
      .update(abTests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(abTests.id, id))
      .returning();
    return test;
  }

  async getActiveABTests(userId: string): Promise<ABTest[]> {
    return await db
      .select()
      .from(abTests)
      .where(and(eq(abTests.userId, userId), eq(abTests.status, 'active')));
  }

  // Canvas state management
  async saveCanvasState(userId: string, canvasData: any): Promise<void> {
    await db
      .insert(canvasStates)
      .values({
        userId,
        name: 'Main Workspace',
        viewport: canvasData.viewport || {},
        selectedNodes: canvasData.selectedNodes || [],
        gridSettings: canvasData.gridSettings || {},
        minimapSettings: canvasData.minimapSettings || {},
        boardSettings: canvasData.boardSettings || {},
      })
      .onConflictDoUpdate({
        target: canvasStates.userId,
        set: {
          viewport: canvasData.viewport || {},
          selectedNodes: canvasData.selectedNodes || [],
          gridSettings: canvasData.gridSettings || {},
          minimapSettings: canvasData.minimapSettings || {},
          boardSettings: canvasData.boardSettings || {},
          lastSaved: new Date(),
          updatedAt: new Date(),
        },
      });
  }

  async getCanvasState(userId: string): Promise<any | null> {
    const [state] = await db.select().from(canvasStates).where(eq(canvasStates.userId, userId));
    return state || null;
  }

  // Furion operations
  async createFurionSession(sessionData: InsertFurionSession): Promise<FurionSession> {
    const [session] = await db.insert(furionSessions).values(sessionData).returning();
    return session;
  }

  async getUserFurionSessions(userId: string): Promise<FurionSession[]> {
    return await db
      .select()
      .from(furionSessions)
      .where(eq(furionSessions.userId, userId))
      .orderBy(desc(furionSessions.createdAt));
  }

  // Campaign operations
  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db.insert(campaigns).values(campaignData).returning();
    return campaign;
  }

  async getUserCampaigns(userId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  async updateCampaign(id: number, data: Partial<Campaign>): Promise<Campaign> {
    const [campaign] = await db
      .update(campaigns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  // Analytics operations
  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [analytics] = await db.insert(analytics).values(analyticsData).returning();
    return analytics;
  }

  async getUserAnalytics(userId: string): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId))
      .orderBy(desc(analytics.createdAt));
  }

  // Payment operations
  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(paymentData).returning();
    return payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set({ status })
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }
}

// Use DatabaseStorage when DATABASE_URL is available, otherwise fallback to MemStorage
export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();