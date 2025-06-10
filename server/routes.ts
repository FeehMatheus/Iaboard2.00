import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { furionAI } from "./furion-ai-system";
import { furionSupremaEngine } from "./furion-suprema-engine";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware para simular autenticação (usuário demo)
  const authenticateDemo = (req: any, res: any, next: any) => {
    req.user = { id: "demo-user" };
    next();
  };

  // ================================
  // ROTAS DE USUÁRIO E AUTENTICAÇÃO
  // ================================

  // Obter dados do usuário atual
  app.get('/api/user', authenticateDemo, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ================================
  // ROTAS DE PROJETOS
  // ================================

  // Listar projetos do usuário
  app.get('/api/projects', authenticateDemo, async (req: any, res) => {
    try {
      const projects = await storage.getUserProjects(req.user.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Criar novo projeto
  app.post('/api/projects', authenticateDemo, async (req: any, res) => {
    try {
      const projectSchema = z.object({
        name: z.string().min(1),
        type: z.string().min(1),
        data: z.any().optional(),
      });

      const validatedData = projectSchema.parse(req.body);
      
      const project = await storage.createProject({
        ...validatedData,
        userId: req.user.id,
        phase: 1,
        status: "active",
        data: validatedData.data || {},
        furionResults: {},
      });

      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Obter projeto específico
  app.get('/api/projects/:id', authenticateDemo, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Atualizar fase do projeto
  app.put('/api/projects/:id/phase', authenticateDemo, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { phase } = req.body;
      
      if (typeof phase !== 'number' || phase < 1 || phase > 5) {
        return res.status(400).json({ message: "Invalid phase number" });
      }
      
      const project = await storage.getProject(projectId);
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updatedProject = await storage.updateProjectPhase(projectId, phase);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project phase:", error);
      res.status(500).json({ message: "Failed to update project phase" });
    }
  });

  // ================================
  // ROTAS DO FURION.AI
  // ================================

  // Processar solicitação do Furion.AI Suprema
  app.post('/api/furion/processar-supremo', authenticateDemo, async (req: any, res) => {
    try {
      const furionSchema = z.object({
        tipo: z.enum(['produto', 'copy', 'anuncio', 'funil', 'estrategia', 'landing', 'vsl', 'email']),
        prompt: z.string().min(1),
        nicho: z.string().optional(),
        avatarCliente: z.string().optional(),
        orcamento: z.string().optional(),
        objetivo: z.string().optional(),
        tonalidade: z.enum(['profissional', 'casual', 'persuasiva', 'urgente', 'exclusiva']).optional(),
        complexidade: z.enum(['basico', 'intermediario', 'avancado', 'supremo']).optional(),
        sistemInfiniteBoard: z.boolean().optional(),
        configuracaoAvancada: z.object({
          gerarQuadros: z.boolean().optional(),
          incluirRecursos: z.boolean().optional(),
          formatoSaida: z.enum(['supremo', 'padrao']).optional(),
          modulosAtivos: z.array(z.string()).optional(),
        }).optional(),
      });

      const validatedData = furionSchema.parse(req.body);
      
      // Verificar créditos do usuário
      const user = await storage.getUser(req.user.id);
      if (!user || (user.furionCredits || 0) <= 0) {
        return res.status(402).json({ 
          message: "Insufficient Furion credits",
          creditsRemaining: user?.furionCredits || 0 
        });
      }

      console.log(`🧠 Furion Suprema - Processando: ${validatedData.tipo} (Complexidade: ${validatedData.complexidade || 'supremo'})`);
      
      // Processar com Furion Suprema Engine
      const resultado = await furionSupremaEngine.processarSupremo(validatedData);
      
      // Salvar sessão do Furion
      await storage.createFurionSession({
        userId: req.user.id,
        type: validatedData.tipo,
        prompt: validatedData.prompt,
        response: resultado,
        metadata: {
          nicho: validatedData.nicho,
          avatarCliente: validatedData.avatarCliente,
          orcamento: validatedData.orcamento,
          complexidade: validatedData.complexidade,
          sistemInfiniteBoard: validatedData.sistemInfiniteBoard,
          configuracaoAvancada: validatedData.configuracaoAvancada,
        },
        creditsUsed: validatedData.complexidade === 'supremo' ? 3 : 1,
      });

      // Atualizar créditos do usuário
      const creditsUsed = validatedData.complexidade === 'supremo' ? 3 : 1;
      await storage.updateUserCredits(req.user.id, (user.furionCredits || 0) - creditsUsed);

      res.json(resultado);
    } catch (error) {
      console.error("Error processing Furion Suprema request:", error);
      res.status(500).json({ 
        message: "Failed to process Furion Suprema request",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Processar solicitação do Furion.AI básico
  app.post('/api/furion/processar', authenticateDemo, async (req: any, res) => {
    try {
      const furionSchema = z.object({
        tipo: z.enum(['produto', 'copy', 'anuncio', 'funil', 'estrategia', 'landing', 'vsl', 'email']),
        prompt: z.string().min(1),
        nicho: z.string().optional(),
        avatarCliente: z.string().optional(),
        orcamento: z.string().optional(),
        contexto: z.any().optional(),
      });

      const validatedData = furionSchema.parse(req.body);
      
      // Verificar créditos do usuário
      const user = await storage.getUser(req.user.id);
      if (!user || (user.furionCredits || 0) <= 0) {
        return res.status(402).json({ 
          message: "Insufficient Furion credits",
          creditsRemaining: user?.furionCredits || 0 
        });
      }

      console.log(`🧠 Furion.AI - Processando solicitação: ${validatedData.tipo}`);
      
      // Processar com Furion.AI
      const resultado = await furionAI.processar(validatedData);
      
      // Salvar sessão do Furion
      await storage.createFurionSession({
        userId: req.user.id,
        type: validatedData.tipo,
        prompt: validatedData.prompt,
        response: resultado,
        metadata: {
          nicho: validatedData.nicho,
          avatarCliente: validatedData.avatarCliente,
          orcamento: validatedData.orcamento,
        },
        creditsUsed: 1,
      });

      // Atualizar créditos do usuário
      await storage.updateUserCredits(req.user.id, (user.furionCredits || 0) - 1);

      res.json(resultado);
    } catch (error) {
      console.error("Error processing Furion request:", error);
      res.status(500).json({ 
        message: "Failed to process Furion request",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Obter histórico de sessões do Furion
  app.get('/api/furion/sessions', authenticateDemo, async (req: any, res) => {
    try {
      const sessions = await storage.getUserFurionSessions(req.user.id);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching Furion sessions:", error);
      res.status(500).json({ message: "Failed to fetch Furion sessions" });
    }
  });

  // ================================
  // ROTAS DE CAMPANHAS
  // ================================

  // Listar campanhas do usuário
  app.get('/api/campaigns', authenticateDemo, async (req: any, res) => {
    try {
      const campaigns = await storage.getUserCampaigns(req.user.id);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Criar nova campanha
  app.post('/api/campaigns', authenticateDemo, async (req: any, res) => {
    try {
      const campaignSchema = z.object({
        projectId: z.number(),
        name: z.string().min(1),
        type: z.string().min(1),
        platform: z.string().optional(),
        budget: z.string().optional(),
        data: z.any().optional(),
      });

      const validatedData = campaignSchema.parse(req.body);
      
      // Verificar se o projeto pertence ao usuário
      const project = await storage.getProject(validatedData.projectId);
      if (!project || project.userId !== req.user.id) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const campaign = await storage.createCampaign({
        ...validatedData,
        userId: req.user.id,
        status: "draft",
        data: validatedData.data || {},
        results: {},
      });

      res.json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  // ================================
  // ROTAS DE ANALYTICS
  // ================================

  // Registrar evento de analytics
  app.post('/api/analytics', authenticateDemo, async (req: any, res) => {
    try {
      const analyticsSchema = z.object({
        event: z.string().min(1),
        projectId: z.number().optional(),
        campaignId: z.number().optional(),
        data: z.any().optional(),
        value: z.string().optional(),
      });

      const validatedData = analyticsSchema.parse(req.body);
      
      const analytics = await storage.logAnalytics({
        ...validatedData,
        userId: req.user.id,
        data: validatedData.data || {},
      });

      res.json(analytics);
    } catch (error) {
      console.error("Error logging analytics:", error);
      res.status(500).json({ message: "Failed to log analytics" });
    }
  });

  // Obter analytics do usuário
  app.get('/api/analytics', authenticateDemo, async (req: any, res) => {
    try {
      const analytics = await storage.getUserAnalytics(req.user.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // ================================
  // ROTAS DE PAGAMENTO
  // ================================

  // Criar sessão de pagamento
  app.post('/api/payments/create-session', authenticateDemo, async (req: any, res) => {
    try {
      const paymentSchema = z.object({
        planType: z.enum(['basic', 'pro', 'premium']),
        installments: z.number().min(1).max(12).optional(),
      });

      const validatedData = paymentSchema.parse(req.body);
      
      // Preços dos planos (12x R$309,96 = R$3.719,52 total)
      const planPrices = {
        basic: { total: 1997, installments: 12, perInstallment: 166.41 },
        pro: { total: 2997, installments: 12, perInstallment: 249.75 },
        premium: { total: 3719.52, installments: 12, perInstallment: 309.96 },
      };

      const plan = planPrices[validatedData.planType];
      const installments = validatedData.installments || 12;
      const amount = plan.total / installments;

      const payment = await storage.createPayment({
        userId: req.user.id,
        amount: amount.toFixed(2),
        currency: "BRL",
        status: "pending",
        method: "card",
        planType: validatedData.planType,
        installments,
        metadata: {
          planDetails: plan,
          createdFrom: "web_interface"
        },
      });

      // Em uma implementação real, aqui você criaria a sessão no Stripe
      // Por ora, vamos simular um sucesso
      setTimeout(async () => {
        try {
          await storage.updatePaymentStatus(payment.id, "completed");
          
          // Atualizar plano do usuário
          const user = await storage.getUser(req.user.id);
          if (user) {
            await storage.upsertUser({
              ...user,
              plan: validatedData.planType,
              subscriptionStatus: "active",
              furionCredits: (user.furionCredits || 0) + 100, // Adicionar créditos
            });
          }
        } catch (error) {
          console.error("Error processing payment:", error);
        }
      }, 2000);

      res.json({
        paymentId: payment.id,
        amount: amount.toFixed(2),
        currency: "BRL",
        installments,
        status: "pending",
        message: "Payment session created successfully"
      });
    } catch (error) {
      console.error("Error creating payment session:", error);
      res.status(500).json({ message: "Failed to create payment session" });
    }
  });

  // Listar pagamentos do usuário
  app.get('/api/payments', authenticateDemo, async (req: any, res) => {
    try {
      const payments = await storage.getUserPayments(req.user.id);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // ================================
  // ROTAS FURION.AI
  // ================================

  // Processar requisição do Furion.AI
  app.post('/api/furion/processar', async (req, res) => {
    try {
      const { prompt, tipo, nicho, avatarCliente, orcamento } = req.body;
      
      const furionRequest = {
        prompt,
        tipo,
        nicho,
        avatarCliente,
        orcamento,
      };

      const result = await furionAI.processar(furionRequest);
      res.json(result);
    } catch (error) {
      console.error('Erro no Furion.AI:', error);
      res.status(500).json({ 
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  });

  // ================================
  // ROTAS DE RECURSOS E MATERIAIS
  // ================================

  // Obter materiais de uma fase específica
  app.get('/api/materials/phase/:phase', authenticateDemo, async (req: any, res) => {
    try {
      const phase = parseInt(req.params.phase);
      
      if (phase < 1 || phase > 5) {
        return res.status(400).json({ message: "Invalid phase number" });
      }

      // Materiais simulados para cada fase
      const materials = {
        1: [
          { name: "Guia de Boas-vindas", type: "pdf", url: "/materials/phase1/welcome-guide.pdf" },
          { name: "Checklist Inicial", type: "pdf", url: "/materials/phase1/initial-checklist.pdf" },
          { name: "Template de Planejamento", type: "xlsx", url: "/materials/phase1/planning-template.xlsx" },
        ],
        2: [
          { name: "Manual Furion.AI", type: "pdf", url: "/materials/phase2/furion-manual.pdf" },
          { name: "Templates de Produto", type: "zip", url: "/materials/phase2/product-templates.zip" },
          { name: "Exemplos de Sucesso", type: "pdf", url: "/materials/phase2/success-examples.pdf" },
        ],
        3: [
          { name: "Templates de Landing Page", type: "zip", url: "/materials/phase3/landing-templates.zip" },
          { name: "Guia de Funis", type: "pdf", url: "/materials/phase3/funnel-guide.pdf" },
          { name: "Scripts de Copy", type: "pdf", url: "/materials/phase3/copy-scripts.pdf" },
        ],
        4: [
          { name: "Manual Meta Ads", type: "pdf", url: "/materials/phase4/meta-ads-manual.pdf" },
          { name: "Templates de Anúncios", type: "psd", url: "/materials/phase4/ad-templates.psd" },
          { name: "Calculadora de ROI", type: "xlsx", url: "/materials/phase4/roi-calculator.xlsx" },
        ],
        5: [
          { name: "Guia de Escala", type: "pdf", url: "/materials/phase5/scale-guide.pdf" },
          { name: "Dashboard de Métricas", type: "xlsx", url: "/materials/phase5/metrics-dashboard.xlsx" },
          { name: "Automações Avançadas", type: "pdf", url: "/materials/phase5/advanced-automations.pdf" },
        ],
      };

      res.json(materials[phase as keyof typeof materials] || []);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });

  // ================================
  // ROTAS DE DASHBOARD E ESTATÍSTICAS
  // ================================

  // Obter estatísticas do dashboard
  app.get('/api/dashboard/stats', authenticateDemo, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      const projects = await storage.getUserProjects(req.user.id);
      const campaigns = await storage.getUserCampaigns(req.user.id);
      const analytics = await storage.getUserAnalytics(req.user.id);
      const furionSessions = await storage.getUserFurionSessions(req.user.id);

      const stats = {
        user: {
          plan: user?.plan || 'free',
          furionCredits: user?.furionCredits || 0,
          subscriptionStatus: user?.subscriptionStatus || 'inactive',
        },
        projects: {
          total: projects.length,
          active: projects.filter(p => p.status === 'active').length,
          completed: projects.filter(p => p.phase === 5).length,
        },
        campaigns: {
          total: campaigns.length,
          active: campaigns.filter(c => c.status === 'active').length,
          draft: campaigns.filter(c => c.status === 'draft').length,
        },
        furion: {
          totalSessions: furionSessions.length,
          creditsUsed: furionSessions.reduce((sum, s) => sum + (s.creditsUsed || 0), 0),
          lastUsed: furionSessions[0]?.createdAt || null,
        },
        analytics: {
          totalEvents: analytics.length,
          thisMonth: analytics.filter(a => {
            const eventDate = new Date(a.createdAt || new Date());
            const now = new Date();
            return eventDate.getMonth() === now.getMonth() && 
                   eventDate.getFullYear() === now.getFullYear();
          }).length,
        },
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // ================================
  // ROTAS DE SAÚDE E INFORMAÇÕES
  // ================================

  // Status da API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      services: {
        furionAI: 'operational',
        storage: 'operational',
        analytics: 'operational',
      }
    });
  });

  // Informações do sistema
  app.get('/api/info', (req, res) => {
    res.json({
      name: 'Máquina Milionária API',
      version: '2.0.0',
      description: 'API completa para a plataforma Máquina Milionária',
      features: [
        'Sistema Furion.AI completo',
        'Gestão de projetos e fases',
        'Campanhas de marketing',
        'Analytics e métricas',
        'Sistema de pagamentos',
        'Dashboard interativo',
      ],
      endpoints: {
        furion: '/api/furion/processar',
        projects: '/api/projects',
        campaigns: '/api/campaigns',
        analytics: '/api/analytics',
        payments: '/api/payments',
        dashboard: '/api/dashboard/stats',
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}