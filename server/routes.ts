import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFunnelSchema, insertAIGenerationSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'ia-board-v2-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, username, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email) || await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const userData = insertUserSchema.parse({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName
      });

      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(400).json({ message: "Email ou senha inválidos" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Email ou senha inválidos" });
      }

      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  // Get current user
  app.get("/api/auth/user", async (req: any, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user without password
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get all tools
  app.get("/api/tools", async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new funnel
  app.post("/api/funnels", requireAuth, async (req: any, res) => {
    try {
      const data = insertFunnelSchema.parse({ ...req.body, userId: req.session.userId });
      const funnel = await storage.createFunnel(data);
      res.json(funnel);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user's funnels
  app.get("/api/funnels", requireAuth, async (req: any, res) => {
    try {
      const funnels = await storage.getFunnelsByUser(req.session.userId);
      res.json(funnels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific funnel
  app.get("/api/funnels/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const funnel = await storage.getFunnel(id);
      if (!funnel) {
        return res.status(404).json({ message: "Funnel not found" });
      }
      
      // Check if user owns this funnel
      if (funnel.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(funnel);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update funnel step
  app.patch("/api/funnels/:id/step", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { currentStep, stepData } = req.body;
      
      const funnel = await storage.getFunnel(id);
      if (!funnel || funnel.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedFunnel = await storage.updateFunnelStep(id, currentStep, stepData);
      res.json(updatedFunnel);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate AI content for a step
  app.post("/api/ai/generate", requireAuth, async (req: any, res) => {
    try {
      const { step, prompt, aiProvider, funnelId, productType, previousSteps } = req.body;
      
      // Check user's plan limits
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Import AI services dynamically to avoid issues with environment variables at startup
      const { generateAIContent } = await import("../client/src/lib/ai-services");
      
      const response = await generateAIContent({
        step,
        prompt,
        aiProvider,
        productType,
        previousSteps
      });

      // Save the generation to database
      if (funnelId) {
        const generationData = insertAIGenerationSchema.parse({
          funnelId,
          step,
          aiProvider,
          prompt,
          response: JSON.stringify(response)
        });
        await storage.createAIGeneration(generationData);
      }

      // Log user action
      await storage.logUserAction({
        userId: req.session.userId,
        toolUsed: "IA Board V2 - Criador de Funis",
        action: "ai_generation",
        metadata: { step, aiProvider, funnelId }
      });

      res.json(response);
    } catch (error: any) {
      console.error("AI generation error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get AI generations for a funnel
  app.get("/api/funnels/:id/generations", requireAuth, async (req: any, res) => {
    try {
      const funnelId = parseInt(req.params.id);
      const funnel = await storage.getFunnel(funnelId);
      
      if (!funnel || funnel.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const generations = await storage.getAIGenerationsByFunnel(funnelId);
      res.json(generations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user subscription plan
  app.post("/api/subscription/update", requireAuth, async (req: any, res) => {
    try {
      const { plan, subscriptionData } = req.body;
      const updatedUser = await storage.updateUserPlan(req.session.userId, plan, subscriptionData);
      
      const { password: _, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
