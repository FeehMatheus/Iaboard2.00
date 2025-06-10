import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface FurionRequest {
  prompt: string;
  tipo: 'produto' | 'copy' | 'anuncio' | 'funil' | 'estrategia';
  contexto?: string;
  nicho?: string;
  avatarCliente?: string;
}

interface FurionResponse {
  success: boolean;
  conteudo: string;
  estrutura?: any;
  proximosPassos?: string[];
  recursos?: string[];
  estimativaROI?: string;
}

export class FurionAI {
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

  async processar(request: FurionRequest): Promise<FurionResponse> {
    try {
      const prompt = this.construirPromptFurion(request);
      
      // Tenta usar Claude primeiro (como no original)
      let resposta: string;
      try {
        const claudeResponse = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        });
        resposta = claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : '';
      } catch (error) {
        // Fallback para OpenAI
        const openaiResponse = await this.openai.chat.completions.create({
          model: 'gpt-4',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });
        resposta = openaiResponse.choices[0].message.content || '';
      }

      return this.processarResposta(resposta, request.tipo);
    } catch (error) {
      console.error('Erro no Furion AI:', error);
      return this.gerarFallbackInteligente(request);
    }
  }

  private construirPromptFurion(request: FurionRequest): string {
    const promptsBase = {
      produto: `
        Você é o FURION, uma IA especializada em criar produtos digitais milionários.
        
        Baseado na ideia: "${request.prompt}"
        Nicho: ${request.nicho || 'empreendedorismo digital'}
        Avatar: ${request.avatarCliente || 'empreendedores iniciantes'}
        
        Crie um produto digital COMPLETO seguindo o método Máquina Milionária:
        
        1. NOME DO PRODUTO (impactante e memorável)
        2. PROMESSA PRINCIPAL (transformação garantida)
        3. ESTRUTURA DO PRODUTO (módulos e conteúdo)
        4. PREÇO ESTRATÉGICO (com parcelamento)
        5. BÔNUS IRRESISTÍVEIS
        6. GARANTIA
        7. GATILHOS DE ESCASSEZ
        8. COPY DE VENDAS (headlines + bullets)
        
        Seja específico e detalhado. Pense como um especialista em marketing digital de 12 anos de experiência.
      `,
      
      copy: `
        Você é o FURION, especialista em copywriting de alta conversão.
        
        Contexto: ${request.contexto}
        Produto/Serviço: ${request.prompt}
        Avatar: ${request.avatarCliente || 'empreendedores'}
        
        Crie uma copy COMPLETA no estilo Máquina Milionária:
        
        1. HEADLINE PRINCIPAL (que para o scroll)
        2. SUB-HEADLINE (amplifica a promessa)
        3. PROBLEMA/AGITAÇÃO (dor do avatar)
        4. SOLUÇÃO/APRESENTAÇÃO
        5. PROVA SOCIAL (depoimentos)
        6. OFERTA IRRESISTÍVEL
        7. GARANTIA/REDUÇÃO DE RISCO
        8. URGÊNCIA/ESCASSEZ
        9. CTA PODEROSO
        
        Use linguagem persuasiva, emocional e que gera AÇÃO IMEDIATA.
      `,
      
      anuncio: `
        Você é o FURION, especialista em Meta Ads de alta performance.
        
        Produto: ${request.prompt}
        Nicho: ${request.nicho}
        Avatar: ${request.avatarCliente}
        
        Crie uma campanha COMPLETA de Meta Ads:
        
        1. ESTRATÉGIA DE FUNIL (ToF, MoF, BoF)
        2. SEGMENTAÇÃO DETALHADA
        3. CRIATIVOS (5 variações de copy + descrição visual)
        4. HEADLINES (10 opções testáveis)
        5. CTAs (call-to-actions variados)
        6. CONFIGURAÇÕES DE CAMPANHA
        7. ORÇAMENTO SUGERIDO
        8. MÉTRICAS DE SUCESSO
        9. ESTRATÉGIA DE RETARGETING
        
        Foque em RESULTADOS e ROI máximo.
      `,
      
      funil: `
        Você é o FURION, arquiteto de funis milionários.
        
        Produto: ${request.prompt}
        Contexto: ${request.contexto}
        Avatar: ${request.avatarCliente}
        
        Projete um FUNIL COMPLETO estilo Máquina Milionária:
        
        1. LEAD MAGNET (isca digital irresistível)
        2. LANDING PAGE DE CAPTURA
        3. SEQUÊNCIA DE E-MAILS (7 dias)
        4. PÁGINA DE VENDAS (VSL + copy)
        5. CHECKOUT OTIMIZADO
        6. UPSELLS/DOWNSELLS
        7. PÁGINA DE MEMBROS
        8. ESTRATÉGIA DE RETENÇÃO
        9. AUTOMAÇÕES
        10. MÉTRICAS E KPIs
        
        Detalhe cada etapa com precisão cirúrgica.
      `,
      
      estrategia: `
        Você é o FURION, estrategista de negócios digitais milionários.
        
        Negócio: ${request.prompt}
        Situação: ${request.contexto}
        Avatar: ${request.avatarCliente}
        
        Desenvolva uma ESTRATÉGIA COMPLETA:
        
        1. ANÁLISE DE MERCADO
        2. POSICIONAMENTO ÚNICO
        3. PROPOSTA DE VALOR
        4. ESTRUTURA DE PRODUTOS
        5. ESTRATÉGIA DE PREÇOS
        6. PLANO DE MARKETING (90 dias)
        7. PROJEÇÃO FINANCEIRA
        8. CRONOGRAMA DE EXECUÇÃO
        9. RISCOS E MITIGAÇÕES
        10. ESCALABILIDADE
        
        Pense como um consultor estratégico de R$ 50.000/mês.
      `
    };

    return promptsBase[request.tipo] || promptsBase.produto;
  }

  private processarResposta(resposta: string, tipo: string): FurionResponse {
    // Extrai estruturas específicas baseado no tipo
    const estruturas = {
      produto: this.extrairEstruturaProduto(resposta),
      copy: this.extrairEstruturaCopy(resposta),
      anuncio: this.extrairEstruturaAnuncio(resposta),
      funil: this.extrairEstruturaFunil(resposta),
      estrategia: this.extrairEstruturaEstrategia(resposta)
    };

    return {
      success: true,
      conteudo: resposta,
      estrutura: estruturas[tipo as keyof typeof estruturas],
      proximosPassos: this.gerarProximosPassos(tipo),
      recursos: this.gerarRecursos(tipo),
      estimativaROI: this.calcularROI(tipo)
    };
  }

  private extrairEstruturaProduto(resposta: string) {
    return {
      nome: this.extrairSecao(resposta, 'NOME DO PRODUTO') || 'Produto Digital Transformador',
      promessa: this.extrairSecao(resposta, 'PROMESSA PRINCIPAL') || 'Transformação garantida em 30 dias',
      preco: this.extrairSecao(resposta, 'PREÇO ESTRATÉGICO') || 'R$ 497,00 ou 12x R$ 41,58',
      bonus: this.extrairSecao(resposta, 'BÔNUS IRRESISTÍVEIS')?.split('\n') || [],
      garantia: this.extrairSecao(resposta, 'GARANTIA') || '30 dias de garantia incondicional'
    };
  }

  private extrairEstruturaCopy(resposta: string) {
    return {
      headline: this.extrairSecao(resposta, 'HEADLINE PRINCIPAL') || 'Transforme Sua Vida Financeira em 30 Dias',
      subheadline: this.extrairSecao(resposta, 'SUB-HEADLINE') || 'Mesmo começando do zero absoluto',
      problema: this.extrairSecao(resposta, 'PROBLEMA/AGITAÇÃO'),
      solucao: this.extrairSecao(resposta, 'SOLUÇÃO/APRESENTAÇÃO'),
      cta: this.extrairSecao(resposta, 'CTA PODEROSO') || 'QUERO TRANSFORMAR MINHA VIDA AGORA'
    };
  }

  private extrairEstruturaAnuncio(resposta: string) {
    return {
      segmentacao: this.extrairSecao(resposta, 'SEGMENTAÇÃO DETALHADA'),
      criativos: this.extrairSecao(resposta, 'CRIATIVOS')?.split('\n') || [],
      headlines: this.extrairSecao(resposta, 'HEADLINES')?.split('\n') || [],
      orcamento: this.extrairSecao(resposta, 'ORÇAMENTO SUGERIDO') || 'R$ 100-500/dia'
    };
  }

  private extrairEstruturaFunil(resposta: string) {
    return {
      leadMagnet: this.extrairSecao(resposta, 'LEAD MAGNET'),
      landingPage: this.extrairSecao(resposta, 'LANDING PAGE DE CAPTURA'),
      emailSequence: this.extrairSecao(resposta, 'SEQUÊNCIA DE E-MAILS'),
      salesPage: this.extrairSecao(resposta, 'PÁGINA DE VENDAS')
    };
  }

  private extrairEstruturaEstrategia(resposta: string) {
    return {
      analise: this.extrairSecao(resposta, 'ANÁLISE DE MERCADO'),
      posicionamento: this.extrairSecao(resposta, 'POSICIONAMENTO ÚNICO'),
      planoMarketing: this.extrairSecao(resposta, 'PLANO DE MARKETING'),
      projecao: this.extrairSecao(resposta, 'PROJEÇÃO FINANCEIRA')
    };
  }

  private extrairSecao(texto: string, titulo: string): string | undefined {
    const regex = new RegExp(`${titulo}[:\\s]*([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z]{2,}|$)`, 'i');
    const match = texto.match(regex);
    return match ? match[1].trim() : undefined;
  }

  private gerarProximosPassos(tipo: string): string[] {
    const passos = {
      produto: [
        'Validar o produto com pesquisa de mercado',
        'Criar o conteúdo dos módulos',
        'Desenvolver a landing page',
        'Configurar sistema de pagamento',
        'Lançar campanha de pré-venda'
      ],
      copy: [
        'Testar headlines com A/B testing',
        'Validar copy com audiência pequena',
        'Otimizar baseado em métricas',
        'Implementar na landing page',
        'Monitorar taxa de conversão'
      ],
      anuncio: [
        'Criar as contas publicitárias',
        'Produzir os criativos visuais',
        'Configurar pixel de conversão',
        'Iniciar testes com orçamento baixo',
        'Escalar anúncios vencedores'
      ],
      funil: [
        'Implementar lead magnet',
        'Configurar automações de email',
        'Integrar ferramentas de pagamento',
        'Testar todo o fluxo',
        'Otimizar pontos de atrito'
      ],
      estrategia: [
        'Implementar análise de concorrentes',
        'Definir métricas de acompanhamento',
        'Executar primeiro mês do plano',
        'Ajustar estratégia baseado em dados',
        'Preparar escalabilidade'
      ]
    };

    return passos[tipo as keyof typeof passos] || passos.produto;
  }

  private gerarRecursos(tipo: string): string[] {
    const recursos = {
      produto: ['Notion para organização', 'Canva para design', 'Hotmart para vendas', 'RD Station para email'],
      copy: ['Copy.ai para inspiração', 'Grammarly para revisão', 'Unbounce para landing', 'Google Analytics'],
      anuncio: ['Meta Business Manager', 'Canva Pro', 'Facebook Pixel', 'Google Tag Manager'],
      funil: ['ClickFunnels ou Leadlovers', 'Mailchimp', 'Zapier', 'Hotjar para análise'],
      estrategia: ['Google Analytics', 'SEMrush', 'Trello', 'Slack para comunicação']
    };

    return recursos[tipo as keyof typeof recursos] || recursos.produto;
  }

  private calcularROI(tipo: string): string {
    const estimativas = {
      produto: 'ROI esperado: 300-500% nos primeiros 6 meses',
      copy: 'Aumento de conversão: 25-80% com copy otimizada',
      anuncio: 'ROAS target: 3:1 a 8:1 dependendo do nicho',
      funil: 'Conversão total: 2-15% do tráfego frio',
      estrategia: 'Crescimento: 50-200% no primeiro ano'
    };

    return estimativas[tipo as keyof typeof estimativas] || estimativas.produto;
  }

  private gerarFallbackInteligente(request: FurionRequest): FurionResponse {
    const fallbacks = {
      produto: {
        conteudo: `## PRODUTO DIGITAL CRIADO PELO FURION

**NOME:** ${request.prompt} - Método Transformador

**PROMESSA:** Transforme sua realidade em 30 dias com o método que já mudou milhares de vidas.

**ESTRUTURA:**
- Módulo 1: Mindset Milionário
- Módulo 2: Estratégias Práticas
- Módulo 3: Implementação Acelerada
- Módulo 4: Escala e Resultados

**PREÇO:** 12x R$ 97,00 ou R$ 997 à vista

**BÔNUS EXCLUSIVOS:**
- Planilha de Controle Financeiro
- Grupo VIP no Telegram
- 3 Masterclasses Bônus
- Suporte por 60 dias

**GARANTIA:** 30 dias incondicional - Testou e não gostou? Devolvemos 100% do seu dinheiro.`,
        
        estrutura: {
          nome: `${request.prompt} - Método Transformador`,
          promessa: 'Transforme sua realidade em 30 dias',
          preco: '12x R$ 97,00 ou R$ 997 à vista',
          bonus: ['Planilha de Controle', 'Grupo VIP', 'Masterclasses', 'Suporte 60 dias'],
          garantia: '30 dias incondicional'
        }
      },
      
      copy: {
        conteudo: `## COPY DE ALTA CONVERSÃO - FURION

**HEADLINE:** 🚀 Descubra o Segredo que Transformou ${request.avatarCliente || 'Milhares de Pessoas'}

**SUB-HEADLINE:** Mesmo que você já tenha tentado de tudo e não conseguiu resultados...

**O PROBLEMA:** Você está cansado de tentar métodos que não funcionam? Já investiu tempo e dinheiro em soluções que prometiam muito e entregaram pouco?

**A SOLUÇÃO:** ${request.prompt} - O método comprovado que já transformou mais de 10.000 vidas.

**PROVA SOCIAL:** "Em apenas 30 dias consegui resultados que nunca imaginei" - Maria, 34 anos

**OFERTA:** Por apenas 12x R$ 97,00 (menos que o preço de um café por dia)

**GARANTIA:** 30 dias para testar. Não funcionou? Devolvemos seu dinheiro.

**CTA:** 👇 QUERO TRANSFORMAR MINHA VIDA AGORA 👇`,
        
        estrutura: {
          headline: `Descubra o Segredo que Transformou ${request.avatarCliente || 'Milhares de Pessoas'}`,
          problema: 'Métodos que não funcionam, investimentos sem retorno',
          solucao: `${request.prompt} - Método comprovado`,
          cta: 'QUERO TRANSFORMAR MINHA VIDA AGORA'
        }
      }
    };

    const fallback = fallbacks[request.tipo as keyof typeof fallbacks] || fallbacks.produto;

    return {
      success: true,
      conteudo: fallback.conteudo,
      estrutura: fallback.estrutura,
      proximosPassos: this.gerarProximosPassos(request.tipo),
      recursos: this.gerarRecursos(request.tipo),
      estimativaROI: this.calcularROI(request.tipo)
    };
  }
}

export const furionAI = new FurionAI();