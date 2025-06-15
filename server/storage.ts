import { users, projects, type User, type Project } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: any): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(insertProject: any): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // AI Generation operations
  createAIGeneration(insertGeneration: any): Promise<any>;
  getAIGenerations(userId: string): Promise<any[]>;

  // YouTube Analysis operations
  createYouTubeAnalysis(insertAnalysis: any): Promise<any>;
  getYouTubeAnalysis(id: number): Promise<any>;
  updateYouTubeAnalysis(id: number, data: any): Promise<any>;
  createTimeSegment(insertSegment: any): Promise<any>;
  createContentInsight(insertInsight: any): Promise<any>;
  createProgramStructure(insertStructure: any): Promise<any>;
  getAnalysisWithDetails(id: number): Promise<any>;
}

export class MemoryStorage implements IStorage {
  private memoryUsers: Map<string, any> = new Map();
  private memoryProjects: Map<string, any> = new Map();
  private memoryGenerations: Map<string, any> = new Map();
  private memoryAnalyses: Map<number, any> = new Map();
  private memorySegments: Map<number, any> = new Map();
  private memoryInsights: Map<number, any> = new Map();
  private memoryStructure: Map<number, any> = new Map();

  constructor() {
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Demo user
    const demoUser = {
      id: 'demo-user',
      email: 'demo@maquinamilionaria.ai',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      plan: 'demo',
      profileImageUrl: null,
      subscriptionStatus: 'active',
      subscriptionData: { planType: 'demo', startDate: new Date().toISOString(), endDate: null },
      furionCredits: 1000,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.memoryUsers.set(demoUser.id, demoUser);

    // Demo projects
    const demoProjects = [
      {
        id: 'project-1',
        title: 'Copy de Vendas - Curso Digital',
        type: 'copywriting',
        status: 'completed',
        progress: 100,
        content: {
          title: 'Copy Irresistível para Curso de Marketing Digital',
          content: 'Descubra os segredos que transformaram milhares de empreendedores...',
          metadata: { wordCount: 350, readingTime: '2 min' }
        },
        position: { x: 100, y: 100 },
        size: { width: 300, height: 200 },
        zIndex: 1,
        isExpanded: false,
        connections: [],
        links: [],
        videoUrl: null,
        userId: 'demo-user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'project-2',
        title: 'VSL - Produto Digital',
        type: 'vsl',
        status: 'in-progress',
        progress: 75,
        content: {
          title: 'Roteiro VSL de Alta Conversão',
          script: 'Hook: Você já se perguntou por que alguns produtos vendem como água...',
          duration: '12 minutos'
        },
        position: { x: 450, y: 150 },
        size: { width: 300, height: 200 },
        zIndex: 1,
        isExpanded: false,
        connections: [],
        links: [],
        videoUrl: null,
        userId: 'demo-user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    demoProjects.forEach(project => {
      this.memoryProjects.set(project.id, project);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      if (this.memoryUsers.has(id)) {
        return this.memoryUsers.get(id);
      }
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      return this.memoryUsers.get(id);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    } catch (error) {
      for (const user of Array.from(this.memoryUsers.values())) {
        if (user.email === email) return user;
      }
      return undefined;
    }
  }

  async createUser(insertUser: any): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values({
          ...insertUser,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          profileImageUrl: insertUser.profileImageUrl || null,
          subscriptionData: insertUser.subscriptionData || null,
          furionCredits: insertUser.furionCredits || 100
        })
        .returning();
      return user;
    } catch (error) {
      const newUser = {
        id: Date.now().toString(),
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        profileImageUrl: insertUser.profileImageUrl || null,
        subscriptionData: insertUser.subscriptionData || null,
        furionCredits: insertUser.furionCredits || 100
      };
      this.memoryUsers.set(newUser.id, newUser);
      return newUser;
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      const [user] = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      const existingUser = this.memoryUsers.get(id);
      if (existingUser) {
        const updatedUser = { ...existingUser, ...data, updatedAt: new Date() };
        this.memoryUsers.set(id, updatedUser);
        return updatedUser;
      }
      throw new Error('User not found');
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const projectList = await db.select().from(projects);
      return projectList;
    } catch (error) {
      return Array.from(this.memoryProjects.values());
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project || undefined;
    } catch (error) {
      return this.memoryProjects.get(id);
    }
  }

  async createProject(insertProject: any): Promise<Project> {
    try {
      const [project] = await db
        .insert(projects)
        .values({
          ...insertProject,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          position: insertProject.position || { x: 0, y: 0 },
          size: insertProject.size || { width: 300, height: 200 },
          zIndex: insertProject.zIndex || 1,
          isExpanded: insertProject.isExpanded || false,
          connections: insertProject.connections || [],
          links: insertProject.links || [],
          videoUrl: insertProject.videoUrl || null
        })
        .returning();
      return project;
    } catch (error) {
      const newProject = {
        id: Date.now().toString(),
        ...insertProject,
        createdAt: new Date(),
        updatedAt: new Date(),
        position: insertProject.position || { x: 0, y: 0 },
        size: insertProject.size || { width: 300, height: 200 },
        zIndex: insertProject.zIndex || 1,
        isExpanded: insertProject.isExpanded || false,
        connections: insertProject.connections || [],
        links: insertProject.links || [],
        videoUrl: insertProject.videoUrl || null
      };
      this.memoryProjects.set(newProject.id, newProject);
      return newProject;
    }
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    try {
      const [project] = await db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return project;
    } catch (error) {
      const existingProject = this.memoryProjects.get(id);
      if (existingProject) {
        const updatedProject = { ...existingProject, ...data, updatedAt: new Date() };
        this.memoryProjects.set(id, updatedProject);
        return updatedProject;
      }
      throw new Error('Project not found');
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await db.delete(projects).where(eq(projects.id, id));
    } catch (error) {
      this.memoryProjects.delete(id);
    }
  }

  async createAIGeneration(insertGeneration: any): Promise<any> {
    try {
      const newGeneration = {
        id: Date.now(),
        ...insertGeneration,
        createdAt: new Date(),
        metadata: insertGeneration.metadata || {},
        projectId: insertGeneration.projectId || null,
        creditsUsed: insertGeneration.creditsUsed || 1
      };
      this.memoryGenerations.set(newGeneration.id.toString(), newGeneration);
      return newGeneration;
    } catch (error) {
      const newGeneration = {
        id: Date.now(),
        ...insertGeneration,
        createdAt: new Date(),
        metadata: insertGeneration.metadata || {},
        projectId: insertGeneration.projectId || null,
        creditsUsed: insertGeneration.creditsUsed || 1
      };
      this.memoryGenerations.set(newGeneration.id.toString(), newGeneration);
      return newGeneration;
    }
  }

  async getAIGenerations(userId: string): Promise<any[]> {
    try {
      return Array.from(this.memoryGenerations.values()).filter(gen => gen.userId === userId);
    } catch (error) {
      return Array.from(this.memoryGenerations.values()).filter(gen => gen.userId === userId);
    }
  }
}

export const storage = new MemoryStorage();