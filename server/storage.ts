import { users, funnels, aiGenerations, type User, type InsertUser, type Funnel, type InsertFunnel, type AIGeneration, type InsertAIGeneration } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createFunnel(funnel: InsertFunnel): Promise<Funnel>;
  getFunnel(id: number): Promise<Funnel | undefined>;
  getAllFunnels(): Promise<Funnel[]>;
  updateFunnelStep(id: number, currentStep: number, stepData: any): Promise<Funnel>;
  
  createAIGeneration(generation: InsertAIGeneration): Promise<AIGeneration>;
  getAIGenerationsByFunnel(funnelId: number): Promise<AIGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private funnels: Map<number, Funnel>;
  private aiGenerations: Map<number, AIGeneration>;
  private currentUserId: number;
  private currentFunnelId: number;
  private currentGenerationId: number;

  constructor() {
    this.users = new Map();
    this.funnels = new Map();
    this.aiGenerations = new Map();
    this.currentUserId = 1;
    this.currentFunnelId = 1;
    this.currentGenerationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFunnel(insertFunnel: InsertFunnel): Promise<Funnel> {
    const id = this.currentFunnelId++;
    const now = new Date();
    const funnel: Funnel = {
      ...insertFunnel,
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

  async updateFunnelStep(id: number, currentStep: number, stepData: any): Promise<Funnel> {
    const funnel = this.funnels.get(id);
    if (!funnel) {
      throw new Error("Funnel not found");
    }

    const updatedFunnel: Funnel = {
      ...funnel,
      currentStep,
      stepData: { ...funnel.stepData, ...stepData },
      isCompleted: currentStep >= 8,
      updatedAt: new Date(),
    };

    this.funnels.set(id, updatedFunnel);
    return updatedFunnel;
  }

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
}

export const storage = new MemStorage();
