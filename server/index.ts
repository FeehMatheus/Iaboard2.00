import express, { type Request, Response, NextFunction, type Express } from "express";
import { createServer, type Server } from "http";
import { config } from "dotenv";
import youtubeRoutes from "./routes";
import enhancedRoutes from "./enhanced-routes";
import iaBoardModules from "./ia-board-modules";
import fastAIRoutes from "./fast-ai-routes";
import downloadsManager from "./downloads-manager";
import highPerformanceAI from "./high-performance-ai";
import realVideoHybrid from "./real-video-hybrid";
import failureDetection from "./failure-detection";
import authenticVideoAPIs from "./authentic-video-apis";
import workingVideoGenerator from "./working-video-generator";
import realWorkingVideo from "./real-working-video";
import productionVideoAPI from "./production-video-api";
import functionalVideoSystem from "./functional-video-system";
import realVideoGenerator from "./real-video-generator";
import workflowChoreography from "./workflow-choreography";
import workflowExecutor from "./workflow-executor";
import powerfulThinkingAI from "./powerful-thinking-ai";
import intelligentContentWorkflow from "./intelligent-content-workflow";
import apiConnectionFix from "./api-connection-fix";
import realApiValidator from "./real-api-validator";
import authenticVideoGenerator from "./authentic-video-generator";
import enhancedHybridSystem from "./enhanced-hybrid-system";
import { setupVite, serveStatic, log } from "./vite";

// Load environment variables
config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const httpServer: Server = createServer(app);
  
  // Add downloads manager (highest priority)
  app.use(downloadsManager);
  
  // Add failure detection system
  app.use(failureDetection);
  
  // Add real video generator (primary)
  app.use(realVideoGenerator);
  
  // Add functional video system (secondary)
  app.use(functionalVideoSystem);
  
  // Add workflow choreography system
  app.use(workflowChoreography);
  
  // Add workflow executor
  app.use(workflowExecutor);
  
  // Add powerful thinking AI
  app.use(powerfulThinkingAI);
  
  // Add intelligent content workflow system
  app.use(intelligentContentWorkflow);
  
  // Add API connection fixes (highest priority)
  app.use(apiConnectionFix);
  
  // Add real API validator (critical priority)
  app.use(realApiValidator);
  
  // Add authentic video generator (top priority)
  app.use(authenticVideoGenerator);
  
  // Add enhanced hybrid system (ultimate priority)
  app.use(enhancedHybridSystem);
  
  // Add high-performance AI routes
  app.use(highPerformanceAI);
  
  // Add fast AI routes
  app.use(fastAIRoutes);
  
  // Add IA Board specialized modules
  app.use(iaBoardModules);
  
  // Add YouTube analysis routes
  app.use(youtubeRoutes);
  
  // Add enhanced AI routes (lowest priority)
  app.use(enhancedRoutes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  httpServer.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
