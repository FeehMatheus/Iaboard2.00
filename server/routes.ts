import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { furionAI } from "./furion-ai-system";
import { furionSupremaEngine } from "./furion-suprema-engine";
import { exportSystem } from "./export-system";
import { videoCreationService } from "./video-creation-service";
import { contentCreationService } from "./content-creation-service";
import { processarTicketMaquinaMilionaria, getEtapasProcessamento } from "./maquina-milionaria-ai";
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

  // Registro de usuário
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { firstName, lastName, email, password, plan } = req.body;
      
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }

      // Create user
      const newUser = await storage.createUser({
        firstName,
        lastName,
        email,
        password, // In production, hash the password
        plan: plan || 'starter',
        subscriptionStatus: 'trial',
        furionCredits: plan === 'enterprise' ? 10000 : plan === 'professional' ? 5000 : 1000
      });

      res.json({
        success: true,
        user: {
          id: newUser.id,
          name: `${newUser.firstName} ${newUser.lastName}`,
          email: newUser.email,
          plan: newUser.plan,
          credits: newUser.furionCredits
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Login de usuário
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // In production, verify hashed password
      // For now, simple comparison
      if (password !== user.password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          plan: user.plan,
          credits: user.furionCredits
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Obter dados do usuário
  app.get('/api/auth/user', authenticateDemo, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        plan: user.plan,
        credits: user.furionCredits
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Login de usuário
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
      }

      // Simulação de autenticação (em produção, verificar hash da senha)
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      // Retornar dados do usuário
      const userWithoutPassword = user;
      res.json({ 
        success: true, 
        user: userWithoutPassword,
        message: "Login realizado com sucesso"
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Registro de usuário
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, plan } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
      }

      // Verificar se usuário já existe
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já cadastrado com este email" });
      }

      // Criar novo usuário
      const newUser = await storage.createUser({
        name,
        email,
        password, // Em produção, fazer hash da senha
        plan: plan || 'pro',
        subscriptionStatus: 'active',
        furionCredits: plan === 'premium' ? 1000 : plan === 'pro' ? 500 : 100,
      });

      // Retornar dados do usuário
      const userWithoutPassword = newUser;
      res.json({ 
        success: true, 
        user: userWithoutPassword,
        message: "Conta criada com sucesso"
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

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
  // ROTAS DE CRIAÇÃO DE VÍDEOS
  // ================================
  
  // Criar vídeo com IA
  app.post('/api/videos/create', authenticateDemo, async (req, res) => {
    try {
      const { script, style, duration, voiceType, resolution, background, music } = req.body;
      
      if (!script) {
        return res.status(400).json({ message: "Script é obrigatório" });
      }

      const videoResult = await videoCreationService.createVideo({
        script,
        style: style || 'presentation',
        duration: duration || 60,
        voiceType: voiceType || 'neutral',
        resolution: resolution || '1080p',
        background,
        music: music || false
      });

      res.json(videoResult);
    } catch (error) {
      console.error('Erro ao criar vídeo:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Gerar script para vídeo
  app.post('/api/videos/generate-script', authenticateDemo, async (req, res) => {
    try {
      const { prompt, type } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt é obrigatório" });
      }

      const script = await videoCreationService.generateVideoScript(prompt, type || 'explicativo');
      
      res.json({ script });
    } catch (error) {
      console.error('Erro ao gerar script:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Status do vídeo
  app.get('/api/videos/:videoId/status', authenticateDemo, async (req, res) => {
    try {
      const { videoId } = req.params;
      const status = await videoCreationService.getVideoStatus(videoId);
      res.json(status);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // ================================
  // ROTAS DE CRIAÇÃO DE CONTEÚDO
  // ================================
  
  // Criar conteúdo com IA
  app.post('/api/content/create', authenticateDemo, async (req, res) => {
    try {
      const { type, prompt, targetAudience, product, tone, length } = req.body;
      
      if (!type || !prompt) {
        return res.status(400).json({ message: "Tipo e prompt são obrigatórios" });
      }

      const contentResult = await contentCreationService.createContent({
        type,
        prompt,
        targetAudience,
        product,
        tone: tone || 'professional',
        length: length || 'medium'
      });

      res.json(contentResult);
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Otimizar conteúdo
  app.post('/api/content/optimize', authenticateDemo, async (req, res) => {
    try {
      const { content, metrics } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Conteúdo é obrigatório" });
      }

      const optimizedContent = await contentCreationService.optimizeContent(content, metrics || {});
      
      res.json({ content: optimizedContent });
    } catch (error) {
      console.error('Erro ao otimizar conteúdo:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
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
  // ROTAS THIAGO FINCH AI SYSTEM
  // ================================

  // Processar requisição do sistema Thiago Finch AI
  app.post('/api/thiago-ai/process', async (req, res) => {
    try {
      const { prompt, type } = req.body;
      
      // Gerar ID único para o ticket
      const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simular processamento avançado baseado no tipo
      let result = {};
      
      switch (type) {
        case 'video':
          result = {
            ticketId,
            type: 'video',
            videoUrl: `https://storage.thiagofinch.ai/${ticketId}.mp4`,
            thumbnailUrl: `https://storage.thiagofinch.ai/${ticketId}_thumb.jpg`,
            duration: '120s',
            quality: 'HD 1080p',
            format: 'MP4',
            fileSize: '45MB',
            script: `# Script Gerado para: ${prompt}\n\nIntrodução impactante que prende a atenção nos primeiros 3 segundos...\n\nDesenvolvimento persuasivo com gatilhos mentais específicos...\n\nConclusão com call-to-action irresistível...`,
            metadata: {
              scenes: 8,
              transitions: 12,
              effects: 15,
              audioTracks: 3
            }
          };
          break;
          
        case 'copy':
          result = {
            ticketId,
            type: 'copy',
            headline: `${prompt} - Transforme Sua Vida Hoje!`,
            subheadline: 'A solução definitiva que você estava procurando',
            bodyText: `# Copy Persuasiva Gerada\n\n## Problema Identificado\n${prompt}\n\n## Nossa Solução Única\nApresentamos a metodologia revolucionária...\n\n## Benefícios Exclusivos\n✅ Resultados em 30 dias\n✅ Garantia total\n✅ Suporte 24/7\n\n## Chamada para Ação\nNÃO PERCA ESTA OPORTUNIDADE ÚNICA!`,
            wordCount: 847,
            tone: 'Persuasivo',
            cta: 'QUERO TRANSFORMAR MINHA VIDA AGORA!'
          };
          break;
          
        case 'design':
          result = {
            ticketId,
            type: 'design',
            designUrl: `https://storage.thiagofinch.ai/${ticketId}_design.png`,
            previewUrl: `https://storage.thiagofinch.ai/${ticketId}_preview.jpg`,
            format: 'PNG/PSD',
            dimensions: '1920x1080',
            colorPalette: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2'],
            elements: ['Logo', 'Banner', 'Social Media Kit', 'Business Card']
          };
          break;
          
        case 'analysis':
          result = {
            ticketId,
            type: 'analysis',
            reportUrl: `https://storage.thiagofinch.ai/${ticketId}_report.pdf`,
            marketSize: 'R$ 2.8 bilhões',
            competition: 'Moderada',
            opportunity: 'Alta',
            insights: [
              'Mercado em crescimento de 34% ao ano',
              'Lacuna identificada no segmento premium',
              'Público-alvo altamente engajado',
              'Oportunidade de first-mover advantage'
            ],
            recommendations: [
              'Focar no segmento premium',
              'Implementar estratégia omnichannel',
              'Investir em conteúdo educativo',
              'Desenvolver parcerias estratégicas'
            ]
          };
          break;
          
        case 'campaign':
          result = {
            ticketId,
            type: 'campaign',
            campaignName: `Campanha: ${prompt}`,
            platforms: ['Meta Ads', 'Google Ads', 'TikTok Ads'],
            budget: 'R$ 5.000/mês',
            expectedROAS: '4.2x',
            audienceSize: '2.3M pessoas',
            creatives: [
              'Video Ad 1 - Hook emocional',
              'Carousel - Benefícios',
              'Story Ad - Testimonial',
              'Display - Retargeting'
            ],
            targeting: {
              age: '25-45',
              interests: ['Empreendedorismo', 'Marketing Digital'],
              behaviors: ['Compradores Online'],
              location: 'Brasil'
            }
          };
          break;
          
        default:
          result = {
            ticketId,
            type: 'general',
            content: `Processamento concluído para: ${prompt}`,
            status: 'Sucesso'
          };
      }

      // Simular delay de processamento realístico
      await new Promise(resolve => setTimeout(resolve, 1500));

      res.json({
        success: true,
        ticketId,
        message: 'Processamento concluído com sucesso',
        ...result
      });
      
    } catch (error) {
      console.error('Erro no Thiago Finch AI:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Falha no processamento da IA',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  });

  // ================================
  // ROTAS DE VÍDEOS COM IA
  // ================================

  // Gerar script de vídeo
  app.post('/api/videos/generate-script', async (req, res) => {
    try {
      const { prompt, type } = req.body;
      
      // Gerar script inteligente
      const script = `# Script Profissional Gerado\n\n## Introdução (0-15s)\n"${prompt}" - Esta é a solução que você estava procurando!\n\n## Desenvolvimento (15-45s)\nApresentamos a metodologia revolucionária que já transformou milhares de vidas...\n\n## Prova Social (45-60s)\nVeja os resultados reais dos nossos clientes...\n\n## Call-to-Action (60-75s)\nNão perca esta oportunidade única! Clique agora e transforme sua realidade!`;

      res.json({
        success: true,
        script,
        metadata: {
          wordCount: script.split(' ').length,
          estimatedDuration: Math.ceil(script.split(' ').length / 150) + ' minutos',
          tone: 'profissional'
        }
      });
    } catch (error) {
      console.error('Erro ao gerar script:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Falha ao gerar script do vídeo' 
      });
    }
  });

  // Criar vídeo com IA
  app.post('/api/videos/create', async (req, res) => {
    try {
      const { script, style, duration, voiceType, resolution, music } = req.body;
      
      // Simular criação de vídeo com dados realísticos
      const videoId = `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const thumbnailUrl = `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`;
      const videoUrl = `https://storage.googleapis.com/furion-videos/${videoId}.mp4`;
      const downloadUrl = `${videoUrl}?download=true`;
      
      // Simular processamento realístico
      await new Promise(resolve => setTimeout(resolve, 1500));

      res.json({
        success: true,
        videoId,
        status: 'Processado',
        videoUrl,
        thumbnailUrl,
        downloadUrl,
        metadata: {
          duration: duration + 's',
          fileSize: Math.round((duration * 2.5)) + 'MB',
          resolution,
          style,
          voiceType,
          hasMusic: music,
          createdAt: new Date().toISOString(),
          processingTime: '1.5s'
        }
      });
    } catch (error) {
      console.error('Erro ao criar vídeo:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Falha ao criar vídeo' 
      });
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

  // ================================
  // MÁQUINA MILIONÁRIA API ROUTES
  // ================================

  // Criar ticket no sistema Máquina Milionária
  app.post('/api/maquina-milionaria/create-ticket', async (req, res) => {
    try {
      const { titulo, descricao, tipo } = req.body;
      
      if (!titulo || !descricao || !tipo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const creditsMap = {
        video: 15,
        copy: 8,
        design: 12,
        analise: 10,
        campanha: 20,
        funil: 25,
        estrategia: 30
      };

      const ticketId = Date.now().toString();
      const creditosNecessarios = creditsMap[tipo as keyof typeof creditsMap] || 10;

      // Processar com IA real em background
      setTimeout(async () => {
        try {
          const resultado = await processarTicketMaquinaMilionaria(tipo, titulo, descricao);
          console.log('Ticket Máquina Milionária processado:', ticketId, resultado);
        } catch (error) {
          console.error('Erro ao processar ticket:', error);
        }
      }, Math.random() * 30000 + 10000);

      res.json({
        ticketId,
        status: 'processando',
        creditosUsados: creditosNecessarios,
        etapas: getEtapasProcessamento(tipo)
      });
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Buscar status do ticket
  app.get('/api/maquina-milionaria/ticket/:id', async (req, res) => {
    try {
      const { id } = req.params;
      res.json({
        id,
        status: 'processando',
        progresso: Math.floor(Math.random() * 100)
      });
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Processar IA avançada
  app.post('/api/maquina-milionaria/process-ai', async (req, res) => {
    try {
      const { tipo, prompt, titulo } = req.body;
      
      const resultado = await processarTicketMaquinaMilionaria(tipo, titulo, prompt);
      
      res.json({
        success: true,
        resultado,
        ticketId: Date.now().toString()
      });
    } catch (error) {
      console.error('Erro no processamento IA:', error);
      res.status(500).json({ error: 'Erro no processamento da IA' });
    }
  });

  // ================================
  // FURION.AI API ROUTES
  // ================================

  // Processar projeto com FURION
  app.post('/api/furion/process', async (req, res) => {
    try {
      const { tipo, prompt, titulo } = req.body;
      
      if (!tipo || !prompt) {
        return res.status(400).json({ error: 'Tipo e prompt são obrigatórios' });
      }

      const resultado = await furionAI.processar({
        tipo,
        prompt,
        titulo,
        contexto: 'Máquina Milionária - Sistema Premium'
      });

      res.json({
        success: true,
        resultado
      });
    } catch (error) {
      console.error('Erro no processamento FURION:', error);
      res.status(500).json({ error: 'Erro no processamento da IA' });
    }
  });

  // Obter estatísticas do usuário
  app.get('/api/furion/stats', async (req, res) => {
    try {
      res.json({
        projectsCreated: 47,
        projectsCompleted: 42,
        creditsUsed: 1853,
        creditsRemaining: 2847,
        successRate: 89.4
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Exportar projeto
  app.post('/api/furion/export/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      const { format } = req.body;

      // Simular exportação
      const exportData = {
        projectId,
        format,
        downloadUrl: `/downloads/project-${projectId}.${format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

      res.json({
        success: true,
        export: exportData
      });
    } catch (error) {
      console.error('Erro na exportação:', error);
      res.status(500).json({ error: 'Erro na exportação' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}