interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  plan: string;
  subscriptionStatus: string;
  furionCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  userId: string;
  type: string;
  title: string;
  status: string;
  progress: number;
  content?: any;
  createdAt: Date;
  updatedAt: Date;
}

class MemoryStorage {
  private users: Map<string, User> = new Map();
  private usersByEmail: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();
  private userProjects: Map<string, string[]> = new Map();

  constructor() {
    // Create demo user
    const demoUser: User = {
      id: 'demo-user',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      password: 'demo123',
      plan: 'professional',
      subscriptionStatus: 'active',
      furionCredits: 2847,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(demoUser.id, demoUser);
    this.usersByEmail.set(demoUser.email, demoUser);
    this.userProjects.set(demoUser.id, []);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersByEmail.get(email);
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
    const id = Date.now().toString();
    const user: User = {
      id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      plan: userData.plan || 'starter',
      subscriptionStatus: userData.subscriptionStatus || 'trial',
      furionCredits: userData.furionCredits || (
        userData.plan === 'enterprise' ? 10000 : 
        userData.plan === 'professional' ? 5000 : 1000
      ),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(id, user);
    this.usersByEmail.set(user.email, user);
    this.userProjects.set(id, []);

    return user;
  }

  async updateUserCredits(id: string, credits: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.furionCredits = credits;
      user.updatedAt = new Date();
      this.users.set(id, user);
      this.usersByEmail.set(user.email, user);
    }
    return user;
  }

  // Project operations
  async createProject(projectData: {
    userId: string;
    type: string;
    title: string;
    status?: string;
    progress?: number;
    content?: any;
  }): Promise<Project> {
    const id = Date.now().toString();
    const project: Project = {
      id,
      userId: projectData.userId,
      type: projectData.type,
      title: projectData.title,
      status: projectData.status || 'processing',
      progress: projectData.progress || 0,
      content: projectData.content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.projects.set(id, project);
    
    const userProjectIds = this.userProjects.get(projectData.userId) || [];
    userProjectIds.push(id);
    this.userProjects.set(projectData.userId, userProjectIds);

    return project;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    const projectIds = this.userProjects.get(userId) || [];
    return projectIds.map(id => this.projects.get(id)!).filter(Boolean);
  }

  async updateProject(id: string, updateData: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (project) {
      Object.assign(project, updateData, { updatedAt: new Date() });
      this.projects.set(id, project);
    }
    return project;
  }
}

export const storage = new MemoryStorage();