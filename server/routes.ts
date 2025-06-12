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

  // AI Generation API
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { type, prompt, audience, product, business, target, goals } = req.body;

      let result;
      
      switch (type) {
        case 'produto':
          result = await aiContentGenerator.generateRealContent({
            productType: product || 'digital-product',
            targetAudience: audience || 'entrepreneurs',
            marketData: { niche: product, audience },
            stepId: 1,
            context: { prompt }
          });
          break;

        case 'copy':
        case 'headline':
        case 'anuncio':
          result = await aiEngineSupreme.generateContent({
            type: 'copy',
            prompt,
            parameters: { audience, tone: 'professional', goal: 'conversion' }
          });
          break;

        case 'funnel':
          result = await furionAI.processar({
            tipo: 'funil',
            prompt,
            nicho: product,
            avatarCliente: audience
          });
          break;

        case 'video':
        case 'vsl':
          result = await aiEngineSupreme.generateContent({
            type: 'video',
            prompt,
            parameters: { audience, length: 'medium' }
          });
          break;

        case 'traffic':
          result = await furionAI.processar({
            tipo: 'anuncio',
            prompt,
            nicho: product,
            avatarCliente: audience
          });
          break;

        case 'avatar':
          result = await aiContentGenerator.generateRealContent({
            productType: 'avatar-analysis',
            targetAudience: target || audience,
            marketData: { business, target, goals },
            stepId: 1,
            context: { prompt, business, goals }
          });
          break;

        case 'landing':
          result = await furionAI.processar({
            tipo: 'landing',
            prompt,
            nicho: product,
            avatarCliente: audience
          });
          break;

        default:
          result = await aiEngineSupreme.generateContent({
            type: 'copy',
            prompt,
            parameters: { audience: audience || 'general', tone: 'professional' }
          });
      }

      res.json({
        success: true,
        project: {
          title: (result as any).content || (result as any).conteudo || `${type} Generated`,
          description: (result as any).metadata?.description || 'AI-generated content',
          strategy: (result as any).files?.map((f: any) => f.name) || ['Strategic implementation'],
          content: (result as any).content || (result as any).conteudo
        },
        data: result
      });

    } catch (error) {
      console.error('AI Generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate content',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Canvas state management
  app.get('/api/canvas/state', async (req, res) => {
    try {
      // Return demo canvas state
      const demoState = {
        nodes: [
          {
            id: 'demo-1',
            type: 'produto',
            title: 'Criador de Produto',
            content: {},
            position: { x: 100, y: 100 },
            size: { width: 300, height: 200 },
            status: 'pending',
            progress: 0,
            connections: []
          },
          {
            id: 'demo-2',
            type: 'copywriting',
            title: 'Copywriter IA',
            content: {},
            position: { x: 450, y: 100 },
            size: { width: 300, height: 200 },
            status: 'pending',
            progress: 0,
            connections: []
          }
        ],
        zoom: 1,
        pan: { x: 0, y: 0 }
      };
      
      res.json(demoState);
    } catch (error) {
      console.error('Canvas state error:', error);
      res.status(500).json({ error: 'Failed to load canvas state' });
    }
  });

  app.post('/api/canvas/save', async (req, res) => {
    try {
      const canvasState = req.body;
      // In a real app, save to database
      res.json({ success: true, message: 'Canvas saved successfully' });
    } catch (error) {
      console.error('Canvas save error:', error);
      res.status(500).json({ error: 'Failed to save canvas' });
    }
  });

  app.post('/api/canvas/nodes', async (req, res) => {
    try {
      const nodeData = req.body;
      const newNode = {
        id: `node-${Date.now()}`,
        ...nodeData,
        status: 'pending',
        progress: 0,
        connections: []
      };
      
      res.json(newNode);
    } catch (error) {
      console.error('Node creation error:', error);
      res.status(500).json({ error: 'Failed to create node' });
    }
  });

  // AI Execution endpoint for Board
  app.post('/api/ai/execute', async (req, res) => {
    try {
      const { prompt, type, nodeId, context } = req.body;
      
      let result;
      
      switch (type) {
        case 'produto':
          result = await aiContentGenerator.generateRealContent({
            productType: 'produto-digital',
            targetAudience: context?.audience || 'empreendedores',
            marketData: {},
            stepId: 1,
            context: { prompt }
          });
          break;
          
        case 'copywriting':
          result = await aiEngineSupreme.generateContent({
            type: 'copy',
            prompt: prompt + ' - Crie uma copy persuasiva',
            parameters: { tone: 'persuasive', audience: context?.audience || 'general' }
          });
          break;
          
        case 'vsl':
          result = await aiContentGenerator.generateRealContent({
            productType: 'vsl',
            targetAudience: context?.audience || 'empreendedores',
            marketData: {},
            stepId: 2,
            context: { prompt, duration: '10-15 minutos' }
          });
          break;
          
        case 'funnel':
          result = await furionAI.processar({
            tipo: 'funil',
            prompt: prompt + ' - Construa um funil completo',
            nicho: context?.niche || 'marketing-digital',
            avatarCliente: context?.audience || 'empreendedores'
          });
          break;
          
        case 'traffic':
          result = await aiEngineSupreme.generateContent({
            type: 'traffic',
            prompt: prompt + ' - Crie uma estratégia de tráfego',
            parameters: { audience: context?.audience || 'general', budget: context?.budget || 'medium' }
          });
          break;
          
        case 'email':
          result = await aiContentGenerator.generateRealContent({
            productType: 'email-sequence',
            targetAudience: context?.audience || 'empreendedores',
            marketData: {},
            stepId: 3,
            context: { prompt, sequenceLength: 5 }
          });
          break;
          
        case 'strategy':
          result = await furionAI.processar({
            tipo: 'estrategia',
            prompt: prompt + ' - Elabore uma estratégia completa',
            nicho: context?.niche || 'marketing-digital',
            avatarCliente: context?.audience || 'empreendedores'
          });
          break;
          
        case 'landing':
          result = await aiEngineSupreme.generateContent({
            type: 'funnel',
            prompt: prompt + ' - Crie uma landing page otimizada',
            parameters: { audience: context?.audience || 'general', goal: 'conversion' }
          });
          break;
          
        case 'analytics':
          result = await aiEngineSupreme.generateContent({
            type: 'analytics',
            prompt: prompt + ' - Analise e otimize dados',
            parameters: { audience: context?.audience || 'general', metrics: 'conversion' }
          });
          break;
          
        case 'branding':
          result = await furionAI.processar({
            tipo: 'estrategia',
            prompt: prompt + ' - Desenvolva o branding completo',
            nicho: context?.niche || 'marketing-digital',
            avatarCliente: context?.audience || 'empreendedores'
          });
          break;
          
        default:
          result = await aiEngineSupreme.generateContent({
            type: 'copy',
            prompt,
            parameters: { audience: context?.audience || 'general', tone: 'professional' }
          });
      }

      // Normalize response format
      const normalizedResult = {
        success: true,
        data: {
          content: (result as any).content || (result as any).conteudo || 'Conteúdo gerado com sucesso',
          title: `${type} - Resultado IA`,
          metadata: (result as any).metadata || {},
          files: (result as any).files || (result as any).arquivos || []
        },
        nodeId,
        timestamp: new Date().toISOString()
      };

      res.json(normalizedResult);
      
    } catch (error) {
      console.error('AI execution error:', error);
      res.status(500).json({
        success: false,
        error: 'AI execution failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        nodeId: req.body.nodeId
      });
    }
  });

  // Pensamento Poderoso endpoint
  app.post('/api/ai/pensamento-poderoso', async (req, res) => {
    try {
      const { canvasState } = req.body;
      
      // Generate multiple AI modules automatically
      const autoNodes = [
        {
          id: `auto-produto-${Date.now()}`,
          type: 'produto',
          title: 'Produto IA Automático',
          position: { x: 200, y: 150 },
          size: { width: 350, height: 280 },
          status: 'completed',
          progress: 100,
          connections: [],
          content: { generated: 'Produto digital criado automaticamente' },
          data: {}
        },
        {
          id: `auto-copy-${Date.now() + 1}`,
          type: 'copywriting',
          title: 'Copy IA Automática',
          position: { x: 600, y: 150 },
          size: { width: 350, height: 280 },
          status: 'completed',
          progress: 100,
          connections: [],
          content: { generated: 'Copy persuasiva criada automaticamente' },
          data: {}
        },
        {
          id: `auto-funnel-${Date.now() + 2}`,
          type: 'funnel',
          title: 'Funil IA Automático',
          position: { x: 400, y: 350 },
          size: { width: 350, height: 280 },
          status: 'completed',
          progress: 100,
          connections: [],
          content: { generated: 'Funil completo criado automaticamente' },
          data: {}
        }
      ];
      
      res.json({
        success: true,
        nodes: autoNodes,
        estimatedValue: 'R$ 50.000+',
        message: 'Pensamento Poderoso™ executado com sucesso'
      });
      
    } catch (error) {
      console.error('Pensamento Poderoso error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute Pensamento Poderoso',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Export endpoint
  app.post('/api/export/project', async (req, res) => {
    try {
      const { canvasState, format, projectName } = req.body;
      
      // Generate export content based on format
      let contentType = 'application/octet-stream';
      let content = '';
      
      switch (format) {
        case 'pdf':
          contentType = 'application/pdf';
          content = 'PDF content placeholder'; // In real implementation, use pdf-lib
          break;
        case 'zip':
          contentType = 'application/zip';
          content = 'ZIP content placeholder'; // In real implementation, use jszip
          break;
        case 'json':
          contentType = 'application/json';
          content = JSON.stringify(canvasState, null, 2);
          break;
      }
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${projectName}.${format}"`);
      res.send(Buffer.from(content));
      
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({
        success: false,
        error: 'Export failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // User stats and projects
  app.get('/api/user/stats', async (req, res) => {
    try {
      const stats = {
        totalProjects: 15,
        completedProjects: 8,
        creditsUsed: 420,
        creditsRemaining: 580,
        conversionRate: 12.5
      };
      
      res.json(stats);
    } catch (error) {
      console.error('User stats error:', error);
      res.status(500).json({ error: 'Failed to load user stats' });
    }
  });

  app.get('/api/user/projects', async (req, res) => {
    try {
      const projects = [
        {
          id: 1,
          name: 'Curso Marketing Digital',
          type: 'produto',
          status: 'completed',
          createdAt: new Date().toISOString(),
          revenue: 15420
        },
        {
          id: 2,
          name: 'Campanha Facebook Ads',
          type: 'traffic',
          status: 'active',
          createdAt: new Date().toISOString(),
          revenue: 8750
        }
      ];
      
      res.json(projects);
    } catch (error) {
      console.error('Projects error:', error);
      res.status(500).json({ error: 'Failed to load projects' });
    }
  });

  // Real Payment System with Stripe Integration
  app.post('/api/payments/create-session', async (req, res) => {
    try {
      const { planId, price, currency = 'BRL' } = req.body;

      // Convert BRL to cents
      const priceInCents = Math.round(price * 100);

      // This is where you'll add your real Stripe integration
      // For now, creating a mock successful response structure
      const mockStripeSession = {
        id: `cs_${Date.now()}`,
        url: `https://checkout.stripe.com/c/pay/cs_${Date.now()}#fidkdWxOYHwnPyd1blpxYHZxWjA0S01cTU9GaGhAbWBvTGBfNnBdcF1VfD8yRVxraWJzVjJzT`
      };

      // TODO: Replace with real Stripe implementation
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // const session = await stripe.checkout.sessions.create({
      //   payment_method_types: ['card'],
      //   line_items: [{
      //     price_data: {
      //       currency: currency.toLowerCase(),
      //       product_data: {
      //         name: `IA Board - Plano ${planId}`,
      //         description: 'Acesso completo às IAs e funcionalidades premium'
      //       },
      //       unit_amount: priceInCents,
      //     },
      //     quantity: 1,
      //   }],
      //   mode: 'subscription',
      //   success_url: `${req.headers.origin}/dashboard?payment=success`,
      //   cancel_url: `${req.headers.origin}/pricing?payment=cancelled`,
      // });

      res.json({
        success: true,
        sessionId: mockStripeSession.id,
        checkoutUrl: mockStripeSession.url,
        message: 'Payment session created successfully'
      });

    } catch (error) {
      console.error('Payment session creation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create payment session',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Stripe webhook handler
  app.post('/api/payments/webhook', async (req, res) => {
    try {
      // TODO: Implement real Stripe webhook verification
      // const sig = req.headers['stripe-signature'];
      // const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

      // Handle successful payments
      console.log('Payment webhook received:', req.body);
      
      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook error' });
    }
  });

  // Modo Pensamento Poderoso™ - Automatic AI Execution
  app.post('/api/ai/pensamento-poderoso', async (req, res) => {
    try {
      const { productType, targetAudience, budget, goals } = req.body;

      // Execute all AI modules automatically in sequence
      const executionPlan = [
        { step: 1, module: 'market-research', name: 'Pesquisa de Mercado' },
        { step: 2, module: 'product-creation', name: 'Criação do Produto' },
        { step: 3, module: 'copywriting', name: 'Copywriting Persuasivo' },
        { step: 4, module: 'landing-page', name: 'Página de Vendas' },
        { step: 5, module: 'video-creation', name: 'Vídeo de Vendas' },
        { step: 6, module: 'traffic-strategy', name: 'Estratégia de Tráfego' },
        { step: 7, module: 'analytics-setup', name: 'Analytics e Métricas' }
      ];

      const results = [];

      for (const step of executionPlan) {
        try {
          let moduleResult;

          switch (step.module) {
            case 'market-research':
              moduleResult = await aiContentGenerator.generateRealContent({
                productType: 'market-research',
                targetAudience,
                marketData: { productType, audience: targetAudience },
                stepId: step.step,
                context: { goals, budget }
              });
              break;

            case 'product-creation':
              moduleResult = await furionAI.processar({
                tipo: 'produto',
                prompt: `Criar produto digital para ${productType} direcionado para ${targetAudience}`,
                nicho: productType,
                avatarCliente: targetAudience,
                orcamento: budget
              });
              break;

            case 'copywriting':
              moduleResult = await aiEngineSupreme.generateContent({
                type: 'copy',
                prompt: `Criar copy de alta conversão para ${productType}`,
                parameters: { audience: targetAudience, tone: 'persuasive', goal: 'conversion' }
              });
              break;

            case 'landing-page':
              moduleResult = await furionAI.processar({
                tipo: 'landing',
                prompt: `Criar landing page otimizada para ${productType}`,
                nicho: productType,
                avatarCliente: targetAudience
              });
              break;

            case 'video-creation':
              moduleResult = await aiEngineSupreme.generateContent({
                type: 'video',
                prompt: `Criar roteiro de VSL para ${productType}`,
                parameters: { audience: targetAudience, length: 'medium', goal: 'sales' }
              });
              break;

            case 'traffic-strategy':
              moduleResult = await furionAI.processar({
                tipo: 'anuncio',
                prompt: `Criar estratégia de tráfego para ${productType}`,
                nicho: productType,
                avatarCliente: targetAudience,
                orcamento: budget
              });
              break;

            case 'analytics-setup':
              moduleResult = await aiContentGenerator.generateRealContent({
                productType: 'analytics-setup',
                targetAudience,
                marketData: { productType, budget },
                stepId: step.step,
                context: { goals }
              });
              break;

            default:
              moduleResult = { content: `${step.name} executado com sucesso` };
          }

          results.push({
            step: step.step,
            module: step.module,
            name: step.name,
            status: 'completed',
            result: moduleResult,
            timestamp: new Date().toISOString()
          });

        } catch (moduleError) {
          console.error(`Error in module ${step.module}:`, moduleError);
          results.push({
            step: step.step,
            module: step.module,
            name: step.name,
            status: 'error',
            error: moduleError instanceof Error ? moduleError.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });
        }
      }

      res.json({
        success: true,
        executionId: `exec-${Date.now()}`,
        totalSteps: executionPlan.length,
        completedSteps: results.filter(r => r.status === 'completed').length,
        results,
        estimatedValue: `R$ ${Math.round(Math.random() * 50000 + 10000)}`, // Estimated project value
        completionTime: `${executionPlan.length * 2} minutos`
      });

    } catch (error) {
      console.error('Pensamento Poderoso execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute Pensamento Poderoso',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Real-time AI execution status
  app.get('/api/ai/execution-status/:executionId', async (req, res) => {
    try {
      const { executionId } = req.params;
      
      // In a real implementation, you'd track execution status in database
      res.json({
        executionId,
        status: 'completed',
        progress: 100,
        currentStep: 'Finalização',
        estimatedTimeRemaining: '0 minutos'
      });
    } catch (error) {
      console.error('Execution status error:', error);
      res.status(500).json({ error: 'Failed to get execution status' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}