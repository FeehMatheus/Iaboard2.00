import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./memory-storage";
import { z } from "zod";

// Simple AI service for processing requests
class AIService {
  static async generateContent(type: string, prompt: string): Promise<any> {
    // Simulate AI processing with realistic content
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const responses = {
      copy: {
        headline: "Transforme Sua Vida com Esta Oportunidade Única",
        subheadline: "Descubra os segredos que apenas 1% das pessoas conhecem para alcançar sucesso extraordinário",
        body: `Você já se perguntou por que algumas pessoas conseguem resultados incríveis enquanto outras lutam constantemente?

A resposta está nos métodos e estratégias que você está prestes a descobrir.

Durante anos, estudei e apliquei as técnicas mais eficazes...

[BENEFÍCIO 1] - Resultados em tempo recorde
[BENEFÍCIO 2] - Sistema comprovado
[BENEFÍCIO 3] - Garantia de satisfação

Não deixe essa oportunidade passar. Clique no botão abaixo e garante sua vaga agora!`,
        cta: "QUERO TRANSFORMAR MINHA VIDA AGORA"
      },
      vsl: {
        script: `HOOK (0-15s):
"Se você tem apenas 47 minutos livres, eu vou te mostrar como pessoas comuns estão conquistando resultados extraordinários..."

IDENTIFICAÇÃO DO PROBLEMA (15s-2min):
Você já percebeu que...
- Trabalha muito mas os resultados não vêm
- Outras pessoas conseguem o que você quer
- Parece que existe um "segredo" que você não conhece

APRESENTAÇÃO DA SOLUÇÃO (2-8min):
O que eu descobri vai mudar tudo...
[Contar história pessoal]
[Mostrar prova social]
[Explicar o método]

OFERTA (8-12min):
Por apenas R$ 297 (12x de R$ 29,70)
Você terá acesso completo ao sistema...

CHAMADA PARA AÇÃO:
Clique no botão abaixo AGORA e garanta sua vaga!`,
        duration: "12 minutos",
        hooks: ["Attention grabber inicial", "Problema específico", "Solução única"]
      },
      ads: {
        headline: "🚀 Descubra o Método Que Está Mudando Vidas",
        text: "Pessoas comuns usando esta estratégia simples para alcançar resultados extraordinários. Quer saber como? Clique e descubra!",
        cta: "Quero Saber Mais",
        targeting: "Interessados em desenvolvimento pessoal, empreendedorismo, 25-55 anos"
      },
      email: {
        subject: "O segredo que ninguém te conta...",
        preview: "Abra para descobrir",
        body: `Oi [NOME],

Posso fazer uma pergunta sincera?

Você já se sentiu frustrado por ver outras pessoas conseguindo o que você tanto quer?

Eu entendo perfeitamente essa sensação...

[HISTÓRIA ENVOLVENTE]

[VALOR ENTREGUE]

[CALL TO ACTION SUAVE]

Um abraço,
[ASSINATURA]

P.S.: Amanhã vou te contar sobre o erro #1 que 99% das pessoas cometem...`,
        sequence: "Email 1 de 7 - Introdução e Engajamento"
      }
    };

    return responses[type as keyof typeof responses] || {
      content: `Conteúdo gerado para: ${type}\n\nPrompt: ${prompt}\n\nEste é um exemplo de conteúdo criado pela IA com base no seu pedido.`
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple authentication middleware
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const userId = authHeader.split(' ')[1];
      req.user = { id: userId };
    } else {
      req.user = { id: "demo-user" };
    }
    next();
  };

  // ================================
  // AUTHENTICATION ROUTES
  // ================================

  // User registration
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { firstName, lastName, email, password, plan } = req.body;
      
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }

      const newUser = await storage.createUser({
        firstName,
        lastName,
        email,
        password,
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
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // User login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || password !== user.password) {
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
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Get user data
  app.get('/api/auth/user', authenticate, async (req, res) => {
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
      console.error('User fetch error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ================================
  // AI PROJECT ROUTES
  // ================================

  // Create new AI project
  app.post('/api/projects/create', authenticate, async (req, res) => {
    try {
      const { type, title, prompt } = req.body;
      const userId = req.user.id;

      if (!type || !title || !prompt) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Check user credits
      const user = await storage.getUser(userId);
      if (!user || user.furionCredits < 10) {
        return res.status(400).json({ error: 'Créditos insuficientes' });
      }

      // Create project
      const project = await storage.createProject({
        userId,
        type,
        title,
        status: 'processing',
        progress: 0
      });

      // Update user credits
      await storage.updateUserCredits(userId, user.furionCredits - 10);

      // Process with AI in background
      setTimeout(async () => {
        try {
          const content = await AIService.generateContent(type, prompt);
          await storage.updateProject(project.id, {
            status: 'completed',
            progress: 100,
            content
          });
        } catch (error) {
          await storage.updateProject(project.id, {
            status: 'failed',
            progress: 0
          });
        }
      }, 3000 + Math.random() * 5000);

      res.json({ success: true, project });
    } catch (error) {
      console.error('Project creation error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Get user projects
  app.get('/api/projects', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const projects = await storage.getUserProjects(userId);
      res.json({ projects });
    } catch (error) {
      console.error('Projects fetch error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Get specific project
  app.get('/api/projects/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      res.json({ project });
    } catch (error) {
      console.error('Project fetch error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // ================================
  // AI PROCESSING ENDPOINTS
  // ================================

  // Generate AI content
  app.post('/api/ai/generate', authenticate, async (req, res) => {
    try {
      const { type, prompt, title } = req.body;
      const userId = req.user.id;

      if (!type || !prompt) {
        return res.status(400).json({ error: 'Tipo e prompt são obrigatórios' });
      }

      // Check user credits
      const user = await storage.getUser(userId);
      if (!user || user.furionCredits < 5) {
        return res.status(400).json({ error: 'Créditos insuficientes' });
      }

      // Generate content
      const content = await AIService.generateContent(type, prompt);

      // Update user credits
      await storage.updateUserCredits(userId, user.furionCredits - 5);

      res.json({
        success: true,
        content,
        creditsUsed: 5,
        remainingCredits: user.furionCredits - 5
      });
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ error: 'Erro na geração de conteúdo' });
    }
  });

  // Get dashboard stats
  app.get('/api/dashboard', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      const projects = await storage.getUserProjects(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const processingProjects = projects.filter(p => p.status === 'processing').length;

      res.json({
        user: {
          name: `${user.firstName} ${user.lastName}`,
          plan: user.plan,
          credits: user.furionCredits
        },
        stats: {
          totalProjects: projects.length,
          completedProjects,
          processingProjects,
          creditsUsed: 5000 - user.furionCredits // assuming initial credits based on plan
        }
      });
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}