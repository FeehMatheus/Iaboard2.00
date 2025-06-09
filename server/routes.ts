import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFunnelSchema, insertAIGenerationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new funnel
  app.post("/api/funnels", async (req, res) => {
    try {
      const data = insertFunnelSchema.parse(req.body);
      const funnel = await storage.createFunnel(data);
      res.json(funnel);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get all funnels
  app.get("/api/funnels", async (req, res) => {
    try {
      const funnels = await storage.getAllFunnels();
      res.json(funnels);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get a specific funnel
  app.get("/api/funnels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const funnel = await storage.getFunnel(id);
      if (!funnel) {
        return res.status(404).json({ message: "Funnel not found" });
      }
      res.json(funnel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update funnel step
  app.patch("/api/funnels/:id/step", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { currentStep, stepData } = req.body;
      const funnel = await storage.updateFunnelStep(id, currentStep, stepData);
      res.json(funnel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate AI content for a step
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { step, prompt, aiProvider, funnelId, productType, previousSteps } = req.body;
      
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

      res.json(response);
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get AI generations for a funnel
  app.get("/api/funnels/:id/generations", async (req, res) => {
    try {
      const funnelId = parseInt(req.params.id);
      const generations = await storage.getAIGenerationsByFunnel(funnelId);
      res.json(generations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
