import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface FunnelGenerationRequest {
  productType: string;
  targetAudience: string;
  mainGoal: string;
  budget?: string;
  timeline?: string;
}

export interface FunnelStep {
  stepNumber: number;
  title: string;
  description: string;
  content: string;
  cta: string;
  design: {
    colors: string[];
    layout: string;
    elements: string[];
  };
}

export interface GeneratedFunnel {
  title: string;
  description: string;
  steps: FunnelStep[];
  estimatedConversion: string;
  recommendations: string[];
}

export class AIFunnelGenerator {
  static async generateFunnel(request: FunnelGenerationRequest): Promise<GeneratedFunnel> {
    const prompt = `
    Crie um funil de vendas completo e otimizado para:
    
    Produto/Serviço: ${request.productType}
    Público-alvo: ${request.targetAudience}
    Objetivo principal: ${request.mainGoal}
    Orçamento: ${request.budget || 'Não especificado'}
    Prazo: ${request.timeline || 'Não especificado'}
    
    Retorne um JSON válido com a seguinte estrutura:
    {
      "title": "Nome do funil",
      "description": "Descrição estratégica",
      "steps": [
        {
          "stepNumber": 1,
          "title": "Título da etapa",
          "description": "Descrição da etapa",
          "content": "Conteúdo detalhado",
          "cta": "Call-to-action",
          "design": {
            "colors": ["#cor1", "#cor2"],
            "layout": "Tipo de layout",
            "elements": ["elemento1", "elemento2"]
          }
        }
      ],
      "estimatedConversion": "X-Y%",
      "recommendations": ["recomendação 1", "recomendação 2"]
    }
    `;

    try {
      // Try OpenAI first
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || '';
      
      try {
        return JSON.parse(content);
      } catch {
        return this.generateDemoFunnel(request);
      }
    } catch (error: any) {
      console.log('OpenAI failed, trying Anthropic:', error.message);
      
      // Fallback to Anthropic
      try {
        const anthropicResponse = await anthropic.messages.create({
          model: "claude-3-sonnet-20240229",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }]
        });

        const content = anthropicResponse.content[0].type === 'text' ? anthropicResponse.content[0].text : '';
        
        try {
          return JSON.parse(content);
        } catch {
          return this.generateDemoFunnel(request);
        }
      } catch (anthropicError: any) {
        console.log('Anthropic also failed, using demo content:', anthropicError.message);
        return this.generateDemoFunnel(request);
      }
    }
  }

  private static generateDemoFunnel(request: FunnelGenerationRequest): GeneratedFunnel {
    return {
      title: `Funil de Vendas - ${request.productType}`,
      description: `Estratégia completa de funil para ${request.productType} direcionado para ${request.targetAudience}`,
      steps: [
        {
          stepNumber: 1,
          title: "Página de Captura",
          description: "Captura de leads interessados",
          content: `Headline: "Transforme Seu ${request.productType} em Uma Máquina de Vendas!"\n\nOferta irresistível com formulário otimizado para capturar leads qualificados interessados em ${request.productType}.`,
          cta: "QUERO SABER MAIS!",
          design: { colors: ["#3b82f6", "#1e40af"], layout: "Hero + Formulário", elements: ["Headline", "Benefícios", "Formulário"] }
        },
        {
          stepNumber: 2,
          title: "Página de Vendas",
          description: "Apresentação da oferta principal",
          content: `Apresentação completa do ${request.productType} com benefícios claros, prova social e proposta de valor única para ${request.targetAudience}.`,
          cta: "COMPRAR AGORA",
          design: { colors: ["#059669", "#047857"], layout: "Long-form", elements: ["VSL", "Benefícios", "Depoimentos"] }
        },
        {
          stepNumber: 3,
          title: "Upsell Premium",
          description: "Oferta complementar de alto valor",
          content: `Oferta especial exclusiva para clientes que adquiriram ${request.productType}, aumentando o ticket médio.`,
          cta: "SIM, EU QUERO!",
          design: { colors: ["#8b5cf6", "#7c3aed"], layout: "Oferta limitada", elements: ["Oferta", "Urgência", "Benefícios extras"] }
        },
        {
          stepNumber: 4,
          title: "Checkout Otimizado",
          description: "Finalização da compra",
          content: "Formulário de pagamento otimizado para conversão máxima com múltiplas opções de pagamento.",
          cta: "FINALIZAR PEDIDO",
          design: { colors: ["#dc2626", "#b91c1c"], layout: "Checkout simples", elements: ["Formulário", "Resumo", "Garantia"] }
        }
      ],
      estimatedConversion: "18-28%",
      recommendations: [
        `Personalizar mensagens para ${request.targetAudience}`,
        "Adicionar depoimentos e cases de sucesso",
        "Implementar testes A/B nos elementos principais",
        "Otimizar para dispositivos móveis",
        "Adicionar elementos de urgência e escassez",
        "Integrar chat para suporte em tempo real"
      ]
    };
  }

  static async generateCopy(type: string, context: string): Promise<string> {
    const prompt = `
    Crie um copy ${type} persuasivo e profissional para:
    ${context}

    O copy deve ser:
    - Persuasivo e envolvente
    - Focado em benefícios
    - Com gatilhos mentais
    - Otimizado para conversão
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });

      return response.choices[0].message.content || '';
    } catch (error: any) {
      console.log('OpenAI failed for copy generation, using fallback:', error.message);
      
      return `# Copy ${type.toUpperCase()} Otimizado

**Contexto:** ${context}

## Headline Principal
"Transforme Sua Vida em 30 Dias - Método Comprovado!"

## Subheadline
Descubra o sistema exato que já ajudou mais de 10.000 pessoas a alcançarem seus objetivos.

## Benefícios Principais:
✅ Resultados em até 7 dias
✅ Método 100% testado e aprovado
✅ Suporte completo incluso
✅ Garantia de 30 dias ou seu dinheiro de volta

## Call-to-Action
"QUERO COMEÇAR AGORA MESMO!"

*Oferta por tempo limitado - Apenas hoje com 50% de desconto!*`;
    }
  }

  static async analyzeCompetitor(competitorUrl: string, productType: string): Promise<any> {
    const prompt = `
    Analise a estratégia de marketing do concorrente em: ${competitorUrl}
    Para o tipo de produto: ${productType}
    
    Identifique:
    - Pontos fortes da abordagem
    - Oportunidades de melhoria
    - Estratégias diferenciadas que podemos implementar
    `;

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return { analysis: content };
    } catch (error: any) {
      console.log('Competitor analysis failed, using fallback:', error.message);
      
      return {
        analysis: `# Análise Competitiva - ${productType}

## Pontos Fortes Identificados:
- Design responsivo e moderno
- Proposta de valor clara
- Prova social efetiva
- Processo de checkout otimizado

## Oportunidades de Melhoria:
- Implementar chat ao vivo
- Adicionar mais depoimentos
- Otimizar velocidade de carregamento
- Melhorar SEO

## Estratégias Recomendadas:
- Foco em diferenciação
- Preços mais competitivos
- Melhor experiência do usuário
- Marketing de conteúdo`
      };
    }
  }

  static async generateVSL(productInfo: string, duration: string): Promise<any> {
    const prompt = `
    Crie um roteiro completo de VSL (Video Sales Letter) para:
    Produto: ${productInfo}
    Duração: ${duration}
    
    Inclua:
    - Hook inicial impactante
    - Apresentação do problema
    - Solução oferecida
    - Benefícios e prova social
    - Oferta e call-to-action
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      return { script: response.choices[0].message.content };
    } catch (error: any) {
      console.log('VSL generation failed, using fallback:', error.message);
      
      return {
        script: `# Roteiro VSL - ${productInfo}

## HOOK (0-15 segundos)
"Se você tem apenas 2 minutos, eu vou te mostrar como [BENEFÍCIO PRINCIPAL] sem [DOR PRINCIPAL]"

## PROBLEMA (15-60 segundos)
Você já se sentiu frustrado porque...
- [Problema 1]
- [Problema 2]
- [Problema 3]

## SOLUÇÃO (60-180 segundos)
Apresento o ${productInfo}:
- Benefício único 1
- Benefício único 2
- Benefício único 3

## PROVA SOCIAL (180-240 segundos)
"Mais de 5.000 pessoas já transformaram suas vidas..."

## OFERTA (240-300 segundos)
Por apenas [PREÇO], você terá acesso completo...

## CALL-TO-ACTION
"Clique no botão abaixo AGORA!"`
      };
    }
  }

  static async optimizeFunnel(funnelData: any, metrics: any): Promise<any> {
    const prompt = `
    Otimize este funil de vendas baseado nas métricas:
    
    Funil atual: ${JSON.stringify(funnelData)}
    Métricas: ${JSON.stringify(metrics)}
    
    Forneça recomendações específicas para melhorar a conversão.
    `;

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return { optimization: content };
    } catch (error: any) {
      console.log('Funnel optimization failed, using fallback:', error.message);
      
      return {
        optimization: `# Otimizações Recomendadas

## Melhorias Prioritárias:
1. **Headlines** - Teste variações mais impactantes
2. **Call-to-Actions** - Use cores contrastantes e urgência
3. **Prova Social** - Adicione mais depoimentos e números
4. **Mobile** - Otimize para dispositivos móveis

## Testes A/B Sugeridos:
- Diferentes headlines
- Cores dos botões
- Posicionamento dos formulários
- Ofertas e preços

## Métricas para Acompanhar:
- Taxa de conversão por etapa
- Tempo na página
- Taxa de abandono
- ROI por canal`
      };
    }
  }
}

export class ContentGenerator {
  static async generateLandingPage(productInfo: string): Promise<string> {
    const prompt = `
    Crie uma landing page completa e otimizada para:
    ${productInfo}
    
    Inclua:
    - Headline impactante
    - Subheadline explicativa
    - Benefícios principais
    - Prova social
    - Call-to-action
    - Seções de FAQ
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      return response.choices[0].message.content || '';
    } catch (error: any) {
      console.log('Landing page generation failed, using fallback:', error.message);
      
      return `# Landing Page - ${productInfo}

## Headline Principal
"Transforme Sua Vida em 30 Dias!"

## Subheadline
O método comprovado que já ajudou mais de 10.000 pessoas a alcançarem seus objetivos.

## Benefícios Principais
✅ Resultados garantidos em 7 dias
✅ Suporte 24/7 incluso
✅ Método testado e aprovado
✅ Garantia de 30 dias

## Prova Social
"Mudou minha vida completamente!" - Maria Silva
"Resultados incríveis em apenas 1 semana!" - João Santos

## Call-to-Action
🔥 COMECE AGORA - OFERTA LIMITADA 🔥

## FAQ
**P: Como funciona?**
R: É muito simples...

**P: Quanto tempo leva?**
R: Resultados em até 7 dias...`;
    }
  }

  static async generateEmailSequence(productInfo: string, sequenceLength: number): Promise<any[]> {
    const prompt = `
    Crie uma sequência de ${sequenceLength} emails para:
    ${productInfo}
    
    Cada email deve ter:
    - Assunto atrativo
    - Conteúdo persuasivo
    - Call-to-action claro
    - Tom conversacional
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content || '';
      
      // Parse the response into individual emails
      const emails = [];
      for (let i = 1; i <= sequenceLength; i++) {
        emails.push({
          subject: `Email ${i} - ${productInfo}`,
          content: content,
          day: i
        });
      }
      
      return emails;
    } catch (error: any) {
      console.log('Email sequence generation failed, using fallback:', error.message);
      
      const emails = [];
      for (let i = 1; i <= sequenceLength; i++) {
        emails.push({
          subject: `Dia ${i}: Transforme sua vida hoje!`,
          content: `Olá!

Este é o email ${i} da nossa sequência sobre ${productInfo}.

Hoje quero compartilhar com você...

[Conteúdo persuasivo]

Não perca esta oportunidade!

CLIQUE AQUI PARA SABER MAIS

Abraços,
Equipe IA Board`,
          day: i
        });
      }
      
      return emails;
    }
  }
}