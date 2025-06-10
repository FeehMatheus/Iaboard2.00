import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface TrafficCampaignRequest {
  produto: string;
  avatar: string;
  oferta: string;
  nicho: string;
  orcamento: number;
  objetivo: 'vendas' | 'leads' | 'awareness' | 'trafego';
  plataforma: 'meta' | 'google' | 'tiktok' | 'youtube' | 'todas';
  publico: {
    idade: string;
    genero: string;
    interesses: string[];
    comportamentos: string[];
    localizacao: string;
  };
}

interface CampaignContent {
  nome: string;
  plataforma: string;
  configuracao: {
    objetivo: string;
    orcamentoDiario: number;
    segmentacao: {
      idade: string;
      genero: string;
      interesses: string[];
      comportamentos: string[];
      localizacoes: string[];
    };
    cronograma: string;
  };
  criativos: {
    tipo: 'imagem' | 'video' | 'carrossel';
    titulo: string;
    descricao: string;
    cta: string;
    texto: string;
    sugestaoVisual: string;
  }[];
  variacoesAB: {
    variacao: string;
    elemento: string;
    versao1: string;
    versao2: string;
    hipotese: string;
  }[];
  predicoes: {
    ctr: number;
    cpc: number;
    conversoes: number;
    roi: number;
    alcance: number;
  };
  otimizacoes: string[];
}

export class TrafficAIModule {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateTrafficCampaign(request: TrafficCampaignRequest): Promise<CampaignContent[]> {
    const campaigns: CampaignContent[] = [];

    if (request.plataforma === 'todas') {
      const platforms = ['meta', 'google', 'tiktok', 'youtube'];
      for (const platform of platforms) {
        const campaign = await this.generateSingleCampaign({
          ...request,
          plataforma: platform as any
        });
        campaigns.push(campaign);
      }
    } else {
      const campaign = await this.generateSingleCampaign(request);
      campaigns.push(campaign);
    }

    return campaigns;
  }

  private async generateSingleCampaign(request: TrafficCampaignRequest): Promise<CampaignContent> {
    const prompt = `
📈 HYPERTRAFFIC AI™ - Geração de Campanha Inteligente

DADOS DO PROJETO:
- Produto: ${request.produto}
- Avatar: ${request.avatar}
- Oferta: ${request.oferta}
- Nicho: ${request.nicho}
- Orçamento: R$ ${request.orcamento}
- Objetivo: ${request.objetivo}
- Plataforma: ${request.plataforma.toUpperCase()}
- Público: ${JSON.stringify(request.publico)}

MISSÃO: Crie uma campanha completa de tráfego pago otimizada para alta conversão na plataforma ${request.plataforma.toUpperCase()}.

ESTRUTURA OBRIGATÓRIA:

1. NOME DA CAMPANHA (criativo e estratégico)

2. CONFIGURAÇÃO TÉCNICA:
   - Objetivo da campanha específico da plataforma
   - Orçamento diário otimizado
   - Segmentação detalhada (interesses, comportamentos, lookalike)
   - Cronograma de veiculação

3. CRIATIVOS MÚLTIPLOS (mínimo 3):
   - Títulos magnéticos (máximo 25 caracteres para Meta)
   - Descrições persuasivas
   - CTAs de alta conversão
   - Sugestões visuais específicas

4. VARIAÇÕES A/B ESTRATÉGICAS:
   - Teste de títulos
   - Teste de CTAs
   - Teste de públicos
   - Hipóteses de performance

5. PREDIÇÕES DE PERFORMANCE:
   - CTR estimado baseado no nicho
   - CPC médio esperado
   - Conversões projetadas
   - ROI estimado
   - Alcance potencial

ESPECIFICIDADES POR PLATAFORMA:
${this.getPlatformSpecificGuidelines(request.plataforma)}

RESULTADO: Retorne em formato JSON estruturado com dados precisos e acionáveis.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em tráfego pago com 15 anos de experiência. Já gerou mais de R$ 500 milhões em vendas através de campanhas otimizadas. Conhece deeply todas as plataformas de ads. Responda sempre em JSON válido com dados realistas baseados em benchmarks do mercado.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000
      });

      const campaignData = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        nome: campaignData.nome || `${request.produto} - ${request.plataforma.toUpperCase()} Campaign`,
        plataforma: request.plataforma,
        configuracao: campaignData.configuracao || this.getDefaultConfiguration(request),
        criativos: campaignData.criativos || this.getDefaultCreatives(request),
        variacoesAB: campaignData.variacoesAB || this.getDefaultABTests(request),
        predicoes: campaignData.predicoes || this.calculatePredictions(request),
        otimizacoes: campaignData.otimizacoes || this.getOptimizationTips(request)
      };

    } catch (error) {
      console.error('Erro na geração de campanha:', error);
      return this.generateFallbackCampaign(request);
    }
  }

  async analyzeCampaignPerformance(campaignData: any, actualMetrics: any): Promise<any> {
    const prompt = `
🔍 ANÁLISE PREDITIVA DE PERFORMANCE

DADOS DA CAMPANHA:
${JSON.stringify(campaignData)}

MÉTRICAS REAIS:
${JSON.stringify(actualMetrics)}

ANÁLISE SOLICITADA:
1. Compare performance esperada vs. real
2. Identifique oportunidades de otimização
3. Sugira ajustes específicos em:
   - Segmentação
   - Criativos
   - Orçamento
   - Cronograma
4. Projete melhorias de performance
5. Recomende próximos passos

Foque em dados concretos e ações específicas.
Retorne em JSON estruturado.
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      });

      const analysisText = response.content[0].type === 'text' ? response.content[0].text : '';
      
      try {
        return JSON.parse(analysisText);
      } catch {
        return {
          performance: 'Análise em processamento',
          otimizacoes: ['Aguarde resultados preliminares'],
          proximosPassos: ['Coletar mais dados de performance']
        };
      }

    } catch (error) {
      console.error('Erro na análise de performance:', error);
      return {
        erro: 'Análise temporariamente indisponível',
        fallback: 'Continue monitorando as métricas manualmente'
      };
    }
  }

  async generateCompetitorAdsAnalysis(nicho: string, plataforma: string): Promise<any> {
    const prompt = `
🕵️ IA ESPIÃ DE ANÚNCIOS - Análise Competitiva

NICHO: ${nicho}
PLATAFORMA: ${plataforma.toUpperCase()}

Analise os padrões de anúncios de alta performance neste nicho:

1. CRIATIVOS DOMINANTES:
   - Tipos de imagem/vídeo mais utilizados
   - Cores e estilos predominantes
   - Elementos visuais que convertem

2. COPY PATTERNS:
   - Headlines mais eficazes
   - Estruturas de texto vencedoras
   - CTAs de maior conversão
   - Gatilhos mentais recorrentes

3. ESTRATÉGIAS DE SEGMENTAÇÃO:
   - Públicos mais rentáveis
   - Interesses de alta conversão
   - Comportamentos valiosos

4. OFERTAS E POSICIONAMENTO:
   - Tipos de oferta predominantes
   - Faixas de preço competitivas
   - Diferenciadores únicos

5. OPORTUNIDADES IDENTIFICADAS:
   - Gaps no mercado
   - Abordagens não exploradas
   - Nichos específicos negligenciados

6. RECOMENDAÇÕES ESTRATÉGICAS:
   - Como se diferenciar
   - Onde focar o orçamento
   - Quando escalar

Retorne insights acionáveis em JSON.
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3500,
        messages: [{ role: 'user', content: prompt }],
      });

      const analysisText = response.content[0].type === 'text' ? response.content[0].text : '';
      
      try {
        return JSON.parse(analysisText);
      } catch {
        return {
          criativosDominantes: ['Vídeos testemunhais', 'Antes e depois'],
          copyPatterns: ['Headlines com números', 'CTAs de urgência'],
          segmentacao: ['Interesse em produto similar', 'Lookalike de compradores'],
          ofertas: ['Desconto por tempo limitado'],
          oportunidades: ['Abordagem mais educativa'],
          recomendacoes: ['Foque na diferenciação visual']
        };
      }

    } catch (error) {
      console.error('Erro na análise de concorrentes:', error);
      return {
        erro: 'Análise temporariamente indisponível',
        fallback: 'Use benchmarks gerais do setor'
      };
    }
  }

  private getPlatformSpecificGuidelines(plataforma: string): string {
    const guidelines = {
      meta: `
META ADS ESPECÍFICO:
- Títulos: máximo 25 caracteres
- Descrição: máximo 125 caracteres
- Use Custom Audiences e Lookalike
- Teste formatos: feed, stories, reels
- Foque em engajamento inicial (CTR alto)`,

      google: `
GOOGLE ADS ESPECÍFICO:
- Headlines: 30 caracteres cada
- Descrições: 90 caracteres cada
- Use palavras-chave exatas e de frase
- Extensões de anúncio obrigatórias
- Landing page relevante e rápida`,

      tiktok: `
TIKTOK ADS ESPECÍFICO:
- Criativos nativos da plataforma
- Vídeos verticais autênticos
- Hashtags trending relevantes
- Targeting por interesses específicos
- CTA natural no vídeo`,

      youtube: `
YOUTUBE ADS ESPECÍFICO:
- Hooks nos primeiros 5 segundos
- Storytelling envolvente
- CTAs verbais e visuais
- Segmentação por canais e vídeos
- Remarketing de visualizadores`
    };

    return guidelines[plataforma as keyof typeof guidelines] || '';
  }

  private getDefaultConfiguration(request: TrafficCampaignRequest) {
    const dailyBudget = Math.max(request.orcamento / 30, 50);
    
    return {
      objetivo: this.mapObjective(request.objetivo, request.plataforma),
      orcamentoDiario: dailyBudget,
      segmentacao: {
        idade: request.publico.idade,
        genero: request.publico.genero,
        interesses: request.publico.interesses,
        comportamentos: request.publico.comportamentos,
        localizacoes: [request.publico.localizacao]
      },
      cronograma: 'Ativo 24h - Otimizado para horários de pico'
    };
  }

  private getDefaultCreatives(request: TrafficCampaignRequest) {
    return [
      {
        tipo: 'imagem' as const,
        titulo: `${request.produto} - Transforme Sua Vida`,
        descricao: `Descubra como ${request.avatar} estão alcançando resultados extraordinários`,
        cta: 'QUERO SABER MAIS',
        texto: `🎯 Atenção ${request.avatar}!\n\n${request.oferta}\n\n✅ Resultados comprovados\n✅ Método exclusivo\n✅ Garantia total`,
        sugestaoVisual: 'Imagem do produto com depoimento real de cliente'
      },
      {
        tipo: 'video' as const,
        titulo: `${request.produto} Funciona?`,
        descricao: 'Veja a prova real em 60 segundos',
        cta: 'ASSISTIR AGORA',
        texto: `🔥 PROVA REAL!\n\nVeja como ${request.produto} transformou a vida de centenas de pessoas.\n\n⏱️ Apenas 60 segundos que podem mudar tudo!`,
        sugestaoVisual: 'Vídeo com antes/depois e depoimentos'
      },
      {
        tipo: 'carrossel' as const,
        titulo: `3 Passos Para o Sucesso`,
        descricao: 'O método que realmente funciona',
        cta: 'COMEÇAR HOJE',
        texto: `📈 O MÉTODO EM 3 PASSOS:\n\n1️⃣ Descubra o segredo\n2️⃣ Aplique a estratégia\n3️⃣ Colha os resultados\n\n${request.oferta}`,
        sugestaoVisual: 'Carrossel mostrando cada passo do processo'
      }
    ];
  }

  private getDefaultABTests(request: TrafficCampaignRequest) {
    return [
      {
        variacao: 'Teste de Título',
        elemento: 'headline',
        versao1: `${request.produto} - Transforme Sua Vida`,
        versao2: `Como ${request.avatar} Estão Lucrando`,
        hipotese: 'Foco em transformação vs. comunidade social'
      },
      {
        variacao: 'Teste de CTA',
        elemento: 'call-to-action',
        versao1: 'QUERO SABER MAIS',
        versao2: 'COMEÇAR AGORA',
        hipotese: 'Curiosidade vs. ação imediata'
      },
      {
        variacao: 'Teste de Público',
        elemento: 'targeting',
        versao1: 'Interesses amplos',
        versao2: 'Lookalike de compradores',
        hipotese: 'Alcance vs. qualidade do tráfego'
      }
    ];
  }

  private calculatePredictions(request: TrafficCampaignRequest) {
    const baseCTR = this.getBaseCTR(request.nicho, request.plataforma);
    const baseCPC = this.getBaseCPC(request.nicho, request.plataforma);
    const dailyBudget = Math.max(request.orcamento / 30, 50);
    
    return {
      ctr: baseCTR,
      cpc: baseCPC,
      conversoes: Math.round((dailyBudget / baseCPC) * 0.02 * 30), // 2% conversion rate
      roi: 3.5, // Conservative estimate
      alcance: Math.round((dailyBudget / baseCPC) * 1000) // CPM approximation
    };
  }

  private getBaseCTR(nicho: string, plataforma: string): number {
    const benchmarks: Record<string, Record<string, number>> = {
      meta: { default: 1.2, saude: 1.8, financeiro: 0.9, educacao: 1.5 },
      google: { default: 2.1, saude: 2.8, financeiro: 1.5, educacao: 2.3 },
      tiktok: { default: 1.5, saude: 2.1, financeiro: 1.0, educacao: 1.8 },
      youtube: { default: 0.8, saude: 1.2, financeiro: 0.6, educacao: 1.0 }
    };

    return benchmarks[plataforma]?.[nicho] || benchmarks[plataforma]?.default || 1.2;
  }

  private getBaseCPC(nicho: string, plataforma: string): number {
    const benchmarks: Record<string, Record<string, number>> = {
      meta: { default: 1.5, saude: 2.2, financeiro: 3.8, educacao: 1.8 },
      google: { default: 2.8, saude: 4.1, financeiro: 6.2, educacao: 2.9 },
      tiktok: { default: 1.2, saude: 1.8, financeiro: 2.9, educacao: 1.4 },
      youtube: { default: 0.8, saude: 1.1, financeiro: 1.9, educacao: 0.9 }
    };

    return benchmarks[plataforma]?.[nicho] || benchmarks[plataforma]?.default || 1.5;
  }

  private getOptimizationTips(request: TrafficCampaignRequest): string[] {
    return [
      'Monitore CTR nas primeiras 48h - pause anúncios com CTR < 1%',
      'Ajuste orçamento para ad sets com CPA abaixo da meta',
      'Teste novos criativos semanalmente',
      'Expanda públicos com melhor performance',
      'Otimize landing page para mobile (80% do tráfego)',
      'Configure pixel de conversão e eventos personalizados'
    ];
  }

  private mapObjective(objetivo: string, plataforma: string): string {
    const mapping: Record<string, Record<string, string>> = {
      meta: {
        vendas: 'Conversões - Compras',
        leads: 'Geração de cadastros',
        awareness: 'Reconhecimento da marca',
        trafego: 'Tráfego para site'
      },
      google: {
        vendas: 'Vendas',
        leads: 'Leads',
        awareness: 'Notoriedade da marca',
        trafego: 'Tráfego do website'
      },
      tiktok: {
        vendas: 'Conversions',
        leads: 'Lead Generation',
        awareness: 'Reach',
        trafego: 'Traffic'
      },
      youtube: {
        vendas: 'Drive conversions',
        leads: 'Get leads',
        awareness: 'Build awareness',
        trafego: 'Get website traffic'
      }
    };

    return mapping[plataforma]?.[objetivo] || objetivo;
  }

  private generateFallbackCampaign(request: TrafficCampaignRequest): CampaignContent {
    return {
      nome: `${request.produto} - Campanha ${request.plataforma.toUpperCase()}`,
      plataforma: request.plataforma,
      configuracao: this.getDefaultConfiguration(request),
      criativos: this.getDefaultCreatives(request),
      variacoesAB: this.getDefaultABTests(request),
      predicoes: this.calculatePredictions(request),
      otimizacoes: this.getOptimizationTips(request)
    };
  }
}

export const trafficAIModule = new TrafficAIModule();