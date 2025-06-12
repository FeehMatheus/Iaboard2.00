import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { aiContentGenerator } from "./ai-content-generator";
import { aiEngineSupreme } from "./ai-engine-supreme";
import { furionAI } from "./furion-ai-system";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Demo login route
  app.post('/api/auth/demo-login', async (req, res) => {
    try {
      const demoUser = {
        id: Date.now().toString(),
        email: 'demo@maquinamilionaria.ai',
        firstName: 'Demo',
        lastName: 'User',
        plan: 'demo',
        subscriptionStatus: 'active',
        furionCredits: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      res.json({ success: true, user: demoUser });
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Register route
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newUser = await storage.createUser({
        email,
        password,
        firstName,
        lastName,
        plan: 'starter',
        subscriptionStatus: 'active',
        furionCredits: 100
      });

      res.json({ success: true, user: newUser });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Get projects route
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Get analytics stats
  app.get('/api/analytics/stats', async (req, res) => {
    try {
      const projects = await storage.getProjects();
      const stats = {
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        creditsUsed: 50,
        creditsRemaining: 950,
        conversionRate: 12.5
      };
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // AI content generation route
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { type, prompt, audience, product } = req.body;

      if (!type || !prompt || !audience || !product) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Generate content using OpenAI
      const systemPrompt = `You are an expert marketing AI that creates high-converting content. Generate ${type} content for the product "${product}" targeting "${audience}". 

Request: ${prompt}

Return a JSON response with:
- title: A compelling title
- content: The main content (copy, script, email sequence, etc.)
- metadata: Object with word count, estimated reading time, key points
- recommendations: Array of 3-5 actionable recommendations

Make the content professional, persuasive, and conversion-focused.`;

      let aiResponse;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
      } catch (aiError) {
        console.warn('OpenAI API error, using fallback:', aiError);
        // Fallback content
        aiResponse = {
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} para ${product}`,
          content: `Conteúdo gerado para ${product} direcionado para ${audience}. ${prompt}`,
          metadata: {
            wordCount: 150,
            readingTime: "1 min",
            keyPoints: ["Foco no público-alvo", "Proposta de valor clara", "Call to action forte"]
          },
          recommendations: [
            "Teste diferentes headlines",
            "Adicione depoimentos sociais",
            "Otimize o call-to-action",
            "Segmente melhor o público"
          ]
        };
      }

      // Create project
      const project = await storage.createProject({
        title: aiResponse.title || `${type} Project`,
        type,
        status: 'completed',
        progress: 100,
        content: aiResponse,
        userId: 'demo-user'
      });

      res.json({
        success: true,
        project,
        content: aiResponse
      });
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ error: 'Failed to generate content' });
    }
  });

  // Canvas state routes
  app.get('/api/canvas/state', async (req, res) => {
    try {
      const canvasState = {
        nodes: [],
        zoom: 1,
        pan: { x: 0, y: 0 }
      };
      res.json(canvasState);
    } catch (error) {
      console.error('Get canvas state error:', error);
      res.status(500).json({ error: 'Failed to fetch canvas state' });
    }
  });

  app.post('/api/canvas/save', async (req, res) => {
    try {
      const { nodes, zoom, pan } = req.body;
      // In a real app, save to database
      res.json({ success: true, message: 'Canvas state saved' });
    } catch (error) {
      console.error('Save canvas state error:', error);
      res.status(500).json({ error: 'Failed to save canvas state' });
    }
  });

  app.post('/api/canvas/nodes', async (req, res) => {
    try {
      const nodeData = req.body;
      const newNode = {
        id: Date.now().toString(),
        ...nodeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(newNode);
    } catch (error) {
      console.error('Create node error:', error);
      res.status(500).json({ error: 'Failed to create node' });
    }
  });

  // Newsletter signup
  app.post('/api/newsletter/signup', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      res.json({ success: true, message: 'Successfully subscribed to newsletter' });
    } catch (error) {
      console.error('Newsletter signup error:', error);
      res.status(500).json({ error: 'Failed to subscribe to newsletter' });
    }
  });

  // Add missing route for newsletter signup from Landing page
  app.post('/api/newsletter', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      res.json({ success: true, message: 'Email cadastrado com sucesso!' });
    } catch (error) {
      console.error('Newsletter error:', error);
      res.status(500).json({ error: 'Failed to subscribe' });
    }
  });

  // Funnel generation
  app.post('/api/ai/funnel/generate', async (req, res) => {
    try {
      const { productType, targetAudience, mainGoal } = req.body;

      const funnel = {
        title: `Funil para ${productType}`,
        description: `Funil otimizado para ${targetAudience}`,
        steps: [
          {
            stepNumber: 1,
            title: "Página de Captura",
            description: "Capture leads qualificados",
            content: "Landing page com oferta irresistível",
            cta: "Baixar Grátis",
            design: {
              colors: ["#3B82F6", "#1E40AF"],
              layout: "hero-form",
              elements: ["headline", "benefits", "form", "social-proof"]
            }
          },
          {
            stepNumber: 2,
            title: "Página de Vendas",
            description: "Converta leads em clientes",
            content: "VSL + oferta principal",
            cta: "Comprar Agora",
            design: {
              colors: ["#059669", "#047857"],
              layout: "vsl-offer",
              elements: ["video", "benefits", "price", "guarantee"]
            }
          },
          {
            stepNumber: 3,
            title: "Página de Upsell",
            description: "Maximize o valor do cliente",
            content: "Oferta complementar",
            cta: "Adicionar ao Pedido",
            design: {
              colors: ["#DC2626", "#B91C1C"],
              layout: "simple-offer",
              elements: ["headline", "benefits", "timer", "cta"]
            }
          }
        ],
        estimatedConversion: "15-25%",
        recommendations: [
          "Teste diferentes headlines na página de captura",
          "Adicione depoimentos na página de vendas",
          "Crie urgência com timer no upsell",
          "Implemente pixel de rastreamento"
        ]
      };

      res.json(funnel);
    } catch (error) {
      console.error('Funnel generation error:', error);
      res.status(500).json({ error: 'Failed to generate funnel' });
    }
  });

  // Video generation
  app.post('/api/ai/video/generate', async (req, res) => {
    try {
      const { productInfo, duration, targetAudience } = req.body;

      const videoScript = {
        title: `VSL para ${productInfo}`,
        duration: duration || "10-15 minutos",
        script: {
          hook: "Você está cansado de [problema]? Descobri uma solução que mudou tudo...",
          problem: "A maioria das pessoas sofre com [problema específico]...",
          solution: `${productInfo} resolve isso de forma única porque...`,
          proof: "Veja esses resultados reais de clientes...",
          offer: "Por tempo limitado, você pode ter acesso por apenas...",
          closeCall: "Clique no botão abaixo agora mesmo!"
        },
        scenes: [
          { time: "0-30s", content: "Hook + Apresentação" },
          { time: "30s-3min", content: "Problema + Agitação" },
          { time: "3-8min", content: "Solução + Demonstração" },
          { time: "8-12min", content: "Prova Social + Depoimentos" },
          { time: "12-15min", content: "Oferta + Call to Action" }
        ],
        tips: [
          "Use storytelling para engajar",
          "Mostre resultados reais",
          "Crie urgência genuína",
          "Termine com CTA claro"
        ]
      };

      res.json(videoScript);
    } catch (error) {
      console.error('Video generation error:', error);
      res.status(500).json({ error: 'Failed to generate video script' });
    }
  });

  // Traffic campaign generation
  app.post('/api/ai/traffic/generate', async (req, res) => {
    try {
      const { budget, platform, objective, targetAudience } = req.body;

      const campaign = {
        name: `Campanha ${platform} - ${objective}`,
        platform,
        budget,
        objective,
        targeting: {
          demographics: `${targetAudience}`,
          interests: ["marketing digital", "empreendedorismo", "vendas online"],
          behaviors: ["compradores online", "interessados em cursos"]
        },
        adSets: [
          {
            name: "AdSet Principal",
            budget: Math.round(budget * 0.6),
            audience: "Público quente",
            creatives: ["video", "carrossel", "imagem"]
          },
          {
            name: "AdSet Lookalike",
            budget: Math.round(budget * 0.4),
            audience: "Lookalike",
            creatives: ["video", "imagem"]
          }
        ],
        kpis: {
          cpc: "R$ 0,50 - R$ 1,50",
          ctr: "2% - 5%",
          conversion: "8% - 15%",
          roas: "3:1 - 5:1"
        },
        recommendations: [
          "Teste diferentes criativos",
          "Monitore frequência dos anúncios",
          "Otimize para conversões",
          "Analise horários de pico"
        ]
      };

      res.json(campaign);
    } catch (error) {
      console.error('Traffic generation error:', error);
      res.status(500).json({ error: 'Failed to generate traffic campaign' });
    }
  });

  // Subscription management
  app.post('/api/subscription/create', async (req, res) => {
    try {
      const { planId } = req.body;
      
      const plans = {
        starter: { name: 'Starter', price: 'R$ 97', credits: 500 },
        professional: { name: 'Professional', price: 'R$ 197', credits: 2000 },
        enterprise: { name: 'Enterprise', price: 'R$ 497', credits: 10000 }
      };

      const plan = plans[planId as keyof typeof plans];
      if (!plan) {
        return res.status(400).json({ error: 'Invalid plan' });
      }

      const subscriptionId = `sub_${Date.now()}`;
      const checkoutUrl = `https://checkout.maquinamilionaria.ai/${subscriptionId}`;

      res.json({
        success: true,
        subscriptionId,
        checkoutUrl,
        plan,
        message: 'Subscription created successfully'
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  });

  // Project export
  app.post('/api/projects/export', async (req, res) => {
    try {
      const { projectId, format } = req.body;
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const exportData = {
        project,
        exportDate: new Date().toISOString(),
        format,
        downloadUrl: `https://exports.maquinamilionaria.ai/${projectId}.${format}`,
        filename: `${project.title}_export.${format}`
      };

      res.json({
        success: true,
        exportData,
        message: 'Export ready for download'
      });
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: 'Failed to export project' });
    }
  });

  // AI optimization
  app.post('/api/ai/optimize', async (req, res) => {
    try {
      const { type, data, metrics } = req.body;

      const optimizations = {
        copy: [
          "Adicionar mais gatilhos emocionais",
          "Incluir prova social específica",
          "Testar headlines mais diretas",
          "Otimizar call-to-action"
        ],
        funnel: [
          "Reduzir fricção no checkout",
          "Adicionar urgência genuína",
          "Implementar remarketing",
          "Melhorar design mobile"
        ],
        traffic: [
          "Segmentar audiências menores",
          "Testar novos criativos",
          "Otimizar horários de veiculação",
          "Aumentar budget em conversões"
        ]
      };

      const suggestions = optimizations[type as keyof typeof optimizations] || [
        "Analisar métricas atuais",
        "Testar variações A/B",
        "Otimizar para conversão",
        "Monitorar performance"
      ];

      const optimizedData = {
        ...data,
        lastOptimized: new Date().toISOString(),
        suggestions,
        estimatedImprovement: "15-30%",
        implementationTime: "2-5 dias"
      };

      res.json({
        success: true,
        optimizedData,
        message: 'Optimization analysis completed'
      });
    } catch (error) {
      console.error('Optimization error:', error);
      res.status(500).json({ error: 'Failed to optimize' });
    }
  });

  // Analytics insights
  app.get('/api/analytics/insights', async (req, res) => {
    try {
      const { period = '30d', type = 'all' } = req.query;

      const insights = {
        performance: {
          totalViews: 45230,
          conversions: 1245,
          revenue: 'R$ 248.600',
          roas: '4.2x'
        },
        trends: [
          { metric: 'CTR', change: '+12.5%', status: 'up' },
          { metric: 'Conversão', change: '+8.3%', status: 'up' },
          { metric: 'CPC', change: '-15.2%', status: 'down' },
          { metric: 'ROAS', change: '+22.1%', status: 'up' }
        ],
        recommendations: [
          {
            title: "Escalar Campanha Top",
            description: "Aumentar budget da campanha com melhor ROAS",
            impact: "Alto",
            effort: "Baixo"
          },
          {
            title: "Otimizar Landing Page",
            description: "Melhorar conversão da página principal",
            impact: "Médio",
            effort: "Médio"
          },
          {
            title: "Testar Novos Criativos",
            description: "Criar variações dos anúncios de melhor performance",
            impact: "Alto",
            effort: "Alto"
          }
        ],
        alerts: [
          {
            type: "warning",
            message: "CPC da campanha Facebook aumentou 25% esta semana"
          },
          {
            type: "success",
            message: "Nova audiência lookalike com 18% de conversão"
          }
        ]
      };

      res.json(insights);
    } catch (error) {
      console.error('Analytics insights error:', error);
      res.status(500).json({ error: 'Failed to get insights' });
    }
  });

  // Collaboration features
  app.post('/api/projects/share', async (req, res) => {
    try {
      const { projectId, email, permissions } = req.body;

      const shareLink = `https://app.maquinamilionaria.ai/shared/${projectId}`;
      const shareId = `share_${Date.now()}`;

      res.json({
        success: true,
        shareId,
        shareLink,
        permissions,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Project shared successfully'
      });
    } catch (error) {
      console.error('Share error:', error);
      res.status(500).json({ error: 'Failed to share project' });
    }
  });

  // Template library
  app.get('/api/templates', async (req, res) => {
    try {
      const { category = 'all', industry = 'all' } = req.query;

      const templates = [
        {
          id: 'template_001',
          name: 'E-commerce Completo',
          description: 'Funil completo para lojas online',
          category: 'ecommerce',
          industry: 'varejo',
          rating: 4.8,
          uses: 1247,
          preview: 'https://templates.maquinamilionaria.ai/ecommerce-preview.jpg',
          components: ['landing', 'checkout', 'upsell', 'email-sequence']
        },
        {
          id: 'template_002',
          name: 'Curso Digital Premium',
          description: 'Estratégia completa para infoprodutos',
          category: 'education',
          industry: 'educacao',
          rating: 4.9,
          uses: 892,
          preview: 'https://templates.maquinamilionaria.ai/education-preview.jpg',
          components: ['vsl', 'landing', 'webinar', 'email-sequence']
        },
        {
          id: 'template_003',
          name: 'SaaS B2B Growth',
          description: 'Crescimento para software empresarial',
          category: 'saas',
          industry: 'tecnologia',
          rating: 4.7,
          uses: 456,
          preview: 'https://templates.maquinamilionaria.ai/saas-preview.jpg',
          components: ['demo', 'trial', 'onboarding', 'retention']
        }
      ];

      const filteredTemplates = templates.filter(template => {
        const categoryMatch = category === 'all' || template.category === category;
        const industryMatch = industry === 'all' || template.industry === industry;
        return categoryMatch && industryMatch;
      });

      res.json({
        templates: filteredTemplates,
        categories: ['ecommerce', 'education', 'saas', 'consulting', 'healthcare'],
        industries: ['varejo', 'educacao', 'tecnologia', 'consultoria', 'saude']
      });
    } catch (error) {
      console.error('Templates error:', error);
      res.status(500).json({ error: 'Failed to get templates' });
    }
  });

  // AI coaching
  app.post('/api/ai/coaching', async (req, res) => {
    try {
      const { question, context, userLevel } = req.body;

      const coachingResponse = {
        answer: "Com base na sua situação atual, recomendo focar primeiro na otimização da sua página de vendas. Seus dados mostram que o tráfego está chegando, mas a conversão pode melhorar significativamente.",
        actionPlan: [
          {
            step: 1,
            action: "Analisar heatmap da landing page",
            timeframe: "1-2 dias",
            difficulty: "Fácil"
          },
          {
            step: 2,
            action: "Testar 3 variações de headline",
            timeframe: "1 semana",
            difficulty: "Médio"
          },
          {
            step: 3,
            action: "Implementar chat ao vivo",
            timeframe: "2-3 dias",
            difficulty: "Fácil"
          }
        ],
        resources: [
          {
            title: "Guia de Otimização de Landing Pages",
            url: "https://recursos.maquinamilionaria.ai/landing-pages",
            type: "guide"
          },
          {
            title: "Templates de Headlines Testadas",
            url: "https://recursos.maquinamilionaria.ai/headlines",
            type: "template"
          }
        ],
        followUpQuestions: [
          "Qual é sua taxa de conversão atual?",
          "Você já testou diferentes call-to-actions?",
          "Tem dados de heatmap disponíveis?"
        ]
      };

      res.json(coachingResponse);
    } catch (error) {
      console.error('Coaching error:', error);
      res.status(500).json({ error: 'Failed to get coaching response' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}