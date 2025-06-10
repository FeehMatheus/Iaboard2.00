import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { AIFunnelGenerator, ContentGenerator } from "./ai-services-clean";
import { iaSupremaServices } from "./ai-suprema-services";
import { furionAI } from "./furion-ai";
import { insertFunnelSchema, insertAIGenerationSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

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

  // Create a new funnel with AI generation
  app.post("/api/funnels", requireAuth, async (req: any, res) => {
    try {
      const data = insertFunnelSchema.parse({ ...req.body, userId: req.session.userId });
      const funnel = await storage.createFunnel(data);
      res.json(funnel);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate funnel with AI
  app.post("/api/funnels/generate", requireAuth, async (req: any, res) => {
    try {
      const { productType, targetAudience, mainGoal, budget, timeline } = req.body;
      
      // Generate funnel using AI
      const generatedFunnel = await AIFunnelGenerator.generateFunnel({
        productType,
        targetAudience,
        mainGoal,
        budget,
        timeline
      });

      // Save to database
      const newFunnel = await storage.createFunnel({
        userId: req.session.userId,
        name: generatedFunnel.title,
        title: generatedFunnel.title,
        description: generatedFunnel.description,
        productType,
        targetAudience,
        currentStep: 1,
        stepData: generatedFunnel.steps,
        isCompleted: false
      });

      // Log AI generation
      await storage.createAIGeneration({
        funnelId: newFunnel.id,
        stepNumber: 0,
        provider: 'openai',
        prompt: `Generate funnel for ${productType}`,
        response: JSON.stringify(generatedFunnel),
        tokensUsed: 2000
      });

      res.json({ funnel: newFunnel, generatedContent: generatedFunnel });
    } catch (error: any) {
      console.error('Funnel generation error:', error);
      res.status(500).json({ message: "Error generating funnel", error: error.message });
    }
  });

  // Generate specific content with AI
  app.post("/api/ai/generate-copy", requireAuth, async (req: any, res) => {
    try {
      const { type, context } = req.body;
      const generatedCopy = await AIFunnelGenerator.generateCopy(type, context);
      
      res.json({ content: generatedCopy });
    } catch (error: any) {
      console.error('Copy generation error:', error);
      res.status(500).json({ message: "Error generating copy", error: error.message });
    }
  });

  // Competitor analysis
  app.post("/api/ai/analyze-competitor", requireAuth, async (req: any, res) => {
    try {
      const { competitorUrl, productType } = req.body;
      const analysis = await AIFunnelGenerator.analyzeCompetitor(competitorUrl, productType);
      
      res.json(analysis);
    } catch (error: any) {
      console.error('Competitor analysis error:', error);
      res.status(500).json({ message: "Error analyzing competitor", error: error.message });
    }
  });

  // Generate VSL
  app.post("/api/ai/generate-vsl", requireAuth, async (req: any, res) => {
    try {
      const { productInfo, duration } = req.body;
      const vsl = await AIFunnelGenerator.generateVSL(productInfo, duration);
      
      res.json(vsl);
    } catch (error: any) {
      console.error('VSL generation error:', error);
      res.status(500).json({ message: "Error generating VSL", error: error.message });
    }
  });

  // Generate landing page
  app.post("/api/ai/generate-landing", requireAuth, async (req: any, res) => {
    try {
      const { productInfo } = req.body;
      const landingPage = await ContentGenerator.generateLandingPage(productInfo);
      
      res.json({ html: landingPage });
    } catch (error: any) {
      console.error('Landing page generation error:', error);
      res.status(500).json({ message: "Error generating landing page", error: error.message });
    }
  });

  // Generate email sequence
  app.post("/api/ai/generate-emails", requireAuth, async (req: any, res) => {
    try {
      const { productInfo, sequenceLength } = req.body;
      const emails = await ContentGenerator.generateEmailSequence(productInfo, sequenceLength);
      
      res.json({ emails });
    } catch (error: any) {
      console.error('Email generation error:', error);
      res.status(500).json({ message: "Error generating emails", error: error.message });
    }
  });

  // Download funnel as HTML/PDF
  app.get("/api/funnels/:id/download/:format", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const format = req.params.format;
      
      const funnel = await storage.getFunnel(id);
      if (!funnel || funnel.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      let content = '';
      let filename = `${funnel.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'funnel'}.${format}`;
      let contentType = 'text/plain';

      switch (format) {
        case 'html':
          content = generateHTMLContent(funnel);
          contentType = 'text/html';
          break;
        case 'pdf':
          content = generatePDFContent(funnel);
          contentType = 'text/plain';
          filename = filename.replace('.pdf', '.txt');
          break;
        case 'json':
          content = JSON.stringify(funnel, null, 2);
          contentType = 'application/json';
          break;
        case 'txt':
          content = generateTextContent(funnel);
          contentType = 'text/plain';
          break;
        default:
          return res.status(400).json({ message: "Unsupported format. Use: html, pdf, json, txt" });
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(content);
    } catch (error: any) {
      console.error('Download error:', error);
      res.status(500).json({ message: "Error generating download", error: error.message });
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

  // AI Processing routes for new workflow with real content generation
  app.post('/api/ai/process-step', async (req, res) => {
    try {
      const { stepId, productType, context, targetAudience = 'Empreendedores digitais' } = req.body;
      
      // Import real AI content generator
      const { aiContentGenerator } = await import('./ai-content-generator');
      
      try {
        const generatedContent = await aiContentGenerator.generateRealContent({
          stepId,
          productType,
          targetAudience,
          marketData: context,
          context
        });
        
        res.json({
          ...generatedContent.metadata,
          content: generatedContent.content,
          files: generatedContent.files,
          type: generatedContent.type,
          generated: true,
          timestamp: new Date().toISOString()
        });
        
      } catch (aiError) {
        console.error('AI generation failed, using fallback:', aiError);
        
        // Enhanced fallback with more realistic data
        const fallbackData = {
          1: { 
            marketAnalysis: 'Análise completa realizada',
            trends: ['Transformação Digital Acelerada', 'IA & Automação de Processos', 'E-commerce Exponencial'],
            marketSize: 'R$ 3.2 bilhões (2024)',
            growthRate: '28% ao ano',
            opportunities: ['Baixa penetração de IA', 'Demanda por automação', 'Necessidade de otimização'],
            threats: ['Concorrência internacional', 'Mudanças regulatórias'],
            confidence: 'Alto',
            sources: ['IBGE', 'McKinsey Digital', 'Statista'],
            generated: false
          },
          2: { 
            primaryAudience: 'Empreendedores e consultores 28-50 anos',
            demographics: 'Renda R$ 10k-50k/mês, ensino superior, digitalmente ativos',
            painPoints: ['Baixa conversão de leads', 'Processos manuais', 'Falta de sistematização'],
            behavior: 'Buscam soluções práticas, valorizam ROI comprovado',
            channels: ['LinkedIn', 'Instagram', 'YouTube', 'Email Marketing'],
            personas: 3,
            segments: 5,
            generated: false
          },
          3: { 
            positioning: 'Solução premium com ROI garantido',
            pricing: 'R$ 497 (básico) a R$ 2.997 (premium)',
            uniqueValue: 'IA personalizada + mentoria humana especializada',
            differentiators: ['Garantia de resultados', 'Implementação assistida', 'Comunidade exclusiva'],
            competitiveAdvantage: 'Única solução com IA + suporte humanizado',
            generated: false
          },
          4: { 
            competitors: 15,
            mainCompetitors: ['Leadlovers', 'Klenty', 'RD Station'],
            weaknesses: ['UX complexa', 'Preços elevados', 'Suporte limitado', 'Falta de personalização'],
            opportunities: ['IA mais avançada', 'UX simplificada', 'Preço competitivo', 'Suporte superior'],
            marketGap: 'Falta solução IA personalizada com implementação assistida',
            generated: false
          },
          5: { 
            expectedConversion: '22-35% (acima da média do setor: 18%)',
            projectedRevenue: 'R$ 85k-250k/mês após 90 dias',
            timeToProfit: '45-60 dias para breakeven',
            roi: '340% em 12 meses (conservador)',
            metrics: {
              cpl: 'R$ 25-45',
              cac: 'R$ 180-320',
              ltv: 'R$ 3.500-8.900',
              churn: '8-12% mensal'
            },
            generated: false
          },
          6: { 
            headlines: 15,
            salesPages: 3,
            emailSubjects: 21,
            copyVariations: 8,
            ctas: 12,
            adCopy: 25,
            socialPosts: 30,
            conversionElements: ['Urgência', 'Escassez', 'Prova social', 'Garantia'],
            generated: false
          },
          7: { 
            duration: '12-16 minutos (otimizado para conversão)',
            scripts: 'Roteiro completo + 3 variações de gancho',
            format: 'MP4 4K, Full HD, Mobile (3 versões)',
            scenes: 15,
            callToActions: 5,
            hooks: 8,
            testimonials: 12,
            generated: false
          },
          8: { 
            emailSequence: 14,
            automationRules: 12,
            segmentation: 'Comportamental + demográfica + psicográfica',
            expectedOpenRate: '42-55% (benchmark: 28%)',
            clickRate: '18-25% (benchmark: 12%)',
            workflows: 6,
            generated: false
          },
          9: { 
            landingPages: 4,
            mobileOptimized: true,
            loadSpeed: '< 1.2 segundos',
            conversionElements: 22,
            abTests: 8,
            forms: 6,
            generated: false
          },
          10: { 
            totalAssets: 187,
            readyToLaunch: true,
            estimatedValue: 'R$ 35.000+ em assets digitais',
            completionRate: '100%',
            deliverables: {
              content: 45,
              templates: 28,
              automations: 15,
              integrations: 12
            },
            generated: false
          }
        };
        
        res.json(fallbackData[stepId as keyof typeof fallbackData] || { status: 'processed', generated: false });
      }
    } catch (error) {
      console.error('AI processing error:', error);
      res.status(500).json({ message: 'Processing failed', error: error.message });
    }
  });

  // Advanced Export System with Real Content Generation
  app.post('/api/export/complete-package', async (req, res) => {
    try {
      const { workflowData, productType, completedSteps } = req.body;
      
      // Import real AI content generator
      const { aiContentGenerator } = await import('./ai-content-generator');
      
      let realContent = [];
      
      // Generate real content for each completed step
      for (const stepId of completedSteps) {
        try {
          const content = await aiContentGenerator.generateRealContent({
            stepId,
            productType,
            targetAudience: 'Empreendedores digitais',
            marketData: workflowData,
            context: workflowData
          });
          realContent.push(content);
        } catch (error) {
          console.error(`Failed to generate content for step ${stepId}:`, error);
        }
      }
      
      // Compile complete package with all real files
      const completePackage = {
        metadata: {
          productType,
          generatedAt: new Date().toISOString(),
          completedSteps,
          totalAssets: realContent.reduce((acc, content) => acc + (content.files?.length || 0), 0),
          estimatedValue: 'R$ 35.000+'
        },
        
        files: {
          // Landing Pages
          'pages/landing-page-principal.html': generateCompleteLandingPage(productType, workflowData),
          'pages/thank-you-page.html': generateThankYouPageHTML(productType),
          'pages/sales-page.html': generateLandingPageHTML(productType),
          'pages/checkout-page.html': generateThankYouPageHTML(productType),
          
          // Email Marketing
          'email/welcome-sequence.html': realContent[4]?.content || 'Sequência de emails de boas-vindas',
          'email/nurture-sequence.html': realContent[4]?.content || 'Sequência de nutrição',
          'email/sales-sequence.html': realContent[4]?.content || 'Sequência de vendas',
          'email/automation-setup.json': JSON.stringify({
            sequences: ['welcome', 'nurture', 'sales'],
            triggers: ['signup', 'purchase', 'abandon']
          }),
          
          // Copy and Content
          'copy/headlines.txt': realContent[2]?.content || 'Headlines de alta conversão',
          'copy/ad-scripts.md': realContent[2]?.content || 'Scripts para anúncios',
          'copy/social-media-posts.json': JSON.stringify({
            posts: [
              { platform: 'instagram', content: 'Post 1' },
              { platform: 'facebook', content: 'Post 2' }
            ]
          }),
          'copy/blog-articles.md': realContent[2]?.content || 'Artigos para blog',
          
          // VSL and Video
          'video/vsl-script-complete.md': realContent[3]?.content || 'Script VSL completo',
          'video/storyboard.json': JSON.stringify({
            scenes: [
              { scene: 1, description: 'Abertura impactante' },
              { scene: 2, description: 'Problema identificado' }
            ]
          }),
          'video/production-guide.md': 'Guia de produção de vídeo',
          
          // Business Assets
          'business/business-plan.md': realContent[0]?.content || 'Plano de negócios completo',
          'business/marketing-calendar.json': JSON.stringify({
            months: [
              { month: 'Janeiro', activities: ['Launch', 'Content'] }
            ]
          }),
          'business/roi-calculator.html': '<html><body><h1>Calculadora ROI</h1></body></html>',
          'business/implementation-guide.md': 'Guia de implementação passo a passo',
          
          // Technical Setup
          'tech/tracking-setup.js': 'console.log("Tracking setup");',
          'tech/analytics-config.json': JSON.stringify({
            platform: 'google-analytics',
            events: ['pageview', 'conversion']
          }),
          'tech/integration-guides.md': 'Guias de integração técnica',
          'tech/automation-workflows.json': JSON.stringify({
            workflows: ['email', 'social', 'ads']
          }),
          
          // Templates and Assets
          'templates/presentation-template.html': '<html><body><h1>Template Apresentação</h1></body></html>',
          'templates/proposal-template.md': 'Template de proposta comercial',
          'templates/contract-template.md': 'Template de contrato',
          'assets/brand-guidelines.md': 'Diretrizes da marca',
          
          // Additional generated content from AI
          ...realContent.reduce((acc, content) => {
            if (content.files) {
              content.files.forEach(file => {
                acc[`ai-generated/${content.type}/${file.name}`] = file.content;
              });
            }
            return acc;
          }, {} as Record<string, string>)
        },
        
        structure: {
          'pages/': 'Landing pages e páginas de conversão prontas',
          'email/': 'Sequências de email e automações completas',
          'copy/': 'Copy persuasivo para todos os canais',
          'video/': 'Roteiros e guias para produção de vídeo',
          'business/': 'Documentos estratégicos e planos',
          'tech/': 'Códigos e configurações técnicas',
          'templates/': 'Templates personalizáveis',
          'assets/': 'Identidade visual e guidelines',
          'ai-generated/': 'Conteúdo gerado por IA em tempo real'
        },
        
        implementation: {
          phases: [
            { phase: 1, title: 'Setup Técnico', duration: '7 dias', tasks: 12 },
            { phase: 2, title: 'Conteúdo e Copy', duration: '14 dias', tasks: 18 },
            { phase: 3, title: 'Testes e Otimização', duration: '7 dias', tasks: 8 },
            { phase: 4, title: 'Lançamento', duration: '7 dias', tasks: 6 }
          ],
          totalDuration: '35 dias',
          estimatedROI: '340% em 12 meses'
        }
      };
      
      res.json({
        success: true,
        package: completePackage,
        downloadSize: calculatePackageSize(completePackage.files),
        fileCount: Object.keys(completePackage.files).length,
        readyToLaunch: true,
        realContentGenerated: realContent.length > 0,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ 
        message: 'Export failed', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // AI Complete Package Generation for Canvas Workflow
  app.post("/api/ai/generate-complete-package", async (req, res) => {
    try {
      const { workflowData, mode } = req.body;
      
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Generate comprehensive package using all workflow data
      const { aiContentGenerator } = await import('./ai-content-generator');
      
      try {
        const packageContent = await aiContentGenerator.generateRealContent({
          productType: mode === 'powerful-ai' ? 'complete-funnel' : 'custom-funnel',
          targetAudience: 'optimized',
          marketData: workflowData,
          stepId: 999, // Final package generation
          context: { mode, workflowData }
        });

        // Main files
        zip.file("README.md", `# Produto Completo - IA Board V2\n\nGerado em: ${new Date().toLocaleDateString('pt-BR')}\nModo: ${mode}\n\n## Conteúdo Incluído:\n\n- Landing Pages otimizadas\n- Sequências de email automáticas\n- Scripts de VSL profissionais\n- Copy persuasivo testado\n- Análise de mercado detalhada\n\n---\n*Criado com IA Pensamento Poderoso*`);
        
        // Add generated files if available
        if (packageContent.files) {
          packageContent.files.forEach(file => {
            zip.file(file.name, file.content);
          });
        }

      } catch (aiError) {
        console.log('Using enhanced fallback content generation');
        
        // Enhanced fallback content
        zip.file("README.md", `# Produto Completo - IA Board V2\n\nGerado em: ${new Date().toLocaleDateString('pt-BR')}\nModo: ${mode}\n\n## Conteúdo Incluído:\n\n- Landing Pages otimizadas\n- Sequências de email automáticas\n- Scripts de VSL profissionais\n- Copy persuasivo testado\n- Análise de mercado detalhada\n\n---\n*Criado com IA Pensamento Poderoso*`);
        
        // Landing page
        const landingPageHTML = generateCompleteLandingPage(mode, workflowData);
        zip.file("landing-page.html", landingPageHTML);

        // Email sequences
        const emailSequences = generateEmailSequences(workflowData);
        zip.file("email-sequences.txt", emailSequences);

        // VSL script
        const vslScript = generateVSLScript(workflowData);
        zip.file("vsl-script.txt", vslScript);

        // Marketing copy
        const marketingCopy = generateMarketingCopy(workflowData);
        zip.file("marketing-copy.txt", marketingCopy);
      }

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="produto-completo.zip"',
        'Content-Length': zipBuffer.length
      });
      
      res.send(zipBuffer);

    } catch (error: any) {
      console.error("Error generating complete package:", error);
      res.status(500).json({ 
        message: "Error generating package", 
        error: error.message 
      });
    }
  });

  // Helper functions for content generation
  function generateEmailSequences(workflowData: any): string {
    return `
SEQUÊNCIA DE EMAILS AUTOMÁTICA
===============================

Email 1 - Boas Vindas (Envio imediato)
-------------------------------------
Assunto: Bem-vindo(a)! Sua jornada de transformação começa agora 🎯

Olá [NOME],

Que alegria ter você conosco! Você acabou de dar o primeiro passo rumo à transformação do seu negócio.

Nos próximos dias, você receberá:
• Estratégias práticas para aumentar suas vendas
• Cases reais de sucesso dos nossos clientes
• Ferramentas exclusivas para otimizar seus resultados

Fique de olho na sua caixa de entrada!

Sucesso,
[SEU NOME]

Email 2 - Valor (Dia 2)
----------------------
Assunto: O erro que 90% dos empreendedores cometem

[NOME], preciso compartilhar algo importante...

A maioria dos empreendedores foca apenas em conseguir mais leads, mas ignoram o que realmente importa: a CONVERSÃO.

Vou te mostrar como nossos clientes aumentaram suas vendas em 340% simplesmente otimizando 3 pontos específicos no funil...

[Continua com estratégia valiosa]

Email 3 - Prova Social (Dia 4)
-----------------------------
Assunto: "Faturei R$ 180k em 60 dias" - Case Real

[NOME], quero compartilhar o resultado de uma cliente...

Maria Silva estava faturando R$ 15k/mês e estava prestes a desistir.

Depois de aplicar nossa metodologia:
✅ Mês 1: R$ 45k
✅ Mês 2: R$ 180k
✅ Resultado: 1200% de crescimento

O que ela fez diferente?

[Explica a estratégia]

Email 4 - Escassez (Dia 6)
--------------------------
Assunto: Últimas 24h - Vagas limitadas

[NOME], preciso te avisar...

As vagas para nossa mentoria exclusiva encerram em 24 horas.

Apenas 20 pessoas por mês têm acesso ao nosso acompanhamento 1:1.

Se você quer garantir sua vaga, precisa agir AGORA.

[CTA forte]

---
CONFIGURAÇÃO DE AUTOMAÇÃO:
- Segmentação por interesse
- Tags comportamentais
- Gatilhos de engajamento
- Teste A/B nos assuntos
`;
  }

  function generateVSLScript(workflowData: any): string {
    return `
ROTEIRO VSL - VIDEO SALES LETTER
================================

GANCHO (0-15 segundos)
---------------------
"Se você é um empreendedor que está cansado de trabalhar 12 horas por dia sem ver seus resultados crescerem na mesma proporção, pare tudo que está fazendo e assista este vídeo até o final.

Porque eu vou revelar o sistema exato que usei para sair de R$ 5 mil para R$ 250 mil por mês em apenas 8 meses."

IDENTIFICAÇÃO (15s-45s)
-----------------------
"Meu nome é [SEU NOME], e durante anos eu cometi o mesmo erro que 90% dos empreendedores cometem...

Eu focava em conseguir MAIS leads, MAIS tráfego, MAIS seguidores... mas meus resultados continuavam os mesmos.

Até que descobri que o problema não era a quantidade de pessoas que chegavam até mim, mas sim o que acontecia DEPOIS que elas chegavam."

AGITAÇÃO (45s-2min)
-------------------
"A verdade é que a maioria dos empreendedores está perdendo entre 70% a 80% das suas vendas por não saber como converter seus leads em clientes pagantes.

Eles ficam:
• Criando conteúdo sem parar mas não vende
• Gastando fortunas em tráfego pago sem retorno
• Trabalhando como escravos do próprio negócio
• Vivendo na montanha-russa financeira

E sabe qual é o pior? Muitos desistem antes de descobrir que estavam a apenas 1 ajuste de distância do sucesso."

SOLUÇÃO (2min-4min)
------------------
"Foi quando desenvolvi o Método [NOME DO MÉTODO], um sistema passo a passo que transforma qualquer negócio digital em uma máquina de vendas automatizada.

Este método é baseado em 3 pilares:

1. ATRAÇÃO MAGNÉTICA: Como atrair apenas prospects qualificados
2. CONVERSÃO PODEROSA: O funil que converte 4x mais que a média
3. ESCALA INTELIGENTE: Como multiplicar sem aumentar custos

E o melhor: funciona para qualquer nicho!"

PROVA (4min-6min)
----------------
"Deixe eu te mostrar alguns resultados reais:

• João Silva: de R$ 15k para R$ 180k/mês em 60 dias
• Ana Costa: de R$ 0 para R$ 95k/mês em 90 dias
• Pedro Santos: de R$ 30k para R$ 340k/mês em 120 dias

Mais de 500 empreendedores já usaram este método com sucesso comprovado."

OFERTA (6min-8min)
-----------------
"Normalmente eu cobraria R$ 15.000 por esta mentoria, que é o valor de uma consultoria individual.

Mas decidi criar uma versão em grupo para tornar acessível a mais pessoas.

Por isso, hoje você pode garantir sua vaga por apenas R$ 2.997 em até 12x no cartão."

URGÊNCIA (8min-9min)
-------------------
"Mas atenção: eu só abro essas vagas uma vez por mês, e são apenas 20 pessoas para garantir que eu consiga dar atenção individual a cada um.

Já temos 16 vagas preenchidas, restam apenas 4.

Quando as vagas acabarem, você precisará esperar 30 dias para uma nova oportunidade."

CALL TO ACTION (9min-10min)
---------------------------
"Se você quer garantir sua vaga agora, clique no botão abaixo e preencha seus dados.

Em menos de 2 minutos você terá acesso imediato ao treinamento e poderá começar sua transformação hoje mesmo.

Clique agora e vamos juntos multiplicar seus resultados!"

---
NOTAS DE PRODUÇÃO:
- Tom conversacional e próximo
- Usar gráficos para mostrar resultados
- Incluir depoimentos em vídeo
- Background profissional mas acessível
- Duração ideal: 8-12 minutos
`;
  }

  function generateMarketingCopy(workflowData: any): string {
    return `
COPY PERSUASIVO - HEADLINES E TEXTOS
====================================

HEADLINES PRINCIPAIS
-------------------
1. "O Sistema Que Transformou R$ 5 Mil em R$ 250 Mil/Mês em Apenas 8 Meses"
2. "Como 500+ Empreendedores Multiplicaram Suas Vendas em 90 Dias"
3. "A Estratégia Secreta Que a Elite dos Negócios Digitais Não Quer Que Você Saiba"
4. "De R$ 15k Para R$ 180k/Mês: O Método Que Está Revolucionando o Mercado Digital"
5. "REVELADO: O Sistema de R$ 15 Milhões Que Qualquer Um Pode Copiar"

SUBHEADLINES
-----------
• "Mesmo que você seja iniciante, já tenha tentado outros métodos ou não tenha tempo"
• "Funciona para qualquer nicho: coaching, consultoria, infoprodutos, e-commerce"
• "Resultados comprovados em menos de 90 dias ou seu dinheiro de volta"
• "Sem precisar gastar fortunas em tráfego pago ou contratar uma equipe gigante"

BULLETS DE BENEFÍCIOS
--------------------
✅ Como aumentar sua conversão em até 340% nos próximos 60 dias
✅ O funil secreto que converte 1 em cada 3 visitantes em clientes pagantes
✅ 17 gatilhos mentais que fazem seus prospects comprarem sem resistência
✅ Como vender R$ 100k+ por mês trabalhando apenas 4 horas por dia
✅ A fórmula exata para criar ofertas irresistíveis que se vendem sozinhas
✅ Como construir uma audiência de 100k+ seguidores qualificados em 6 meses
✅ O script de vendas que fecha 8 em cada 10 propostas comerciais
✅ Como automatizar 90% do seu negócio usando apenas 3 ferramentas simples

OBJEÇÕES E RESPOSTAS
-------------------
❌ "Não tenho tempo"
✅ O sistema funciona com apenas 2 horas por semana de dedicação

❌ "Meu nicho é diferente"
✅ Já testamos em 47 nichos diferentes com sucesso comprovado

❌ "Não tenho dinheiro para investir em tráfego"
✅ 70% dos nossos alunos começaram com tráfego orgânico

❌ "Já tentei outros métodos"
✅ Este é o único método com garantia de resultados em 90 dias

CALLS TO ACTION
--------------
1. "QUERO MULTIPLICAR MINHAS VENDAS AGORA"
2. "SIM, QUERO ACESSO IMEDIATO"
3. "GARANTIR MINHA VAGA ANTES QUE ACABE"
4. "COMEÇAR MINHA TRANSFORMAÇÃO HOJE"
5. "QUERO FATURAR R$ 100K+ POR MÊS"

PROVA SOCIAL
-----------
"Mais de 500 empreendedores já transformaram seus negócios"
"R$ 15 milhões+ em vendas geradas pelos nossos alunos"
"Nota 4.9/5 em mais de 1.200 avaliações"
"Recomendado pelos maiores especialistas do mercado digital"

URGÊNCIA E ESCASSEZ
------------------
• "Apenas 20 vagas disponíveis por mês"
• "Oferta válida apenas nas próximas 24 horas"
• "Últimas 4 vagas restantes"
• "Preço promocional encerra em: [COUNTDOWN]"

GARANTIA
--------
"GARANTIA BLINDADA DE 30 DIAS: Se você não aumentar suas vendas em pelo menos 200% nos primeiros 30 dias, devolvemos 100% do seu investimento sem fazer nenhuma pergunta."

---
ADAPTAÇÕES POR CANAL:
- Facebook/Instagram: Copy mais visual e emocional
- LinkedIn: Foco em resultados e ROI
- Email: Tom mais próximo e pessoal
- YouTube: Storytelling mais elaborado
- WhatsApp: Linguagem casual e direta
`;
  }

  // Helper functions for real content generation
  function generateCompleteLandingPage(productType: string, workflowData: any): string {
    const audienceData = workflowData?.step_2 || {};
    const marketData = workflowData?.step_1 || {};
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productType} - Transforme Seu Negócio com IA</title>
    <meta name="description" content="Sistema comprovado de ${productType} que já gerou mais de R$ 50 milhões. Aumente suas vendas em 340% com nossa metodologia exclusiva.">
    
    <!-- Facebook Pixel -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
    </script>
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_TRACKING_ID');
    </script>
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; }
        
        .hero { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            min-height: 100vh; 
            display: flex; 
            align-items: center;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px; 
            position: relative;
            z-index: 2;
        }
        
        .hero-content { 
            display: grid; 
            grid-template-columns: 1fr 400px; 
            gap: 60px; 
            align-items: center; 
        }
        
        .headline { 
            font-size: clamp(2.5rem, 5vw, 4.5rem); 
            font-weight: 800; 
            margin-bottom: 1.5rem; 
            line-height: 1.1;
            background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subheadline { 
            font-size: clamp(1.2rem, 2.5vw, 1.8rem); 
            margin-bottom: 2rem; 
            opacity: 0.95; 
            font-weight: 400;
        }
        
        .benefits-preview {
            margin: 2rem 0;
        }
        
        .benefit-item {
            display: flex;
            align-items: center;
            margin: 1rem 0;
            font-size: 1.1rem;
        }
        
        .benefit-item::before {
            content: '✓';
            color: #4ade80;
            font-weight: bold;
            margin-right: 0.75rem;
            font-size: 1.2rem;
        }
        
        .cta-form { 
            background: rgba(255,255,255,0.98); 
            color: #333; 
            padding: 2.5rem; 
            border-radius: 20px; 
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        .form-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #1f2937;
            text-align: center;
        }
        
        .form-subtitle {
            text-align: center;
            color: #6b7280;
            margin-bottom: 2rem;
            font-size: 0.95rem;
        }
        
        .form-group { 
            margin-bottom: 1.5rem; 
        }
        
        .form-control { 
            width: 100%; 
            padding: 18px 20px; 
            border: 2px solid #e5e7eb; 
            border-radius: 12px; 
            font-size: 16px;
            transition: all 0.3s ease;
            background: #fff;
        }
        
        .form-control:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .btn-primary { 
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); 
            color: white; 
            padding: 20px 30px; 
            border: none; 
            border-radius: 12px; 
            font-size: 18px; 
            font-weight: 700; 
            width: 100%; 
            cursor: pointer; 
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .btn-primary:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 10px 25px rgba(255, 107, 53, 0.4);
        }
        
        .trust-indicators {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.85rem;
            color: #6b7280;
        }
        
        .social-proof { 
            background: #f8fafc; 
            padding: 4rem 0; 
            text-align: center; 
        }
        
        .testimonials { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
            gap: 2rem; 
            margin-top: 3rem;
        }
        
        .testimonial { 
            background: white; 
            padding: 2.5rem; 
            border-radius: 16px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .testimonial:hover {
            transform: translateY(-5px);
        }
        
        .testimonial-text {
            font-style: italic;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        
        .testimonial-author {
            font-weight: 600;
            color: #1f2937;
        }
        
        .results-section {
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
            color: white;
            padding: 5rem 0;
            text-align: center;
        }
        
        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
            margin-top: 3rem;
        }
        
        .result-item {
            text-align: center;
        }
        
        .result-number {
            font-size: 3rem;
            font-weight: 800;
            color: #fbbf24;
            display: block;
        }
        
        .result-label {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-top: 0.5rem;
        }
        
        .guarantee { 
            background: linear-gradient(135deg, #059669 0%, #065f46 100%); 
            color: white; 
            padding: 4rem 0; 
            text-align: center; 
        }
        
        .guarantee-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 1rem;
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        @media (max-width: 768px) { 
            .hero-content { 
                grid-template-columns: 1fr; 
                gap: 3rem; 
                text-align: center;
            }
            
            .cta-form {
                padding: 2rem;
            }
            
            .testimonials {
                grid-template-columns: 1fr;
            }
            
            .results-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <div>
                    <h1 class="headline">Transforme Seu ${productType} em uma Máquina de Vendas</h1>
                    <p class="subheadline">Sistema Comprovado que Já Gerou Mais de R$ 50 Milhões para Nossos Clientes</p>
                    
                    <div class="benefits-preview">
                        <div class="benefit-item">Aumento médio de 340% nas vendas em 90 dias</div>
                        <div class="benefit-item">Sistema 100% automatizado e escalável</div>
                        <div class="benefit-item">ROI garantido ou dinheiro de volta</div>
                        <div class="benefit-item">Implementação assistida por especialistas</div>
                    </div>
                </div>
                
                <form class="cta-form" id="leadForm" action="/api/leads/capture" method="POST">
                    <h3 class="form-title">Acesso Exclusivo Gratuito</h3>
                    <p class="form-subtitle">Descubra como implementar em seu negócio</p>
                    
                    <div class="form-group">
                        <input type="text" class="form-control" name="name" placeholder="Seu nome completo" required>
                    </div>
                    <div class="form-group">
                        <input type="email" class="form-control" name="email" placeholder="Seu melhor email" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" class="form-control" name="phone" placeholder="WhatsApp (opcional)">
                    </div>
                    <div class="form-group">
                        <select class="form-control" name="business_stage" required>
                            <option value="">Estágio do seu negócio</option>
                            <option value="iniciante">Iniciante (0-10k/mês)</option>
                            <option value="intermediario">Intermediário (10-50k/mês)</option>
                            <option value="avancado">Avançado (50k+/mês)</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn-primary">
                        QUERO ACESSO GRATUITO AGORA
                    </button>
                    
                    <div class="trust-indicators">
                        <span>✓ 100% Gratuito</span>
                        <span>✓ Sem Spam</span>
                        <span>✓ Cancele Quando Quiser</span>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <section class="social-proof">
        <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: #1f2937;">Resultados Reais de Clientes</h2>
            <p style="font-size: 1.2rem; color: #6b7280; margin-bottom: 3rem;">Veja como nossos clientes transformaram seus negócios</p>
            
            <div class="testimonials">
                <div class="testimonial">
                    <div class="testimonial-text">"Em 90 dias, saí de R$ 15k para R$ 85k por mês. O sistema realmente funciona e a implementação foi muito mais fácil do que imaginei."</div>
                    <div class="testimonial-author">- Maria Santos, Consultora Digital</div>
                </div>
                <div class="testimonial">
                    <div class="testimonial-text">"Meu ROI foi de 420% no primeiro ano. Melhor investimento que já fiz para meu negócio. Agora tenho um sistema que vende 24/7."</div>
                    <div class="testimonial-author">- João Silva, Coach Empresarial</div>
                </div>
                <div class="testimonial">
                    <div class="testimonial-text">"Automatizei completamente meu funil de vendas. Hoje tenho mais tempo para focar na estratégia enquanto o sistema vende sozinho."</div>
                    <div class="testimonial-author">- Ana Costa, Infoprodutora</div>
                </div>
            </div>
        </div>
    </section>

    <section class="results-section">
        <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Números que Comprovam a Eficácia</h2>
            <p style="font-size: 1.2rem; opacity: 0.9;">Dados reais dos nossos clientes nos últimos 12 meses</p>
            
            <div class="results-grid">
                <div class="result-item">
                    <span class="result-number">340%</span>
                    <div class="result-label">Aumento médio nas vendas</div>
                </div>
                <div class="result-item">
                    <span class="result-number">R$ 50M</span>
                    <div class="result-label">Gerado pelos clientes</div>
                </div>
                <div class="result-item">
                    <span class="result-number">2.847</span>
                    <div class="result-label">Empresários transformados</div>
                </div>
                <div class="result-item">
                    <span class="result-number">90 dias</span>
                    <div class="result-label">Tempo médio para resultados</div>
                </div>
            </div>
        </div>
    </section>

    <section class="guarantee">
        <div class="container">
            <div class="guarantee-badge">Garantia Incondicional</div>
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">30 Dias de Garantia Total</h2>
            <p style="font-size: 1.3rem; opacity: 0.95; max-width: 600px; margin: 0 auto;">
                Se você não conseguir pelo menos 200% de aumento nas suas vendas em 90 dias, 
                devolvemos 100% do seu investimento sem perguntas.
            </p>
        </div>
    </section>

    <script>
        // Form tracking and validation
        document.getElementById('leadForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Track conversion
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead');
            }
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'generate_lead', {
                    'currency': 'BRL',
                    'value': 1997
                });
            }
            
            // Submit form data
            const formData = new FormData(this);
            
            fetch('/api/leads/capture', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/obrigado';
                } else {
                    alert('Erro ao processar. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao processar. Tente novamente.');
            });
        });
        
        // Scroll tracking
        let scrollTracked = false;
        window.addEventListener('scroll', function() {
            if (!scrollTracked && window.scrollY > window.innerHeight * 0.5) {
                scrollTracked = true;
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'ViewContent');
                }
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll', {
                        'percent_scrolled': 50
                    });
                }
            }
        });
    </script>
</body>
</html>`;
  }

  function calculatePackageSize(files: Record<string, string>): string {
    let totalSize = 0;
    Object.values(files).forEach(content => {
      totalSize += new Blob([content]).size;
    });
    
    const sizeInMB = totalSize / (1024 * 1024);
    return `${sizeInMB.toFixed(1)} MB`;
  }

  // Import IA Suprema Services and Advanced Modules
  const { iaSupremaServices } = await import('./ai-suprema-services');
  const { videoAIModule } = await import('./video-ai-module');
  const { trafficAIModule } = await import('./traffic-ai-module');

  // IA Board Suprema API Routes
  app.post("/api/ai/suprema/execute-module", async (req, res) => {
    try {
      const { moduleId, projectData, learningMode } = req.body;
      
      console.log(`🚀 IA Suprema - Executando módulo ${moduleId}`);
      
      const result = await iaSupremaServices.executeModule(moduleId, projectData, learningMode);
      
      res.json({
        success: result.success,
        data: result.data,
        explanation: result.explanation,
        estimatedImpact: result.estimatedImpact,
        moduleId,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro no módulo IA Suprema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do módulo IA',
        message: 'Módulo temporariamente indisponível',
        moduleId: req.body.moduleId
      });
    }
  });

  // IA Suprema - Execute full sequence
  app.post("/api/ai/suprema/execute-sequence", async (req, res) => {
    try {
      const { projectData, learningMode, customSequence } = req.body;
      
      const sequence = customSequence || [
        'ia-espia', 'ia-branding', 'ia-copywriting', 
        'ia-landing', 'ia-video', 'ia-trafego', 
        'ia-persuasao', 'ia-analytics'
      ];
      
      const results = [];
      
      for (const moduleId of sequence) {
        console.log(`🎯 Executando módulo ${moduleId} na sequência suprema`);
        
        const result = await iaSupremaServices.executeModule(moduleId, projectData, learningMode);
        results.push({
          moduleId,
          ...result,
          executedAt: new Date().toISOString()
        });
        
        // Update project data with results for next modules
        if (result.success) {
          projectData[moduleId] = result.data;
        }
      }
      
      res.json({
        success: true,
        results,
        completedModules: results.filter(r => r.success).length,
        totalModules: sequence.length,
        projectData: projectData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro na sequência IA Suprema:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na execução da sequência',
        message: 'Falha na execução automática'
      });
    }
  });

  // IA Suprema - Get module status
  app.get("/api/ai/suprema/modules", async (req, res) => {
    try {
      const modules = [
        {
          id: 'ia-espia',
          name: 'IA Espiã Suprema',
          description: 'Analisa concorrentes reais e extrai estratégias vencedoras',
          category: 'analise',
          estimatedTime: '2-3 min',
          available: true
        },
        {
          id: 'ia-branding',
          name: 'IA Branding Master',
          description: 'Cria nome, logo e identidade visual completa',
          category: 'criacao',
          estimatedTime: '3-4 min',
          available: true
        },
        {
          id: 'ia-copywriting',
          name: 'IA Copywriter Pro',
          description: 'Gera textos persuasivos baseados em dados reais',
          category: 'criacao',
          estimatedTime: '2-3 min',
          available: true
        },
        {
          id: 'ia-video',
          name: 'IA Vídeo Mestre',
          description: 'Cria vídeos completos com roteiro e edição',
          category: 'criacao',
          estimatedTime: '5-8 min',
          available: true
        },
        {
          id: 'ia-landing',
          name: 'IA Landing Page',
          description: 'Gera páginas de vendas com design otimizado',
          category: 'criacao',
          estimatedTime: '3-5 min',
          available: true
        },
        {
          id: 'ia-trafego',
          name: 'IA Tráfego Ultra',
          description: 'Cria campanhas para Meta Ads e Google Ads',
          category: 'marketing',
          estimatedTime: '4-6 min',
          available: true
        },
        {
          id: 'ia-analytics',
          name: 'IA Analytics+',
          description: 'Análise profunda e otimização contínua',
          category: 'otimizacao',
          estimatedTime: '2-3 min',
          available: true
        },
        {
          id: 'ia-persuasao',
          name: 'IA Persuasão Neural',
          description: 'Aplica gatilhos mentais específicos por nicho',
          category: 'otimizacao',
          estimatedTime: '3-4 min',
          available: true
        }
      ];
      
      res.json({
        modules,
        totalModules: modules.length,
        categories: ['analise', 'criacao', 'marketing', 'otimizacao'],
        systemStatus: 'operational'
      });
      
    } catch (error: any) {
      console.error('Erro ao obter módulos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao carregar módulos'
      });
    }
  });

  // Video AI Module Routes
  app.post("/api/ai/video/generate", async (req, res) => {
    try {
      const { produto, avatar, oferta, nicho, objetivo, formato, duracao } = req.body;
      
      console.log(`🎬 Video AI - Gerando roteiro para ${produto}`);
      
      const videoContent = await videoAIModule.generateVideoContent({
        produto,
        avatar,
        oferta,
        nicho,
        objetivo: objetivo || 'venda_direta',
        formato: formato || 'reels',
        duracao: duracao || '30s'
      });
      
      res.json({
        success: true,
        video: videoContent,
        moduleType: 'video-ai',
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro no Video AI:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na geração de vídeo',
        message: error.message
      });
    }
  });

  app.post("/api/ai/video/variations", async (req, res) => {
    try {
      const { baseVideo, count } = req.body;
      
      console.log(`🎬 Video AI - Gerando ${count} variações A/B`);
      
      const variations = await videoAIModule.generateVideoVariations(baseVideo, count);
      
      res.json({
        success: true,
        variations,
        count: variations.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro nas variações de vídeo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na geração de variações',
        message: error.message
      });
    }
  });

  app.post("/api/ai/video/analyze-competitors", async (req, res) => {
    try {
      const { nicho, produto } = req.body;
      
      console.log(`🕵️ Video AI - Analisando concorrentes em ${nicho}`);
      
      const analysis = await videoAIModule.analyzeCompetitorVideos(nicho, produto);
      
      res.json({
        success: true,
        analysis,
        nicho,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro na análise de concorrentes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na análise competitiva',
        message: error.message
      });
    }
  });

  // Traffic AI Module Routes
  app.post("/api/ai/traffic/generate", async (req, res) => {
    try {
      const { produto, avatar, oferta, nicho, orcamento, objetivo, plataforma, publico } = req.body;
      
      console.log(`📈 Traffic AI - Gerando campanha para ${plataforma}`);
      
      const campaigns = await trafficAIModule.generateTrafficCampaign({
        produto,
        avatar,
        oferta,
        nicho,
        orcamento: orcamento || 3000,
        objetivo: objetivo || 'vendas',
        plataforma: plataforma || 'meta',
        publico: publico || {
          idade: '25-45',
          genero: 'todos',
          interesses: ['empreendedorismo'],
          comportamentos: ['compradores online'],
          localizacao: 'Brasil'
        }
      });
      
      res.json({
        success: true,
        campaigns,
        totalCampaigns: campaigns.length,
        moduleType: 'traffic-ai',
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro no Traffic AI:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na geração de campanhas',
        message: error.message
      });
    }
  });

  app.post("/api/ai/traffic/analyze-performance", async (req, res) => {
    try {
      const { campaignData, actualMetrics } = req.body;
      
      console.log(`📊 Traffic AI - Analisando performance da campanha`);
      
      const analysis = await trafficAIModule.analyzeCampaignPerformance(campaignData, actualMetrics);
      
      res.json({
        success: true,
        analysis,
        insights: analysis.otimizacoes || [],
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro na análise de performance:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na análise de performance',
        message: error.message
      });
    }
  });

  app.post("/api/ai/traffic/spy-competitors", async (req, res) => {
    try {
      const { nicho, plataforma } = req.body;
      
      console.log(`🕵️ Traffic AI - Espionando anúncios em ${nicho} - ${plataforma}`);
      
      const spyAnalysis = await trafficAIModule.generateCompetitorAdsAnalysis(nicho, plataforma);
      
      res.json({
        success: true,
        spyData: spyAnalysis,
        nicho,
        plataforma,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Erro na espionagem de anúncios:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na análise competitiva',
        message: error.message
      });
    }
  });

  // Complete Export System
  app.post("/api/export/complete", async (req, res) => {
    try {
      const { projectName, projectData, includeVideo, includeTraffic } = req.body;
      
      console.log(`📦 Gerando export completo para: ${projectName}`);
      
      const { exportSystem } = await import('./export-system');
      
      const exportData = {
        projectName: projectName || 'Projeto IA Board',
        projectData,
        videoContent: includeVideo ? projectData.videoContent : undefined,
        trafficCampaigns: includeTraffic ? projectData.trafficCampaigns : undefined,
        moduleResults: projectData.moduleResults || [],
        createdAt: new Date()
      };
      
      const zipBuffer = await exportSystem.generateCompleteExport(exportData);
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${projectName}_export.zip"`);
      res.send(zipBuffer);
      
    } catch (error: any) {
      console.error('Erro no export completo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na geração do export',
        message: error.message
      });
    }
  });

  // Enhanced Workflow API - Integrates all AI modules
  app.post("/api/ai/workflow/complete", async (req, res) => {
    try {
      const { projectData, includeVideo, includeTraffic, mode } = req.body;
      
      console.log(`🚀 IA Board - Executando workflow completo em modo ${mode}`);
      
      const results: any = {
        projectData,
        modules: [],
        exports: {},
        timestamp: new Date().toISOString()
      };

      // Execute core IA Suprema modules
      const coreModules = ['ia-espia', 'ia-branding', 'ia-copywriting', 'ia-landing'];
      
      for (const moduleId of coreModules) {
        try {
          const moduleResult = await iaSupremaServices.executeModule(moduleId, projectData, mode === 'learning');
          results.modules.push({
            moduleId,
            success: moduleResult.success,
            data: moduleResult.data
          });
          
          if (moduleResult.success) {
            projectData[moduleId] = moduleResult.data;
          }
        } catch (error) {
          console.error(`Erro no módulo ${moduleId}:`, error);
        }
      }

      // Generate Video AI content if requested
      if (includeVideo && projectData.produto) {
        try {
          const videoContent = await videoAIModule.generateVideoContent({
            produto: projectData.produto,
            avatar: projectData.avatar || 'empreendedores',
            oferta: projectData.oferta || 'transformação garantida',
            nicho: projectData.nicho || 'desenvolvimento',
            objetivo: 'venda_direta',
            formato: 'reels',
            duracao: '30s'
          });
          
          results.modules.push({
            moduleId: 'video-ai',
            success: true,
            data: videoContent
          });
          
          results.exports.videoScript = videoContent;
        } catch (error) {
          console.error('Erro no Video AI:', error);
        }
      }

      // Generate Traffic AI campaigns if requested
      if (includeTraffic && projectData.produto) {
        try {
          const campaigns = await trafficAIModule.generateTrafficCampaign({
            produto: projectData.produto,
            avatar: projectData.avatar || 'empreendedores',
            oferta: projectData.oferta || 'transformação garantida',
            nicho: projectData.nicho || 'desenvolvimento',
            orcamento: 5000,
            objetivo: 'vendas',
            plataforma: 'todas',
            publico: {
              idade: '25-45',
              genero: 'todos',
              interesses: ['empreendedorismo', 'marketing digital'],
              comportamentos: ['compradores online'],
              localizacao: 'Brasil'
            }
          });
          
          results.modules.push({
            moduleId: 'traffic-ai',
            success: true,
            data: campaigns
          });
          
          results.exports.trafficCampaigns = campaigns;
        } catch (error) {
          console.error('Erro no Traffic AI:', error);
        }
      }

      // Generate complete export package
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add all generated content to ZIP
      zip.file("README.md", `# IA Board Suprema - Projeto Completo\n\nGerado em: ${new Date().toLocaleDateString('pt-BR')}\nMódulos executados: ${results.modules.length}\n\n## Conteúdo:\n- Análise estratégica\n- Copy persuasivo\n- Landing pages\n${includeVideo ? '- Roteiros de vídeo\n' : ''}${includeTraffic ? '- Campanhas de tráfego\n' : ''}`);

      // Add module results
      results.modules.forEach((module: any) => {
        if (module.success && module.data) {
          zip.file(`${module.moduleId}.json`, JSON.stringify(module.data, null, 2));
        }
      });

      // Add exports
      if (results.exports.videoScript) {
        zip.file("video-roteiro.json", JSON.stringify(results.exports.videoScript, null, 2));
      }

      if (results.exports.trafficCampaigns) {
        zip.file("campanhas-trafego.json", JSON.stringify(results.exports.trafficCampaigns, null, 2));
      }

      const zipBuffer = await zip.generateAsync({ type: 'buffer' });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="ia-board-suprema-completo.zip"');
      res.send(zipBuffer);

    } catch (error: any) {
      console.error('Erro no workflow completo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro na execução do workflow',
        message: error.message
      });
    }
  });

  // Furion AI Routes - Máquina Milionária
  app.post('/api/furion/processar', async (req: Request, res: Response) => {
    try {
      const { prompt, tipo, contexto, nicho, avatarCliente } = req.body;
      
      if (!prompt || !tipo) {
        return res.status(400).json({ 
          success: false, 
          error: 'Prompt e tipo são obrigatórios' 
        });
      }

      console.log(`🤖 Furion AI processando: ${tipo} - ${prompt.substring(0, 50)}...`);
      
      const resultado = await furionAI.processar({
        prompt,
        tipo,
        contexto,
        nicho,
        avatarCliente
      });

      res.json(resultado);
    } catch (error) {
      console.error('Erro no Furion AI:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro interno do Furion AI' 
      });
    }
  });

  // Método específico para criar produto completo
  app.post('/api/furion/criar-produto', async (req: Request, res: Response) => {
    try {
      const { ideiaProduto, nicho, avatarCliente, precoDesejado } = req.body;
      
      const resultado = await furionAI.processar({
        prompt: `Criar produto digital: ${ideiaProduto}. Preço target: ${precoDesejado || 'R$ 497-997'}`,
        tipo: 'produto',
        contexto: `Nicho: ${nicho}, Avatar: ${avatarCliente}`,
        nicho,
        avatarCliente
      });

      res.json({
        ...resultado,
        metodoCompleto: {
          fase1: 'Produto criado pelo Furion',
          fase2: 'IA configurada e funcionando', 
          fase3: 'Sistema de vendas estruturado',
          fase4: 'Campanhas de tráfego prontas',
          fase5: 'Estratégia de escala definida'
        }
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao criar produto' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateLandingPageHTML(productType: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productType} - Transforme Seu Negócio</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; }
        .cta-button { background: #ff6b35; color: white; padding: 20px 40px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>Transforme Seu Negócio em 60 Dias</h1>
            <p>Sistema comprovado de ${productType} que já gerou mais de R$ 10 milhões</p>
            <button class="cta-button">QUERO TRANSFORMAR MEU NEGÓCIO</button>
        </div>
    </section>
</body>
</html>`;
}

function generateThankYouPageHTML(productType: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Obrigado - ${productType}</title>
</head>
<body>
    <div style="text-align: center; padding: 50px;">
        <h1>Parabéns! Sua jornada começou</h1>
        <p>Verifique seu email para acessar o conteúdo exclusivo</p>
    </div>
</body>
</html>`;
}

function generateHTMLContent(funnel: any): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${funnel.name || 'Funil de Vendas'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        .step { margin: 30px 0; padding: 25px; border: 2px solid #e9ecef; border-radius: 12px; background: #fff; }
        .step-title { color: #333; font-size: 1.8em; margin-bottom: 15px; font-weight: bold; }
        .step-content { margin: 15px 0; line-height: 1.8; }
        .cta { background: #007bff; color: white; padding: 15px 30px; border-radius: 8px; display: inline-block; text-decoration: none; font-weight: bold; margin: 10px 0; }
        .design-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .recommendations { background: #e8f5e8; padding: 20px; border-radius: 10px; margin-top: 30px; }
        .conversion { background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${funnel.name || 'Funil de Vendas'}</h1>
            <p><strong>Produto:</strong> ${funnel.productType || 'Não especificado'}</p>
            <p><strong>Status:</strong> ${funnel.isCompleted ? 'Concluído' : 'Em desenvolvimento'}</p>
            <p><strong>Criado em:</strong> ${new Date(funnel.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
        </div>
        
        <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 10px;">Estrutura do Funil</h2>
        
        ${funnel.generatedContent?.steps?.map((step: any) => `
            <div class="step">
                <h3 class="step-title">Etapa ${step.stepNumber}: ${step.title}</h3>
                <p><strong>Descrição:</strong> ${step.description}</p>
                <div class="step-content">
                    <strong>Conteúdo:</strong><br>
                    ${step.content.replace(/\n/g, '<br>')}
                </div>
                <div class="cta">${step.cta}</div>
                <div class="design-info">
                    <strong>Design:</strong><br>
                    Layout: ${step.design?.layout || 'Padrão'}<br>
                    Cores: ${step.design?.colors?.join(', ') || 'Não especificado'}<br>
                    Elementos: ${step.design?.elements?.join(', ') || 'Não especificado'}
                </div>
            </div>
        `).join('') || '<p>Nenhum conteúdo de etapas disponível</p>'}
        
        ${funnel.generatedContent?.estimatedConversion ? `
            <div class="conversion">
                <h3>Taxa de Conversão Estimada</h3>
                <p style="font-size: 1.5em; font-weight: bold; color: #28a745;">${funnel.generatedContent.estimatedConversion}</p>
            </div>
        ` : ''}
        
        ${funnel.generatedContent?.recommendations?.length ? `
            <div class="recommendations">
                <h3 style="color: #155724;">Recomendações para Otimização</h3>
                <ul>
                    ${funnel.generatedContent.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        <div style="margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>Relatório gerado pelo IA Board V2 em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    </div>
</body>
</html>`;
}

function generatePDFContent(funnel: any): string {
  return `RELATÓRIO COMPLETO DO FUNIL DE VENDAS
${'='.repeat(50)}

INFORMAÇÕES GERAIS
${'-'.repeat(20)}
Nome: ${funnel.name || 'Não especificado'}
Produto/Serviço: ${funnel.productType || 'Não especificado'}
Status: ${funnel.isCompleted ? 'Concluído' : 'Em desenvolvimento'}
Data de criação: ${new Date(funnel.createdAt || Date.now()).toLocaleDateString('pt-BR')}
Última atualização: ${new Date(funnel.updatedAt || Date.now()).toLocaleDateString('pt-BR')}

DESCRIÇÃO DO FUNIL
${'-'.repeat(20)}
${funnel.generatedContent?.description || funnel.description || 'Descrição não disponível'}

ESTRUTURA DETALHADA DO FUNIL
${'-'.repeat(30)}
${funnel.generatedContent?.steps?.map((step: any) => `
ETAPA ${step.stepNumber}: ${step.title.toUpperCase()}
${'~'.repeat(40)}

Descrição da Etapa:
${step.description}

Conteúdo Detalhado:
${step.content}

Call-to-Action Principal:
"${step.cta}"

Especificações de Design:
- Layout: ${step.design?.layout || 'Não especificado'}
- Paleta de cores: ${step.design?.colors?.join(', ') || 'Não especificado'}
- Elementos principais: ${step.design?.elements?.join(', ') || 'Não especificado'}

${'_'.repeat(50)}
`).join('') || 'Estrutura de etapas não disponível'}

ANÁLISE DE PERFORMANCE
${'-'.repeat(25)}
Taxa de conversão estimada: ${funnel.generatedContent?.estimatedConversion || 'Não calculada'}

RECOMENDAÇÕES ESTRATÉGICAS
${'-'.repeat(30)}
${funnel.generatedContent?.recommendations?.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n\n') || 'Nenhuma recomendação disponível'}

PRÓXIMOS PASSOS
${'-'.repeat(18)}
1. Implementar as etapas do funil conforme especificado
2. Realizar testes A/B nos elementos principais
3. Monitorar métricas de conversão
4. Otimizar baseado nos resultados obtidos
5. Expandir o funil com novas etapas se necessário

${'='.repeat(50)}
Relatório técnico gerado automaticamente pelo IA Board V2
Data/Hora: ${new Date().toLocaleString('pt-BR')}
${'='.repeat(50)}`;
}

function generateTextContent(funnel: any): string {
  return `FUNIL: ${funnel.name || 'Sem nome'}

INFORMAÇÕES BÁSICAS:
- Produto: ${funnel.productType || 'Não especificado'}
- Status: ${funnel.isCompleted ? 'Concluído' : 'Em desenvolvimento'}
- Criado: ${new Date(funnel.createdAt || Date.now()).toLocaleDateString('pt-BR')}

DESCRIÇÃO:
${funnel.generatedContent?.description || funnel.description || 'Sem descrição'}

ESTRUTURA DO FUNIL:
${funnel.generatedContent?.steps?.map((step: any) => `
${step.stepNumber}. ${step.title}
   Descrição: ${step.description}
   CTA: "${step.cta}"
   Layout: ${step.design?.layout || 'Padrão'}
`).join('') || 'Estrutura não disponível'}

CONVERSÃO ESTIMADA: ${funnel.generatedContent?.estimatedConversion || 'Não calculada'}

RECOMENDAÇÕES:
${funnel.generatedContent?.recommendations?.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n') || 'Nenhuma recomendação'}

---
Gerado em: ${new Date().toLocaleString('pt-BR')}
IA Board V2`;
}
