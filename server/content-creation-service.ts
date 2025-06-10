import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';

interface ContentCreationRequest {
  type: 'copy' | 'landing' | 'email' | 'anuncio' | 'vsl' | 'funil';
  prompt: string;
  targetAudience?: string;
  product?: string;
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly';
  length?: 'short' | 'medium' | 'long';
}

interface ContentCreationResponse {
  success: boolean;
  content: string;
  title?: string;
  subtitle?: string;
  cta?: string;
  metadata: {
    wordCount: number;
    readingTime: string;
    tone: string;
    recommendations: string[];
  };
  files?: Array<{
    name: string;
    type: string;
    content: string;
  }>;
}

export class ContentCreationService {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async createContent(request: ContentCreationRequest): Promise<ContentCreationResponse> {
    try {
      const content = await this.generateContentWithAI(request);
      return this.processContent(content, request);
    } catch (error) {
      console.error('Erro na criação de conteúdo:', error);
      throw new Error('Falha ao gerar conteúdo');
    }
  }

  private async generateContentWithAI(request: ContentCreationRequest): Promise<string> {
    const prompt = this.buildPrompt(request);
    
    try {
      // Usar Claude para conteúdo de marketing
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error) {
      // Fallback para OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Você é um copywriter especialista em marketing digital brasileiro.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8
      });

      return response.choices[0].message.content || '';
    }
  }

  private buildPrompt(request: ContentCreationRequest): string {
    const basePrompts = {
      copy: `Crie uma copy de vendas persuasiva para: ${request.prompt}
      
      Inclua:
      - Headline impactante
      - Subheadline explicativa
      - Problemas que o produto resolve
      - Benefícios claros
      - Prova social
      - Garantias
      - CTA forte
      - Senso de urgência`,

      landing: `Crie uma landing page completa para: ${request.prompt}
      
      Estrutura necessária:
      - Headline principal
      - Subheadline
      - Seção de benefícios
      - Como funciona
      - Depoimentos
      - FAQ
      - CTA múltiplos
      - Footer`,

      email: `Crie uma sequência de emails para: ${request.prompt}
      
      Inclua:
      - Email de boas-vindas
      - Email educativo
      - Email de vendas
      - Email de objeções
      - Email de urgência
      - Email de última chance`,

      anuncio: `Crie anúncios para redes sociais para: ${request.prompt}
      
      Formatos:
      - Facebook/Instagram (feed)
      - Stories
      - Google Ads
      - YouTube
      - TikTok`,

      vsl: `Crie um roteiro de VSL (Video Sales Letter) para: ${request.prompt}
      
      Estrutura:
      - Hook inicial (10 segundos)
      - Problema (1-2 minutos)
      - Solução (2-3 minutos)
      - Prova (1-2 minutos)
      - Oferta (1 minuto)
      - CTA (30 segundos)`,

      funil: `Crie um funil de vendas completo para: ${request.prompt}
      
      Etapas:
      - Topo de funil (consciência)
      - Meio de funil (consideração)
      - Fundo de funil (conversão)
      - Pós-venda (retenção)`
    };

    let prompt = basePrompts[request.type] || basePrompts.copy;

    if (request.targetAudience) {
      prompt += `\n\nPúblico-alvo: ${request.targetAudience}`;
    }

    if (request.tone) {
      prompt += `\n\nTom de voz: ${request.tone}`;
    }

    if (request.length) {
      const lengthGuide = {
        short: 'Conteúdo conciso (até 500 palavras)',
        medium: 'Conteúdo médio (500-1500 palavras)',
        long: 'Conteúdo extenso (1500+ palavras)'
      };
      prompt += `\n\nTamanho: ${lengthGuide[request.length]}`;
    }

    prompt += '\n\nRetorne um conteúdo profissional, persuasivo e otimizado para conversão.';

    return prompt;
  }

  private processContent(content: string, request: ContentCreationRequest): ContentCreationResponse {
    const lines = content.split('\n').filter(line => line.trim());
    const wordCount = content.split(' ').filter(word => word.trim()).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Extrair título e CTA do conteúdo
    const title = this.extractTitle(content);
    const cta = this.extractCTA(content);

    const files = this.generateFiles(content, request);

    return {
      success: true,
      content: content,
      title: title,
      cta: cta,
      metadata: {
        wordCount: wordCount,
        readingTime: `${readingTime} min`,
        tone: request.tone || 'professional',
        recommendations: this.generateRecommendations(request)
      },
      files: files
    };
  }

  private extractTitle(content: string): string {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('HEADLINE') || line.includes('TÍTULO') || line.includes('#')) {
        return line.replace(/[#*\-]/g, '').trim();
      }
    }
    return lines[0]?.substring(0, 100) + '...' || 'Título Gerado';
  }

  private extractCTA(content: string): string {
    const ctaKeywords = ['CLIQUE', 'COMPRE', 'ADQUIRA', 'ACESSE', 'BAIXE', 'INSCREVA'];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (ctaKeywords.some(keyword => line.toUpperCase().includes(keyword))) {
        return line.trim();
      }
    }
    return 'CLIQUE AQUI E TRANSFORME SUA VIDA!';
  }

  private generateFiles(content: string, request: ContentCreationRequest): Array<{name: string, type: string, content: string}> {
    const files = [];

    if (request.type === 'landing') {
      files.push({
        name: 'landing-page.html',
        type: 'html',
        content: this.generateHTMLLanding(content)
      });
    }

    if (request.type === 'email') {
      files.push({
        name: 'sequencia-emails.txt',
        type: 'text',
        content: content
      });
    }

    if (request.type === 'vsl') {
      files.push({
        name: 'roteiro-vsl.txt',
        type: 'text',
        content: content
      });
    }

    files.push({
      name: `${request.type}-copy.txt`,
      type: 'text',
      content: content
    });

    return files;
  }

  private generateHTMLLanding(content: string): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .hero { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 60px 20px; text-align: center; }
        .cta-button { background: #ff6b35; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="container">
            <h1>${this.extractTitle(content)}</h1>
            <button class="cta-button">${this.extractCTA(content)}</button>
        </div>
    </div>
    <div class="container">
        <pre>${content}</pre>
    </div>
</body>
</html>`;
  }

  private generateRecommendations(request: ContentCreationRequest): string[] {
    const recommendations = [
      'Teste diferentes headlines para otimizar conversão',
      'Adicione elementos de urgência e escassez',
      'Inclua depoimentos e provas sociais',
      'Otimize para mobile',
      'Use CTAs claros e específicos'
    ];

    if (request.type === 'vsl') {
      recommendations.push('Teste diferentes hooks nos primeiros 10 segundos');
      recommendations.push('Adicione legendas para aumentar engajamento');
    }

    if (request.type === 'email') {
      recommendations.push('Segmente sua lista por comportamento');
      recommendations.push('Teste horários de envio');
    }

    return recommendations;
  }

  async optimizeContent(content: string, metrics: any): Promise<string> {
    const prompt = `
    Otimize este conteúdo com base nas métricas de performance:
    
    Conteúdo atual:
    ${content}
    
    Métricas:
    - Taxa de conversão: ${metrics.conversionRate}%
    - Tempo na página: ${metrics.timeOnPage}s
    - Taxa de rejeição: ${metrics.bounceRate}%
    
    Sugira melhorias específicas para aumentar a conversão.
    `;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      });

      return response.content[0].type === 'text' ? response.content[0].text : content;
    } catch (error) {
      return content;
    }
  }
}

export const contentCreationService = new ContentCreationService();