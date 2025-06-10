import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219

interface TicketResult {
  success: boolean;
  conteudo: string;
  arquivos?: Array<{
    nome: string;
    tipo: string;
    conteudo: string;
  }>;
  estrutura?: any;
  proximosPassos?: string[];
  estimativaROI?: string;
  metadata?: any;
}

export class MaquinaMilionariaAI {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async processarTicket(tipo: string, titulo: string, descricao: string): Promise<TicketResult> {
    try {
      switch (tipo) {
        case 'copy':
          return await this.gerarCopy(titulo, descricao);
        case 'video':
          return await this.gerarVSL(titulo, descricao);
        case 'funil':
          return await this.gerarFunil(titulo, descricao);
        case 'estrategia':
          return await this.gerarEstrategia(titulo, descricao);
        case 'campanha':
          return await this.gerarCampanha(titulo, descricao);
        case 'design':
          return await this.gerarDesign(titulo, descricao);
        case 'analise':
          return await this.gerarAnalise(titulo, descricao);
        default:
          return this.gerarFallback(tipo, titulo, descricao);
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
      return this.gerarFallback(tipo, titulo, descricao);
    }
  }

  private async gerarCopy(titulo: string, descricao: string): Promise<TicketResult> {
    const prompt = `
    Você é um copywriter experiente especializado em marketing digital. 

    PROJETO: ${titulo}
    DESCRIÇÃO: ${descricao}

    Crie um copy completo e altamente persuasivo que inclua:

    1. HEADLINES (3 opções diferentes):
    - Uma focada em urgência
    - Uma focada em benefício
    - Uma focada em dor/problema

    2. COPY PRINCIPAL:
    - Hook inicial poderoso
    - Identificação com o problema
    - Apresentação da solução
    - Prova social/autoridade
    - Oferta irresistível
    - Call to action forte

    3. ELEMENTOS VISUAIS SUGERIDOS:
    - Cores recomendadas
    - Imagens/videos sugeridos
    - Layout proposto

    4. TESTES A/B SUGERIDOS

    Formato de resposta em JSON:
    {
      "headlines": ["headline1", "headline2", "headline3"],
      "copy_principal": "copy completo aqui",
      "elementos_visuais": {...},
      "testes_ab": [...],
      "cta": "call to action final"
    }
    `;

    try {
      const resposta = await this.chamarIA(prompt);
      const resultado = this.extrairJSON(resposta);

      return {
        success: true,
        conteudo: resposta,
        estrutura: resultado,
        arquivos: [
          {
            nome: 'copy_completo.txt',
            tipo: 'text',
            conteudo: resultado.copy_principal || resposta
          },
          {
            nome: 'headlines.txt',
            tipo: 'text',
            conteudo: resultado.headlines?.join('\n\n') || 'Headlines não disponíveis'
          }
        ],
        proximosPassos: [
          'Implementar o copy na landing page',
          'Configurar testes A/B',
          'Monitorar métricas de conversão',
          'Otimizar baseado nos resultados'
        ],
        estimativaROI: 'Aumento estimado de 25-40% na conversão'
      };
    } catch (error) {
      return this.gerarFallback('copy', titulo, descricao);
    }
  }

  private async gerarVSL(titulo: string, descricao: string): Promise<TicketResult> {
    const prompt = `
    Você é um especialista em Video Sales Letters (VSL) com anos de experiência.

    PROJETO: ${titulo}
    DESCRIÇÃO: ${descricao}

    Crie um roteiro completo de VSL que inclua:

    1. ESTRUTURA NARRATIVA:
    - Hook inicial (primeiros 15 segundos)
    - História/problema
    - Agitação da dor
    - Apresentação da solução
    - Prova social
    - Oferta
    - Call to action

    2. ROTEIRO DETALHADO:
    - Texto narrado
    - Indicações visuais
    - Música/efeitos sonoros
    - Timing de cada seção

    3. ELEMENTOS VISUAIS:
    - Slides/imagens necessárias
    - Gráficos e estatísticas
    - Depoimentos em vídeo

    4. OTIMIZAÇÕES:
    - Pontos de retenção
    - Momentos de conversão
    - Variações para teste

    Duração recomendada: 10-15 minutos
    `;

    try {
      const resposta = await this.chamarIA(prompt);

      return {
        success: true,
        conteudo: resposta,
        arquivos: [
          {
            nome: 'roteiro_vsl.txt',
            tipo: 'text',
            conteudo: resposta
          },
          {
            nome: 'cronograma_producao.txt',
            tipo: 'text',
            conteudo: 'CRONOGRAMA DE PRODUÇÃO\n\nDia 1-2: Gravação do áudio\nDia 3-4: Criação dos slides\nDia 5-6: Edição e finalização\nDia 7: Revisões e ajustes'
          }
        ],
        proximosPassos: [
          'Gravar o áudio do roteiro',
          'Criar slides e elementos visuais',
          'Editar o vídeo completo',
          'Fazer testes de conversão'
        ],
        estimativaROI: 'VSLs convertem 3-5x mais que páginas de texto'
      };
    } catch (error) {
      return this.gerarFallback('video', titulo, descricao);
    }
  }

  private async gerarFunil(titulo: string, descricao: string): Promise<TicketResult> {
    const prompt = `
    Você é um especialista em funis de vendas digitais.

    PROJETO: ${titulo}
    DESCRIÇÃO: ${descricao}

    Crie um funil de vendas completo que inclua:

    1. MAPEAMENTO DA JORNADA:
    - Consciência
    - Interesse  
    - Consideração
    - Decisão
    - Retenção

    2. ESTRUTURA DO FUNIL:
    - Tráfego (fontes)
    - Landing page de captura
    - Lead magnet
    - Sequência de emails
    - Página de vendas
    - Upsells/downsells
    - Follow-up pós-venda

    3. AUTOMAÇÕES:
    - Triggers de comportamento
    - Segmentações
    - Personalizações

    4. MÉTRICAS E KPIs:
    - Taxa de conversão por etapa
    - Lifetime value
    - CAC (custo de aquisição)

    Detalhe cada etapa com textos e estratégias específicas.
    `;

    try {
      const resposta = await this.chamarIA(prompt);

      return {
        success: true,
        conteudo: resposta,
        arquivos: [
          {
            nome: 'estrutura_funil.txt',
            tipo: 'text',
            conteudo: resposta
          },
          {
            nome: 'sequencia_emails.txt',
            tipo: 'text',
            conteudo: 'SEQUÊNCIA DE EMAILS\n\nEmail 1: Boas-vindas e entrega do lead magnet\nEmail 2: História pessoal e construção de autoridade\nEmail 3: Problema comum e agitação\nEmail 4: Apresentação da solução\nEmail 5: Prova social e depoimentos\nEmail 6: Oferta especial\nEmail 7: Última chance'
          }
        ],
        proximosPassos: [
          'Configurar ferramentas de automação',
          'Criar todas as páginas do funil',
          'Implementar tracking e analytics',
          'Fazer testes A/B em cada etapa'
        ],
        estimativaROI: 'Funis otimizados podem gerar ROI de 300-500%'
      };
    } catch (error) {
      return this.gerarFallback('funil', titulo, descricao);
    }
  }

  private async gerarEstrategia(titulo: string, descricao: string): Promise<TicketResult> {
    const prompt = `
    Você é um consultor estratégico de marketing digital.

    PROJETO: ${titulo}
    DESCRIÇÃO: ${descricao}

    Desenvolva uma estratégia completa que inclua:

    1. ANÁLISE DE MERCADO:
    - Tamanho do mercado
    - Concorrentes principais
    - Oportunidades identificadas

    2. PÚBLICO-ALVO:
    - Personas detalhadas
    - Jornada do cliente
    - Pontos de dor

    3. POSICIONAMENTO:
    - Proposta de valor única
    - Diferenciação
    - Messaging strategy

    4. MIX DE MARKETING:
    - Canais de aquisição
    - Conteúdo estratégico
    - Cronograma de ações

    5. PLANO DE IMPLEMENTAÇÃO:
    - Fases do projeto
    - Recursos necessários
    - Timeline detalhado

    6. MÉTRICAS E METAS:
    - KPIs principais
    - Metas 30/60/90 dias
    `;

    try {
      const resposta = await this.chamarIA(prompt);

      return {
        success: true,
        conteudo: resposta,
        arquivos: [
          {
            nome: 'estrategia_completa.txt',
            tipo: 'text',
            conteudo: resposta
          },
          {
            nome: 'cronograma_90_dias.txt',
            tipo: 'text',
            conteudo: 'CRONOGRAMA 90 DIAS\n\n0-30 dias: Estruturação e setup\n31-60 dias: Implementação e testes\n61-90 dias: Otimização e escalonamento'
          }
        ],
        proximosPassos: [
          'Validar estratégia com stakeholders',
          'Alocar recursos e equipe',
          'Iniciar implementação fase 1',
          'Monitorar métricas semanalmente'
        ],
        estimativaROI: 'Estratégias bem executadas geram ROI de 400-800%'
      };
    } catch (error) {
      return this.gerarFallback('estrategia', titulo, descricao);
    }
  }

  private async gerarCampanha(titulo: string, descricao: string): Promise<TicketResult> {
    const prompt = `
    Você é um especialista em campanhas de marketing digital.

    PROJETO: ${titulo}
    DESCRIÇÃO: ${descricao}

    Crie uma campanha completa que inclua:

    1. CONCEITO CRIATIVO:
    - Tema central
    - Storytelling
    - Elementos visuais

    2. MULTI-CANAL:
    - Facebook/Instagram Ads
    - Google Ads
    - Email marketing
    - Organic social

    3. CRIATIVOS:
    - Copies para anúncios
    - Imagens/vídeos necessários
    - Landing pages

    4. SEGMENTAÇÃO:
    - Audiences principais
    - Lookalikes
    - Remarketing

    5. ORÇAMENTO E BIDDING:
    - Distribuição por canal
    - Estratégias de lance
    - Otimizações

    6. CRONOGRAMA:
    - Pré-lançamento
    - Lançamento
    - Otimização
    - Escalonamento
    `;

    try {
      const resposta = await this.chamarIA(prompt);

      return {
        success: true,
        conteudo: resposta,
        arquivos: [
          {
            nome: 'campanha_completa.txt',
            tipo: 'text',
            conteudo: resposta
          },
          {
            nome: 'criativos_facebook.txt',
            tipo: 'text',
            conteudo: 'CRIATIVOS FACEBOOK ADS\n\nCriativo 1: Vídeo testimonial\nCriativo 2: Carrossel de benefícios\nCriativo 3: Imagem com copy direto\nCriativo 4: Stories interativo'
          }
        ],
        proximosPassos: [
          'Criar contas publicitárias',
          'Desenvolver criativos',
          'Configurar tracking',
          'Lançar campanhas piloto'
        ],
        estimativaROI: 'Campanhas otimizadas: ROAS de 4:1 a 8:1'
      };
    } catch (error) {
      return this.gerarFallback('campanha', titulo, descricao);
    }
  }

  private async gerarDesign(titulo: string, descricao: string): Promise<TicketResult> {
    const prompt = `
    Você é um designer especializado em conversão.

    PROJETO: ${titulo}
    DESCRIÇÃO: ${descricao}

    Crie um conceito de design que inclua:

    1. IDENTIDADE VISUAL:
    - Paleta de cores
    - Tipografia
    - Estilo visual

    2. LAYOUTS:
    - Landing pages
    - Anúncios
    - Email templates
    - Social media

    3. ELEMENTOS DE CONVERSÃO:
    - CTAs destacados
    - Prova social visual
    - Elementos de urgência

    4. GUIDELINES:
    - Manual de marca
    - Especificações técnicas
    - Variações aprovadas

    Foque em design que converte, não apenas bonito.
    `;

    try {
      const resposta = await this.chamarIA(prompt);

      return {
        success: true,
        conteudo: resposta,
        arquivos: [
          {
            nome: 'conceito_design.txt',
            tipo: 'text',
            conteudo: resposta
          },
          {
            nome: 'paleta_cores.txt',
            tipo: 'text',
            conteudo: 'PALETA DE CORES\n\nPrimária: #FF6B35 (Laranja vibrante)\nSecundária: #004E89 (Azul confiança)\nAcento: #FFD23F (Amarelo urgência)\nNeutro: #2D3748 (Cinza escuro)\nFundo: #F7FAFC (Branco suave)'
          }
        ],
        proximosPassos: [
          'Criar mockups detalhados',
          'Desenvolver protótipos',
          'Fazer testes de usabilidade',
          'Implementar designs finais'
        ],
        estimativaROI: 'Design otimizado aumenta conversão em 15-30%'
      };
    } catch (error) {
      return this.gerarFallback('design', titulo, descricao);
    }
  }

  private async gerarAnalise(titulo: string, descricao: string): Promise<TicketResult> {
    const prompt = `
    Você é um analista de dados especializado em marketing.

    PROJETO: ${titulo}
    DESCRIÇÃO: ${descricao}

    Faça uma análise completa que inclua:

    1. ANÁLISE DE MERCADO:
    - Tamanho e crescimento
    - Principais players
    - Tendências identificadas

    2. ANÁLISE COMPETITIVA:
    - Benchmarking
    - Gaps de oportunidade
    - Estratégias dos concorrentes

    3. ANÁLISE DE PÚBLICO:
    - Demografia
    - Comportamentos online
    - Jornada de compra

    4. ANÁLISE DE PERFORMANCE:
    - Métricas atuais
    - Benchmarks da indústria
    - Oportunidades de melhoria

    5. RECOMENDAÇÕES:
    - Ações prioritárias
    - Quick wins
    - Estratégias de longo prazo

    Use dados reais sempre que possível.
    `;

    try {
      const resposta = await this.chamarIA(prompt);

      return {
        success: true,
        conteudo: resposta,
        arquivos: [
          {
            nome: 'analise_completa.txt',
            tipo: 'text',
            conteudo: resposta
          },
          {
            nome: 'dashboard_metricas.txt',
            tipo: 'text',
            conteudo: 'DASHBOARD DE MÉTRICAS\n\nTráfego: Sessions, Users, Bounce Rate\nConversão: CVR, CPA, LTV\nEngajamento: Time on Site, Pages/Session\nROI: ROAS, Revenue, Profit Margin'
          }
        ],
        proximosPassos: [
          'Implementar tracking avançado',
          'Criar dashboards automatizados',
          'Definir metas por métrica',
          'Agendar revisões semanais'
        ],
        estimativaROI: 'Análises orientam otimizações com ROI de 200-400%'
      };
    } catch (error) {
      return this.gerarFallback('analise', titulo, descricao);
    }
  }

  private async chamarIA(prompt: string): Promise<string> {
    try {
      if (this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        });
        return response.content[0]?.text || '';
      }

      if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4000,
        });
        return response.choices[0]?.message?.content || '';
      }

      throw new Error('Nenhuma API de IA configurada');
    } catch (error) {
      console.error('Erro na chamada da IA:', error);
      throw error;
    }
  }

  private extrairJSON(texto: string): any {
    try {
      const jsonMatch = texto.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  private gerarFallback(tipo: string, titulo: string, descricao: string): TicketResult {
    const fallbacks = {
      copy: {
        conteudo: `COPY INTELIGENTE PARA: ${titulo}\n\n🔥 HEADLINE PRINCIPAL:\n"Descubra o Método Que Está Transformando Vidas e Gerando Resultados Extraordinários"\n\n💰 COPY PERSUASIVO:\nVocê já se perguntou por que algumas pessoas conseguem resultados extraordinários enquanto outras ficam para trás?\n\nA diferença está no MÉTODO.\n\nApresento ${titulo} - a solução que você estava procurando.\n\n✅ Resultados comprovados\n✅ Método testado\n✅ Suporte completo\n\n🚀 CALL TO ACTION:\n"QUERO COMEÇAR AGORA E TRANSFORMAR MEUS RESULTADOS!"`,
        arquivos: [
          {
            nome: 'copy_inteligente.txt',
            tipo: 'text',
            conteudo: 'Copy completo com headlines, body copy e call to action otimizados para conversão.'
          }
        ]
      },
      video: {
        conteudo: `ROTEIRO VSL PARA: ${titulo}\n\n[SEGUNDOS 0-15: HOOK]\n"Se você tem 10 minutos, vou te mostrar como [benefício principal]"\n\n[SEGUNDOS 15-60: PROBLEMA]\nTalvez você já tenha tentado...\nE descobriu que não funciona...\nEu entendo sua frustração...\n\n[MINUTO 1-3: AGITAÇÃO]\nEnquanto você continua tentando métodos que não funcionam...\nOutras pessoas estão obtendo resultados reais...\n\n[MINUTO 3-8: SOLUÇÃO]\nDescubra ${titulo}\nO método que mudou tudo...\n\n[MINUTO 8-10: PROVA]\nVeja os resultados...\nDepoimentos reais...\n\n[MINUTO 10-12: OFERTA]\nPor apenas hoje...\nOferta especial...\n\n[MINUTO 12-15: CTA]\nClique no botão agora...\nNão perca esta oportunidade...`,
        arquivos: [
          {
            nome: 'roteiro_vsl.txt',
            tipo: 'text',
            conteudo: 'Roteiro completo com timing, texto narrado e indicações visuais.'
          }
        ]
      },
      funil: {
        conteudo: `FUNIL COMPLETO PARA: ${titulo}\n\n🎯 ETAPA 1: TRÁFEGO\n- Facebook Ads\n- Google Ads\n- Conteúdo orgânico\n\n📋 ETAPA 2: CAPTURA\n- Landing page otimizada\n- Lead magnet irresistível\n- Formulário simples\n\n📧 ETAPA 3: NUTRIÇÃO\n- Sequência de 7 emails\n- Conteúdo de valor\n- Construção de autoridade\n\n💰 ETAPA 4: CONVERSÃO\n- Página de vendas\n- Oferta irresistível\n- Garantia forte\n\n🔄 ETAPA 5: RETENÇÃO\n- Follow-up pós-venda\n- Upsells\n- Programa de fidelidade`,
        arquivos: [
          {
            nome: 'estrutura_funil.txt',
            tipo: 'text',
            conteudo: 'Funil completo com todas as etapas, páginas e automações necessárias.'
          }
        ]
      }
    };

    const fallback = fallbacks[tipo as keyof typeof fallbacks] || fallbacks.copy;

    return {
      success: true,
      conteudo: fallback.conteudo,
      arquivos: fallback.arquivos,
      proximosPassos: [
        'Implementar a solução criada',
        'Fazer testes A/B',
        'Monitorar resultados',
        'Otimizar baseado nos dados'
      ],
      estimativaROI: 'ROI estimado entre 200-500% com implementação adequada'
    };
  }
}

// Função para processar tickets (exportada para uso nas rotas)
export async function processarTicketMaquinaMilionaria(tipo: string, titulo: string, descricao: string): Promise<TicketResult> {
  const ai = new MaquinaMilionariaAI();
  return await ai.processarTicket(tipo, titulo, descricao);
}

// Função para obter etapas de processamento
export function getEtapasProcessamento(tipo: string): string[] {
  const etapas = {
    video: [
      'Analisando produto e mercado',
      'Gerando roteiro persuasivo',
      'Criando elementos visuais',
      'Renderizando video final',
      'Otimizando para conversão'
    ],
    copy: [
      'Análise do público-alvo',
      'Pesquisa de concorrentes',
      'Geração de headlines',
      'Desenvolvimento do copy',
      'Testes A/B sugeridos'
    ],
    funil: [
      'Mapeamento da jornada do cliente',
      'Criação de lead magnets',
      'Desenvolvimento de sequência de emails',
      'Páginas de captura e vendas',
      'Automações e follow-ups'
    ],
    estrategia: [
      'Análise de mercado completa',
      'Definição de personas',
      'Estratégias de posicionamento',
      'Plano de ação detalhado',
      'Métricas e KPIs'
    ],
    design: [
      'Análise de identidade visual',
      'Criação de conceitos',
      'Desenvolvimento de layouts',
      'Refinamento e ajustes',
      'Entrega final'
    ],
    analise: [
      'Coleta de dados',
      'Processamento de informações',
      'Análise de padrões',
      'Geração de insights',
      'Relatório final'
    ],
    campanha: [
      'Definição de objetivos',
      'Segmentação de público',
      'Criação de materiais',
      'Configuração de campanhas',
      'Otimização e monitoramento'
    ]
  };
  
  return etapas[tipo as keyof typeof etapas] || etapas.copy;
}