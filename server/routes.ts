import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./memory-storage";
import { z } from "zod";

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Real AI service with multiple providers
class AIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  private static anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  static async generateContent(type: string, prompt: string, options: any = {}): Promise<any> {
    try {
      const { targetAudience, productType, budget, platform, videoUrl } = options;
      
      switch (type) {
        case 'copy':
          return await this.generateCopywriting(prompt, targetAudience, productType);
        case 'vsl':
          return await this.generateVSL(prompt, targetAudience, productType);
        case 'ads':
          return await this.generateAds(prompt, targetAudience, platform, budget);
        case 'email':
          return await this.generateEmailSequence(prompt, targetAudience, productType);
        case 'funnel':
          return await this.generateFunnel(prompt, targetAudience, productType);
        case 'analysis':
          return await this.analyzeVideo(videoUrl, prompt);
        case 'strategy':
          return await this.generateStrategy(prompt, targetAudience, productType);
        default:
          return await this.generateGeneric(prompt, type);
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new Error('Erro na geração de conteúdo. Verifique suas chaves de API.');
    }
  }

  private static async generateCopywriting(prompt: string, audience: string, product: string): Promise<any> {
    const systemPrompt = `Você é um copywriter expert em vendas diretas no mercado brasileiro. Crie uma copy persuasiva e otimizada para conversão.

Público-alvo: ${audience || 'Não especificado'}
Produto/Serviço: ${product || 'Não especificado'}

Estruture a resposta em:
1. Headline principal (impactante e específica)
2. Subheadline (complementa e detalha)
3. Abertura (hook emocional)
4. Problema (dor específica do público)
5. Solução (seu produto/serviço)
6. Benefícios (3-5 benefícios claros)
7. Prova social (credibilidade)
8. Oferta (proposta de valor)
9. Urgência/Escassez
10. CTA (call-to-action persuasivo)

Use gatilhos mentais, storytelling e técnicas de persuasão comprovadas.`;

    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514", // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.parseCopywritingResponse(content);
  }

  private static async generateVSL(prompt: string, audience: string, product: string): Promise<any> {
    const systemPrompt = `Você é um especialista em Video Sales Letters (VSL) para o mercado brasileiro. Crie um roteiro completo e persuasivo.

Público-alvo: ${audience || 'Não especificado'}
Produto/Serviço: ${product || 'Não especificado'}

Estruture o VSL em:
1. Hook (0-30s) - Capturar atenção imediatamente
2. Identificação (30s-2min) - Conectar com o público
3. Problema (2-5min) - Amplificar a dor
4. Solução (5-10min) - Apresentar o método
5. Prova (10-15min) - Demonstrações e cases
6. Oferta (15-18min) - Proposta de valor
7. Urgência (18-20min) - Escassez genuína
8. CTA (20-22min) - Chamada para ação

Inclua timing, elementos visuais sugeridos e CTAs específicos.`;

    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.parseVSLResponse(content);
  }

  private static async generateAds(prompt: string, audience: string, platform: string, budget: string): Promise<any> {
    const systemPrompt = `Você é um especialista em tráfego pago e criação de anúncios para ${platform || 'Facebook/Instagram'}.

Público-alvo: ${audience || 'Não especificado'}
Plataforma: ${platform || 'Facebook/Instagram'}
Orçamento: ${budget || 'Não especificado'}

Crie múltiplas variações de anúncios otimizados para conversão:
1. Headlines (5 variações)
2. Textos primários (3 versões)
3. CTAs específicos
4. Segmentação detalhada
5. Estratégia de bidding
6. Criativos sugeridos
7. Público lookalike
8. Interesses específicos`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      max_tokens: 2000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    const content = response.choices[0].message.content || '';
    return this.parseAdsResponse(content);
  }

  private static async generateEmailSequence(prompt: string, audience: string, product: string): Promise<any> {
    const systemPrompt = `Você é um especialista em email marketing e automações. Crie uma sequência estratégica de emails.

Público-alvo: ${audience || 'Não especificado'}
Produto/Serviço: ${product || 'Não especificado'}

Crie uma sequência de 7 emails:
1. Boas-vindas + Primeiro valor
2. História pessoal + Conexão
3. Problema + Agitação
4. Solução + Método
5. Prova social + Cases
6. Oferta + Benefícios
7. Urgência + Última chance

Para cada email inclua: assunto, preview, estrutura e CTA específico.`;

    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.parseEmailResponse(content);
  }

  private static async generateFunnel(prompt: string, audience: string, product: string): Promise<any> {
    const systemPrompt = `Você é um especialista em funis de vendas digitais. Crie um funil completo e otimizado.

Público-alvo: ${audience || 'Não especificado'}
Produto/Serviço: ${product || 'Não especificado'}

Projete um funil com:
1. Estratégia de atração (lead magnet)
2. Página de captura otimizada
3. Sequência de emails automatizada
4. Página de vendas persuasiva
5. Upsells e downsells
6. Follow-up pós-venda
7. Métricas e KPIs
8. Estimativa de conversão`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 2500,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    const content = response.choices[0].message.content || '';
    return this.parseFunnelResponse(content);
  }

  static async analyzeVideo(videoUrl: string, prompt: string): Promise<any> {
    if (!videoUrl) {
      throw new Error('URL do vídeo é obrigatória para análise');
    }

    const systemPrompt = `Você é um especialista em análise de vídeos de marketing e vendas. Com base na URL fornecida, analise os elementos-chave do vídeo.

Analise:
1. Estrutura narrativa
2. Gatilhos mentais utilizados
3. CTAs e ofertas
4. Pontos fortes e fracos
5. Sugestões de otimização
6. Estratégias replicáveis
7. Timing e ritmo
8. Elementos visuais eficazes`;

    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ 
        role: "user", 
        content: `Analise este vídeo: ${videoUrl}\n\nFoco da análise: ${prompt}` 
      }]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return this.parseAnalysisResponse(content, videoUrl);
  }

  private static async generateStrategy(prompt: string, audience: string, product: string): Promise<any> {
    const systemPrompt = `Você é um consultor estratégico de marketing digital. Crie uma estratégia completa e acionável.

Público-alvo: ${audience || 'Não especificado'}
Produto/Serviço: ${product || 'Não especificado'}

Desenvolva:
1. Análise de mercado
2. Posicionamento estratégico
3. Jornada do cliente
4. Canais de aquisição
5. Estratégia de conteúdo
6. Funis de conversão
7. Métricas e KPIs
8. Cronograma de execução
9. Orçamento sugerido
10. Riscos e mitigações`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 3000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    });

    const content = response.choices[0].message.content || '';
    return this.parseStrategyResponse(content);
  }

  private static async generateGeneric(prompt: string, type: string): Promise<any> {
    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ 
        role: "user", 
        content: `Crie conteúdo de marketing de alta qualidade para: ${type}\n\nDescrição: ${prompt}` 
      }]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return {
      type,
      content,
      timestamp: new Date().toISOString()
    };
  }

  // Response parsing methods
  private static parseCopywritingResponse(content: string): any {
    return {
      type: 'copy',
      headline: this.extractSection(content, ['headline', 'título']),
      subheadline: this.extractSection(content, ['subheadline', 'subtítulo']),
      opening: this.extractSection(content, ['abertura', 'hook']),
      problem: this.extractSection(content, ['problema', 'dor']),
      solution: this.extractSection(content, ['solução', 'método']),
      benefits: this.extractSection(content, ['benefícios', 'vantagens']),
      social_proof: this.extractSection(content, ['prova social', 'credibilidade']),
      offer: this.extractSection(content, ['oferta', 'proposta']),
      urgency: this.extractSection(content, ['urgência', 'escassez']),
      cta: this.extractSection(content, ['cta', 'call-to-action', 'chamada']),
      full_content: content
    };
  }

  private static parseVSLResponse(content: string): any {
    return {
      type: 'vsl',
      hook: this.extractSection(content, ['hook', '0-30s', 'abertura']),
      identification: this.extractSection(content, ['identificação', '30s-2min']),
      problem: this.extractSection(content, ['problema', '2-5min']),
      solution: this.extractSection(content, ['solução', '5-10min']),
      proof: this.extractSection(content, ['prova', '10-15min']),
      offer: this.extractSection(content, ['oferta', '15-18min']),
      urgency: this.extractSection(content, ['urgência', '18-20min']),
      cta: this.extractSection(content, ['cta', '20-22min']),
      duration: "22 minutos",
      full_script: content
    };
  }

  private static parseAdsResponse(content: string): any {
    return {
      type: 'ads',
      headlines: this.extractList(content, ['headlines', 'títulos']),
      primary_text: this.extractSection(content, ['texto primário', 'descrição']),
      ctas: this.extractList(content, ['ctas', 'chamadas']),
      targeting: this.extractSection(content, ['segmentação', 'público']),
      interests: this.extractList(content, ['interesses', 'targeting']),
      creatives: this.extractSection(content, ['criativos', 'visuais']),
      full_strategy: content
    };
  }

  private static parseEmailResponse(content: string): any {
    return {
      type: 'email',
      sequence: this.extractEmailSequence(content),
      full_sequence: content
    };
  }

  private static parseFunnelResponse(content: string): any {
    return {
      type: 'funnel',
      strategy: this.extractSection(content, ['estratégia', 'atração']),
      landing_page: this.extractSection(content, ['página de captura', 'landing']),
      email_sequence: this.extractSection(content, ['sequência', 'emails']),
      sales_page: this.extractSection(content, ['página de vendas', 'checkout']),
      upsells: this.extractSection(content, ['upsells', 'ofertas adicionais']),
      metrics: this.extractSection(content, ['métricas', 'kpis']),
      full_funnel: content
    };
  }

  private static parseAnalysisResponse(content: string, videoUrl: string): any {
    return {
      type: 'analysis',
      video_url: videoUrl,
      structure: this.extractSection(content, ['estrutura', 'narrativa']),
      triggers: this.extractSection(content, ['gatilhos', 'persuasão']),
      ctas: this.extractSection(content, ['ctas', 'ofertas']),
      strengths: this.extractSection(content, ['pontos fortes', 'forças']),
      weaknesses: this.extractSection(content, ['pontos fracos', 'fraquezas']),
      optimizations: this.extractSection(content, ['otimizações', 'melhorias']),
      full_analysis: content
    };
  }

  private static parseStrategyResponse(content: string): any {
    return {
      type: 'strategy',
      market_analysis: this.extractSection(content, ['análise de mercado', 'mercado']),
      positioning: this.extractSection(content, ['posicionamento', 'estratégico']),
      customer_journey: this.extractSection(content, ['jornada', 'cliente']),
      channels: this.extractSection(content, ['canais', 'aquisição']),
      content_strategy: this.extractSection(content, ['conteúdo', 'estratégia']),
      metrics: this.extractSection(content, ['métricas', 'kpis']),
      timeline: this.extractSection(content, ['cronograma', 'execução']),
      budget: this.extractSection(content, ['orçamento', 'investimento']),
      full_strategy: content
    };
  }

  // Utility methods for content extraction
  private static extractSection(content: string, keywords: string[]): string {
    const lines = content.split('\n');
    let sectionStart = -1;
    let sectionEnd = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (keywords.some(keyword => line.includes(keyword.toLowerCase()))) {
        sectionStart = i;
        break;
      }
    }

    if (sectionStart === -1) return '';

    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^\d+\./) || line.match(/^[A-Z][^:]*:/) || line === '') {
        if (line === '' && i < lines.length - 1) continue;
        sectionEnd = i;
        break;
      }
    }

    if (sectionEnd === -1) sectionEnd = lines.length;

    return lines.slice(sectionStart, sectionEnd).join('\n').trim();
  }

  private static extractList(content: string, keywords: string[]): string[] {
    const section = this.extractSection(content, keywords);
    return section.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  private static extractEmailSequence(content: string): any[] {
    const emails = [];
    const lines = content.split('\n');
    let currentEmail: any = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/email\s*\d+/i) || trimmed.match(/dia\s*\d+/i)) {
        if (currentEmail) emails.push(currentEmail);
        currentEmail = { day: emails.length + 1, subject: '', content: '' };
      } else if (trimmed.toLowerCase().includes('assunto:') || trimmed.toLowerCase().includes('subject:')) {
        if (currentEmail) currentEmail.subject = trimmed.replace(/assunto:|subject:/i, '').trim();
      } else if (currentEmail && trimmed.length > 0) {
        currentEmail.content += trimmed + '\n';
      }
    }

    if (currentEmail) emails.push(currentEmail);
    return emails;
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

  // Generate AI content with enhanced options
  app.post('/api/ai/generate', authenticate, async (req, res) => {
    try {
      const { type, prompt, options = {} } = req.body;
      const userId = req.user.id;

      if (!type || !prompt) {
        return res.status(400).json({ error: 'Tipo e prompt são obrigatórios' });
      }

      // Check user credits
      const user = await storage.getUser(userId);
      const creditsRequired = getCreditsForType(type);
      
      if (!user || user.furionCredits < creditsRequired) {
        return res.status(400).json({ error: 'Créditos insuficientes' });
      }

      // Generate content with real AI
      const content = await AIService.generateContent(type, prompt, options);

      // Update user credits
      await storage.updateUserCredits(userId, user.furionCredits - creditsRequired);

      res.json({
        success: true,
        content,
        creditsUsed: creditsRequired,
        remainingCredits: user.furionCredits - creditsRequired
      });
    } catch (error) {
      console.error('AI generation error:', error);
      res.status(500).json({ error: error.message || 'Erro na geração de conteúdo' });
    }
  });

  // Add link to project
  app.post('/api/projects/:id/links', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { url, title, type } = req.body;
      const userId = req.user.id;

      if (!url || !title || !type) {
        return res.status(400).json({ error: 'URL, título e tipo são obrigatórios' });
      }

      const project = await storage.getProject(id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: 'URL inválida' });
      }

      const linkData = {
        id: Date.now().toString(),
        url,
        title,
        type,
        createdAt: new Date().toISOString()
      };

      const updatedProject = await storage.updateProject(id, {
        links: [...(project.links || []), linkData]
      });

      res.json({
        success: true,
        link: linkData,
        project: updatedProject
      });
    } catch (error) {
      console.error('Error adding link:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Remove link from project
  app.delete('/api/projects/:id/links/:linkId', authenticate, async (req, res) => {
    try {
      const { id, linkId } = req.params;
      const userId = req.user.id;

      const project = await storage.getProject(id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      const updatedLinks = (project.links || []).filter(link => link.id !== linkId);
      const updatedProject = await storage.updateProject(id, {
        links: updatedLinks
      });

      res.json({
        success: true,
        project: updatedProject
      });
    } catch (error) {
      console.error('Error removing link:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Analyze video URL
  app.post('/api/analyze-video', authenticate, async (req, res) => {
    try {
      const { videoUrl, prompt = 'Análise geral' } = req.body;
      const userId = req.user.id;

      if (!videoUrl) {
        return res.status(400).json({ error: 'URL do vídeo é obrigatória' });
      }

      // Validate video URL
      if (!isValidVideoUrl(videoUrl)) {
        return res.status(400).json({ error: 'URL de vídeo inválida. Use URLs do YouTube, Vimeo ou similares.' });
      }

      // Check user credits
      const user = await storage.getUser(userId);
      if (!user || user.furionCredits < 12) {
        return res.status(400).json({ error: 'Créditos insuficientes para análise de vídeo' });
      }

      // Analyze video with AI
      const analysis = await AIService.analyzeVideo(videoUrl, prompt);

      // Update user credits
      await storage.updateUserCredits(userId, user.furionCredits - 12);

      res.json({
        success: true,
        analysis,
        creditsUsed: 12,
        remainingCredits: user.furionCredits - 12
      });
    } catch (error) {
      console.error('Video analysis error:', error);
      res.status(500).json({ error: error.message || 'Erro na análise do vídeo' });
    }
  });

  // Export project content
  app.get('/api/projects/:id/export', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { format = 'json' } = req.query;
      const userId = req.user.id;

      const project = await storage.getProject(id);
      if (!project || project.userId !== userId) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      if (project.status !== 'completed') {
        return res.status(400).json({ error: 'Projeto ainda não foi concluído' });
      }

      const exportData = {
        id: project.id,
        title: project.title,
        type: project.type,
        content: project.content,
        links: project.links || [],
        createdAt: project.createdAt,
        exportedAt: new Date().toISOString()
      };

      if (format === 'pdf') {
        // Generate PDF export (placeholder for now)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${project.title}.pdf"`);
        res.json({ error: 'Exportação PDF em desenvolvimento' });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${project.title}.json"`);
        res.json(exportData);
      }
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: 'Erro na exportação' });
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

// Helper functions
function getCreditsForType(type: string): number {
  const creditMap: Record<string, number> = {
    'copy': 8,
    'vsl': 15,
    'ads': 10,
    'email': 12,
    'funnel': 20,
    'landing': 12,
    'analysis': 12,
    'strategy': 18
  };
  return creditMap[type] || 8;
}

function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    return ['youtube.com', 'www.youtube.com', 'youtu.be', 'vimeo.com', 'www.vimeo.com'].includes(domain);
  } catch {
    return false;
  }
}

// Authentication middleware
function authenticate(req: any, res: any, next: any) {
  // For development, create a mock user
  req.user = {
    id: 'user_1',
    name: 'Demo User',
    email: 'demo@example.com',
    furionCredits: 1000
  };
  next();
}