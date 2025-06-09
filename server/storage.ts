import { 
  users, funnels, aiGenerations, tools, userAnalytics,
  type User, type InsertUser, type UpsertUser, type Funnel, type InsertFunnel, 
  type AIGeneration, type InsertAIGeneration, type Tool, type InsertTool,
  type UserAnalytics, type InsertAnalytics
} from "@shared/schema";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPlan(id: string, plan: string, subscriptionData: any): Promise<User>;
  
  // Funnel operations
  createFunnel(funnel: InsertFunnel): Promise<Funnel>;
  getFunnel(id: number): Promise<Funnel | undefined>;
  getAllFunnels(): Promise<Funnel[]>;
  getFunnelsByUser(userId: string): Promise<Funnel[]>;
  updateFunnelStep(id: number, currentStep: number, stepData: any): Promise<Funnel>;
  
  // AI Generation operations
  createAIGeneration(generation: InsertAIGeneration): Promise<AIGeneration>;
  getAIGenerationsByFunnel(funnelId: number): Promise<AIGeneration[]>;
  
  // Tool operations
  getAllTools(): Promise<Tool[]>;
  getToolsByCategory(category: string): Promise<Tool[]>;
  createTool(tool: InsertTool): Promise<Tool>;
  
  // Analytics operations
  logUserAction(analytics: InsertAnalytics): Promise<UserAnalytics>;
  getUserAnalytics(userId: string): Promise<UserAnalytics[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private funnels: Map<number, Funnel>;
  private aiGenerations: Map<number, AIGeneration>;
  private tools: Map<number, Tool>;
  private analytics: Map<number, UserAnalytics>;
  private currentUserId: number;
  private currentFunnelId: number;
  private currentGenerationId: number;
  private currentToolId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.funnels = new Map();
    this.aiGenerations = new Map();
    this.tools = new Map();
    this.analytics = new Map();
    this.currentUserId = 1;
    this.currentFunnelId = 1;
    this.currentGenerationId = 1;
    this.currentToolId = 1;
    this.currentAnalyticsId = 1;

    // Initialize default tools
    this.initializeDefaultTools();
  }

  private async initializeDefaultTools() {
    const defaultTools: InsertTool[] = [
      {
        name: "IA Board V2 - Criador de Funis",
        description: "Crie funis completos com 8 etapas usando múltiplas IAs",
        icon: "Zap",
        category: "funnel",
        planRequired: "free"
      },
      {
        name: "IA Espiã v2",
        description: "Análise avançada de concorrentes e templates prontos",
        icon: "Eye",
        category: "spy",
        planRequired: "starter"
      },
      {
        name: "IA Vídeo Avançado",
        description: "Geração de roteiros e estruturas de vídeo profissionais",
        icon: "Video",
        category: "video",
        planRequired: "pro"
      },
      {
        name: "IA Tráfego Master",
        description: "Campanhas com segmentação comportamental avançada",
        icon: "TrendingUp",
        category: "traffic",
        planRequired: "pro"
      },
      {
        name: "IA Copy & Headlines",
        description: "Copy de alta conversão baseado em dados reais",
        icon: "FileText",
        category: "copywriting",
        planRequired: "starter"
      },
      {
        name: "Gerenciador de Funis",
        description: "Organização e gestão de múltiplos projetos",
        icon: "Folder",
        category: "management",
        planRequired: "free"
      }
    ];

    for (const tool of defaultTools) {
      await this.createTool(tool);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `user_${this.currentUserId++}`;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      profileImageUrl: null,
      plan: "free",
      subscriptionStatus: "inactive",
      subscriptionId: null,
      customerId: null,
      planLimits: {
        funnels: 3,
        aiGenerations: 50,
        tools: ["IA Board V2 - Criador de Funis", "Gerenciador de Funis"]
      },
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const now = new Date();
    
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...userData,
        updatedAt: now,
      };
      this.users.set(userData.id, updatedUser);
      return updatedUser;
    } else {
      const newUser: User = {
        ...userData,
        username: null,
        password: null,
        plan: "free",
        subscriptionStatus: "inactive",
        subscriptionId: null,
        customerId: null,
        planLimits: {
          funnels: 3,
          aiGenerations: 50,
          tools: ["IA Board V2 - Criador de Funis", "Gerenciador de Funis"]
        },
        createdAt: now,
        updatedAt: now,
      };
      this.users.set(userData.id, newUser);
      return newUser;
    }
  }

  async updateUserPlan(id: string, plan: string, subscriptionData: any): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    const planLimits = {
      free: { funnels: 3, aiGenerations: 50, tools: ["IA Board V2 - Criador de Funis", "Gerenciador de Funis"] },
      starter: { funnels: 10, aiGenerations: 500, tools: ["IA Board V2 - Criador de Funis", "Gerenciador de Funis", "IA Espiã v2", "IA Copy & Headlines"] },
      pro: { funnels: 50, aiGenerations: 2000, tools: ["IA Board V2 - Criador de Funis", "Gerenciador de Funis", "IA Espiã v2", "IA Copy & Headlines", "IA Vídeo Avançado", "IA Tráfego Master"] },
      enterprise: { funnels: -1, aiGenerations: -1, tools: ["all"] }
    };

    const updatedUser: User = {
      ...user,
      plan,
      subscriptionStatus: subscriptionData.status || "active",
      subscriptionId: subscriptionData.subscriptionId || null,
      customerId: subscriptionData.customerId || null,
      planLimits: planLimits[plan as keyof typeof planLimits] || planLimits.free,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Funnel operations
  async createFunnel(insertFunnel: InsertFunnel): Promise<Funnel> {
    const id = this.currentFunnelId++;
    const now = new Date();
    const funnel: Funnel = {
      ...insertFunnel,
      userId: insertFunnel.userId || null,
      id,
      currentStep: 0,
      isCompleted: false,
      stepData: {},
      createdAt: now,
      updatedAt: now,
    };
    this.funnels.set(id, funnel);
    return funnel;
  }

  async getFunnel(id: number): Promise<Funnel | undefined> {
    return this.funnels.get(id);
  }

  async getAllFunnels(): Promise<Funnel[]> {
    return Array.from(this.funnels.values());
  }

  async getFunnelsByUser(userId: string): Promise<Funnel[]> {
    return Array.from(this.funnels.values()).filter(
      (funnel) => funnel.userId === userId
    );
  }

  async updateFunnelStep(id: number, currentStep: number, stepData: any): Promise<Funnel> {
    const funnel = this.funnels.get(id);
    if (!funnel) {
      throw new Error("Funnel not found");
    }

    const updatedFunnel: Funnel = {
      ...funnel,
      currentStep,
      stepData: { ...(funnel.stepData as object), ...stepData },
      isCompleted: currentStep >= 8,
      updatedAt: new Date(),
    };

    this.funnels.set(id, updatedFunnel);
    return updatedFunnel;
  }

  // AI Generation operations
  async createAIGeneration(insertGeneration: InsertAIGeneration): Promise<AIGeneration> {
    const id = this.currentGenerationId++;
    const generation: AIGeneration = {
      ...insertGeneration,
      id,
      createdAt: new Date(),
    };
    this.aiGenerations.set(id, generation);
    return generation;
  }

  async getAIGenerationsByFunnel(funnelId: number): Promise<AIGeneration[]> {
    return Array.from(this.aiGenerations.values()).filter(
      (generation) => generation.funnelId === funnelId
    );
  }

  // Tool operations
  async getAllTools(): Promise<Tool[]> {
    return Array.from(this.tools.values());
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
    return Array.from(this.tools.values()).filter(
      (tool) => tool.category === category
    );
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = this.currentToolId++;
    const tool: Tool = {
      ...insertTool,
      id,
      planRequired: insertTool.planRequired || "free",
      isActive: true,
    };
    this.tools.set(id, tool);
    return tool;
  }

  // Analytics operations
  async logUserAction(insertAnalytics: InsertAnalytics): Promise<UserAnalytics> {
    const id = this.currentAnalyticsId++;
    const analytics: UserAnalytics = {
      ...insertAnalytics,
      id,
      userId: insertAnalytics.userId || null,
      metadata: insertAnalytics.metadata || {},
      createdAt: new Date(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics[]> {
    return Array.from(this.analytics.values()).filter(
      (analytics) => analytics.userId === userId
    );
  }
}

export const storage = new MemStorage();
