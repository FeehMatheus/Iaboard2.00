import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219

interface AIProvider {
  name: string;
  enabled: boolean;
  priority: number;
  rateLimit: number;
  currentUsage: number;
}

interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  success: boolean;
  content: string;
  model: string;
  provider: string;
  tokensUsed: number;
  error?: string;
}

class HybridAISystem {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private providers: AIProvider[] = [];
  private currentProviderIndex = 0;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      this.providers.push({
        name: 'openai',
        enabled: true,
        priority: 1,
        rateLimit: 1000, // requests per hour
        currentUsage: 0
      });
    }

    // Initialize Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      this.providers.push({
        name: 'anthropic',
        enabled: true,
        priority: 2,
        rateLimit: 500, // requests per hour
        currentUsage: 0
      });
    }

    // Add other free providers here if needed
    console.log(`Initialized ${this.providers.length} AI providers`);
  }

  async generateContent(request: AIRequest): Promise<AIResponse> {
    const availableProviders = this.providers
      .filter(p => p.enabled && p.currentUsage < p.rateLimit)
      .sort((a, b) => a.priority - b.priority);

    if (availableProviders.length === 0) {
      return {
        success: false,
        content: '',
        model: '',
        provider: '',
        tokensUsed: 0,
        error: 'Todos os provedores de IA atingiram o limite de uso'
      };
    }

    for (const provider of availableProviders) {
      try {
        const result = await this.executeWithProvider(provider.name, request);
        provider.currentUsage++;
        return result;
      } catch (error) {
        console.error(`Erro no provedor ${provider.name}:`, error);
        continue;
      }
    }

    return {
      success: false,
      content: '',
      model: '',
      provider: '',
      tokensUsed: 0,
      error: 'Falha em todos os provedores de IA'
    };
  }

  private async executeWithProvider(providerName: string, request: AIRequest): Promise<AIResponse> {
    switch (providerName) {
      case 'openai':
        return this.executeOpenAI(request);
      case 'anthropic':
        return this.executeAnthropic(request);
      default:
        throw new Error(`Provedor desconhecido: ${providerName}`);
    }
  }

  private async executeOpenAI(request: AIRequest): Promise<AIResponse> {
    if (!this.openai) throw new Error('OpenAI não configurado');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: request.systemPrompt || 'Você é um especialista em marketing digital e criação de produtos. Responda em português com conteúdo prático e implementável.' 
        },
        { role: 'user', content: request.prompt }
      ],
      max_tokens: request.maxTokens || 4000,
      temperature: request.temperature || 0.7,
    });

    return {
      success: true,
      content: response.choices[0].message.content || '',
      model: 'gpt-4o',
      provider: 'openai',
      tokensUsed: response.usage?.total_tokens || 0
    };
  }

  private async executeAnthropic(request: AIRequest): Promise<AIResponse> {
    if (!this.anthropic) throw new Error('Anthropic não configurado');

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: request.maxTokens || 4000,
      messages: [{ role: 'user', content: request.prompt }],
      system: request.systemPrompt || 'Você é um especialista em marketing digital e criação de produtos. Responda em português com conteúdo prático e implementável.'
    });

    const textContent = response.content[0] && 'text' in response.content[0] ? response.content[0].text : '';
    
    return {
      success: true,
      content: textContent,
      model: 'claude-sonnet-4-20250514',
      provider: 'anthropic',
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0
    };
  }

  // Specialized generation methods for each module
  async generateCopy(prompt: string, niche: string, targetAudience: string, objective: string): Promise<AIResponse> {
    const systemPrompt = `Você é um copywriter especialista com 20 anos de experiência em marketing digital. Crie copy persuasivo e de alta conversão em português brasileiro usando técnicas como AIDA, PAS, storytelling e gatilhos mentais.`;
    
    const fullPrompt = `
Crie um copy completo e persuasivo para:

**CONTEXTO:**
- Nicho: ${niche}
- Público-alvo: ${targetAudience}
- Objetivo: ${objective}
- Prompt específico: ${prompt}

**DELIVERABLES (estruture sua resposta com estes tópicos):**

## 1. HEADLINES MAGNÉTICOS (5 variações)
[Crie 5 headlines irresistíveis]

## 2. SUBHEADLINES EXPLICATIVOS
[3 subheadlines que complementam os headlines]

## 3. BULLETS DE BENEFÍCIOS (10 bullets)
[Use técnicas como "Como", "Sem", "Mesmo que"]

## 4. PROVA SOCIAL
[Depoimentos, cases, números de impacto]

## 5. OFERTA IRRESISTÍVEL
[Estruture a oferta principal + bônus]

## 6. CALLS-TO-ACTION (5 CTAs)
[CTAs poderosos e específicos]

## 7. URGÊNCIA E ESCASSEZ
[Gatilhos de tempo e quantidade limitada]

## 8. GARANTIA
[Garantia forte que remove objeções]

## 9. FAQ - ANTECIPANDO OBJEÇÕES
[5 perguntas e respostas estratégicas]

## 10. SEQUÊNCIA DE EMAIL MARKETING
[3 emails: aquecimento, venda, urgência]

Use linguagem persuasiva, gatilhos mentais e técnicas de neuromarketing.
`;

    return this.generateContent({
      prompt: fullPrompt,
      systemPrompt,
      maxTokens: 4000
    });
  }

  async generateProduct(idea: string, market: string, budget: string, timeline: string): Promise<AIResponse> {
    const systemPrompt = `Você é um consultor sênior em desenvolvimento de produtos digitais e estratégia de negócios. Crie estratégias detalhadas e implementáveis baseadas em metodologias ágeis e lean startup.`;
    
    const fullPrompt = `
Desenvolva uma estratégia completa de produto digital para:

**BRIEF DO PROJETO:**
- Ideia/Conceito: ${idea}
- Mercado-alvo: ${market}
- Orçamento disponível: ${budget}
- Timeline: ${timeline}

**DELIVERABLES (estruture sua resposta com estes tópicos):**

## 1. ANÁLISE DE MERCADO
[Tamanho, tendências, oportunidades]

## 2. ANÁLISE DA CONCORRÊNCIA
[Principais players, gaps de mercado, diferenciação]

## 3. PROPOSTA DE VALOR ÚNICA (UVP)
[O que torna este produto único e desejável]

## 4. MVP - PRODUTO MÍNIMO VIÁVEL
[Funcionalidades essenciais para validação]

## 5. ROADMAP DE DESENVOLVIMENTO
[Fases, marcos, entregas por sprint]

## 6. ESTRATÉGIA DE PRICING
[Modelos de precificação, tiers, teste de preços]

## 7. CANAIS DE DISTRIBUIÇÃO
[Como e onde vender o produto]

## 8. MÉTRICAS DE SUCESSO (KPIs)
[Indicadores de performance e crescimento]

## 9. PLANO DE LANÇAMENTO
[Go-to-market strategy, cronograma, táticas]

## 10. ANÁLISE DE RISCOS
[Principais riscos e estratégias de mitigação]

## 11. PROJEÇÕES FINANCEIRAS
[Revenue, custos, break-even, ROI]

## 12. ESTRATÉGIA DE CRESCIMENTO
[Escalabilidade, expansão, novos mercados]

Baseie-se em cases reais e metodologias comprovadas.
`;

    return this.generateContent({
      prompt: fullPrompt,
      systemPrompt,
      maxTokens: 4000
    });
  }

  async generateTraffic(business: string, budget: string, goals: string, platforms: string): Promise<AIResponse> {
    const systemPrompt = `Você é um especialista em marketing digital e tráfego pago/orgânico com certificações nas principais plataformas (Google, Meta, LinkedIn). Crie estratégias baseadas em dados e best practices atuais.`;
    
    const fullPrompt = `
Desenvolva uma estratégia completa de tráfego digital para:

**BRIEFING:**
- Negócio: ${business}
- Orçamento mensal: ${budget}
- Objetivos: ${goals}
- Plataformas prioritárias: ${platforms}

**DELIVERABLES (estruture sua resposta com estes tópicos):**

## 1. ESTRATÉGIA DE TRÁFEGO PAGO
[Google Ads, Facebook/Instagram Ads, LinkedIn Ads]

## 2. ESTRATÉGIA DE TRÁFEGO ORGÂNICO
[SEO, redes sociais, content marketing, email]

## 3. SEGMENTAÇÃO DE AUDIÊNCIA
[Personas, interesses, comportamentos, lookalikes]

## 4. COPIES PARA ANÚNCIOS
[Headlines, descrições, CTAs para cada plataforma]

## 5. LANDING PAGES OTIMIZADAS
[Estrutura, elementos de conversão, testes]

## 6. FUNIS DE CONVERSÃO
[Awareness → Consideration → Decision → Retention]

## 7. ESTRATÉGIAS DE REMARKETING
[Pixels, audiências customizadas, sequências]

## 8. DISTRIBUIÇÃO DE ORÇAMENTO
[Alocação por plataforma e objetivo]

## 9. KPIs E MÉTRICAS
[CPM, CPC, CTR, CPA, ROAS, LTV]

## 10. CRONOGRAMA DE EXECUÇÃO
[Timeline de 90 dias com marcos]

## 11. TESTES A/B SUGERIDOS
[Criativos, audiências, ofertas, landing pages]

## 12. OTIMIZAÇÕES CONTÍNUAS
[Análise de dados, ajustes, escalabilidade]

Inclua números específicos, benchmarks do setor e táticas avançadas.
`;

    return this.generateContent({
      prompt: fullPrompt,
      systemPrompt,
      maxTokens: 4000
    });
  }

  async generateVideo(concept: string, duration: string, style: string, objective: string): Promise<AIResponse> {
    const systemPrompt = `Você é um especialista em produção de conteúdo em vídeo e storytelling para marketing digital. Crie roteiros envolventes que convertem visualizações em ações.`;
    
    const fullPrompt = `
Desenvolva um roteiro completo de vídeo para:

**BRIEFING:**
- Conceito: ${concept}
- Duração: ${duration}
- Estilo: ${style}
- Objetivo: ${objective}

**DELIVERABLES (estruture sua resposta com estes tópicos):**

## 1. CONCEITO CRIATIVO
[Hook, mensagem principal, tom de voz]

## 2. ROTEIRO DETALHADO
[Cena por cena com tempos específicos]

## 3. HOOK DOS PRIMEIROS 3 SEGUNDOS
[Como capturar atenção imediatamente]

## 4. ESTRUTURA NARRATIVA
[Problema → Agitação → Solução → Prova → CTA]

## 5. ELEMENTOS VISUAIS
[Cenas, transições, gráficos, textos]

## 6. TRILHA SONORA E EFEITOS
[Música, sound effects, timing]

## 7. CALL-TO-ACTIONS
[Quando e como inserir CTAs efetivos]

## 8. THUMBNAILS SUGERIDOS
[5 opções de capa para testes]

## 9. TÍTULOS PARA DIFERENTES PLATAFORMAS
[YouTube, Instagram, TikTok, LinkedIn]

## 10. DISTRIBUIÇÃO MULTIPLATAFORMA
[Adaptações para cada rede social]

## 11. MÉTRICAS DE PERFORMANCE
[KPIs específicos para vídeo marketing]

## 12. VARIAÇÕES PARA TESTE
[Diferentes abordagens do mesmo conceito]

Foque em engajamento, retenção e conversão.
`;

    return this.generateContent({
      prompt: fullPrompt,
      systemPrompt,
      maxTokens: 4000
    });
  }

  async generateAnalytics(business: string, metrics: string, goals: string, platforms: string): Promise<AIResponse> {
    const systemPrompt = `Você é um especialista em analytics e data science para marketing digital. Crie estratégias de mensuração e otimização baseadas em dados.`;
    
    const fullPrompt = `
Desenvolva uma estratégia completa de analytics para:

**CONTEXTO:**
- Negócio: ${business}
- Métricas prioritárias: ${metrics}
- Objetivos: ${goals}
- Plataformas: ${platforms}

**DELIVERABLES (estruture sua resposta com estes tópicos):**

## 1. CONFIGURAÇÃO DE TRACKING
[Google Analytics 4, Facebook Pixel, etc.]

## 2. EVENTOS CUSTOMIZADOS
[Conversões, micro-conversões, engajamento]

## 3. DASHBOARDS ESSENCIAIS
[KPIs principais, visualizações, alertas]

## 4. FUNIS DE CONVERSÃO
[Análise de drop-off e otimizações]

## 5. SEGMENTAÇÃO DE AUDIÊNCIA
[Comportamento, demografia, interesses]

## 6. ANÁLISE DE COHORT
[Retenção, LTV, churn rate]

## 7. ATRIBUIÇÃO MULTICANAL
[First-click, last-click, data-driven]

## 8. ANÁLISE COMPETITIVA
[Benchmarks, share of voice, gaps]

## 9. RELATÓRIOS AUTOMATIZADOS
[Frequency, stakeholders, formato]

## 10. TESTES ESTATÍSTICOS
[A/B tests, significância, sample size]

## 11. PREDIÇÕES E FORECASTING
[Trends, seasonality, growth projections]

## 12. RECOMENDAÇÕES ACIONÁVEIS
[Insights específicos para otimização]

Inclua ferramentas específicas, fórmulas e implementação técnica.
`;

    return this.generateContent({
      prompt: fullPrompt,
      systemPrompt,
      maxTokens: 4000
    });
  }

  getProviderStatus(): AIProvider[] {
    return this.providers;
  }

  resetUsage() {
    this.providers.forEach(provider => {
      provider.currentUsage = 0;
    });
  }
}

export const hybridAISystem = new HybridAISystem();