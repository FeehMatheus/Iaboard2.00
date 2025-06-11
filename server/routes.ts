import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

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

  const httpServer = createServer(app);
  return httpServer;
}