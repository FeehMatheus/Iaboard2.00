import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize AI clients
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
    Crie um funil de vendas completo e detalhado para:
    - Produto/Serviço: ${request.productType}
    - Público-alvo: ${request.targetAudience}
    - Objetivo principal: ${request.mainGoal}
    ${request.budget ? `- Orçamento: ${request.budget}` : ''}
    ${request.timeline ? `- Prazo: ${request.timeline}` : ''}

    Retorne um JSON com a seguinte estrutura:
    {
      "title": "Nome do funil",
      "description": "Descrição detalhada do funil",
      "steps": [
        {
          "stepNumber": 1,
          "title": "Nome da etapa",
          "description": "Descrição da etapa",
          "content": "Conteúdo detalhado da página/etapa",
          "cta": "Call-to-action específico",
          "design": {
            "colors": ["#cor1", "#cor2"],
            "layout": "descrição do layout",
            "elements": ["elemento1", "elemento2"]
          }
        }
      ],
      "estimatedConversion": "Taxa de conversão estimada",
      "recommendations": ["recomendação1", "recomendação2"]
    }

    Crie um funil com 6-8 etapas completas e detalhadas.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
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

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  static async analyzeCompetitor(competitorUrl: string, productType: string): Promise<any> {
    const prompt = `
    Analise estrategicamente um concorrente para o produto/serviço: ${productType}
    URL/Descrição do concorrente: ${competitorUrl}

    Retorne um JSON com:
    {
      "strengths": ["força1", "força2"],
      "weaknesses": ["fraqueza1", "fraqueza2"],
      "opportunities": ["oportunidade1", "oportunidade2"],
      "pricing": "análise de preços",
      "marketing": "estratégias de marketing observadas",
      "recommendations": ["recomendação1", "recomendação2"]
    }
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    try {
      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(content);
    } catch {
      return {
        strengths: ["Análise em progresso"],
        weaknesses: ["Dados sendo processados"],
        opportunities: ["Oportunidades identificadas"],
        pricing: "Análise de preços em andamento",
        marketing: "Estratégias sendo analisadas",
        recommendations: ["Recomendações sendo geradas"]
      };
    }
  }

  static async generateVSL(productInfo: string, duration: string): Promise<any> {
    const prompt = `
    Crie um roteiro completo de VSL (Video Sales Letter) para:
    ${productInfo}
    Duração desejada: ${duration}

    Retorne um JSON com:
    {
      "title": "Título do VSL",
      "hook": "Gancho inicial (primeiros 30 segundos)",
      "problem": "Apresentação do problema",
      "solution": "Apresentação da solução",
      "proof": "Provas sociais e credibilidade",
      "offer": "Apresentação da oferta",
      "urgency": "Elemento de urgência",
      "cta": "Call-to-action final",
      "script": "Roteiro completo com marcações de tempo"
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  static async optimizeFunnel(funnelData: any, metrics: any): Promise<any> {
    const prompt = `
    Otimize este funil com base nas métricas de performance:
    
    Dados do funil: ${JSON.stringify(funnelData)}
    Métricas: ${JSON.stringify(metrics)}

    Retorne sugestões de otimização em JSON:
    {
      "priority_changes": ["mudança1", "mudança2"],
      "ab_tests": ["teste1", "teste2"],
      "conversion_improvements": ["melhoria1", "melhoria2"],
      "estimated_impact": "impacto estimado"
    }
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    try {
      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(content);
    } catch {
      return {
        priority_changes: ["Otimizações sendo calculadas"],
        ab_tests: ["Testes sendo preparados"],
        conversion_improvements: ["Melhorias sendo analisadas"],
        estimated_impact: "Análise em progresso"
      };
    }
  }
}

export class ContentGenerator {
  static async generateLandingPage(productInfo: string): Promise<string> {
    const prompt = `
    Crie uma landing page completa em HTML para:
    ${productInfo}

    Inclua:
    - Hero section persuasiva
    - Benefícios claros
    - Prova social
    - CTA otimizado
    - Elementos de urgência
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  }

  static async generateEmailSequence(productInfo: string, sequenceLength: number): Promise<any[]> {
    const prompt = `
    Crie uma sequência de ${sequenceLength} emails para:
    ${productInfo}

    Retorne um JSON array com:
    [
      {
        "day": 1,
        "subject": "Assunto do email",
        "content": "Conteúdo completo do email",
        "goal": "Objetivo deste email"
      }
    ]
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    try {
      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(content);
    } catch {
      return Array.from({ length: sequenceLength }, (_, i) => ({
        day: i + 1,
        subject: `Email ${i + 1} - Conteúdo sendo gerado`,
        content: `Conteúdo do email ${i + 1} sendo processado pela IA...`,
        goal: `Objetivo sendo definido`
      }));
    }
  }
}