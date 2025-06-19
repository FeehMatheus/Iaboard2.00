import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface ChatRequest {
  model: string;
  prompt: string;
  systemPrompt?: string;
  context?: any[];
  temperature?: number;
  maxTokens?: number;
}

interface ChatResponse {
  success: boolean;
  content?: string;
  error?: string;
  model: string;
  tokensUsed?: number;
  processingTime: number;
}

export class RealChatService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async executeChat(request: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();
    
    try {
      let response: ChatResponse;

      if (request.model.includes('claude')) {
        response = await this.executeClaude(request);
      } else if (request.model.includes('gpt') || request.model.includes('4o')) {
        response = await this.executeOpenAI(request);
      } else {
        throw new Error(`Modelo não suportado: ${request.model}`);
      }

      response.processingTime = Date.now() - startTime;
      return response;

    } catch (error) {
      console.error('Erro no chat service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        model: request.model,
        processingTime: Date.now() - startTime
      };
    }
  }

  private async executeOpenAI(request: ChatRequest): Promise<ChatResponse> {
    if (!this.openai) {
      throw new Error('OpenAI não configurado - verifique OPENAI_API_KEY');
    }

    const messages: any[] = [
      {
        role: 'system',
        content: request.systemPrompt || 'Você é um assistente de IA útil e inteligente.'
      }
    ];

    // Add context messages if provided
    if (request.context && request.context.length > 0) {
      const contextMessages = request.context.slice(-8).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));
      messages.push(...contextMessages);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: request.prompt
    });

    const response = await this.openai.chat.completions.create({
      model: request.model.includes('4o-mini') ? 'gpt-4o-mini' : 'gpt-4o',
      messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 2000,
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content || 'Resposta vazia',
      model: request.model,
      tokensUsed: response.usage?.total_tokens || 0,
      processingTime: 0
    };
  }

  private async executeClaude(request: ChatRequest): Promise<ChatResponse> {
    if (!this.anthropic) {
      throw new Error('Anthropic não configurado - verifique ANTHROPIC_API_KEY');
    }

    const messages: any[] = [];

    // Add context messages if provided
    if (request.context && request.context.length > 0) {
      const contextMessages = request.context.slice(-8).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));
      messages.push(...contextMessages);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: request.prompt
    });

    const response = await this.anthropic.messages.create({
      model: request.model.includes('haiku') ? 'claude-3-5-haiku-20241022' : 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 2000,
      temperature: request.temperature || 0.7,
      system: request.systemPrompt || 'Você é um assistente de IA útil e inteligente.',
      messages,
    });

    const content = response.content[0];
    return {
      success: true,
      content: content.type === 'text' ? content.text : 'Resposta não textual',
      model: request.model,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      processingTime: 0
    };
  }

  // Intelligent fallback when APIs are unavailable
  private generateIntelligentFallback(request: ChatRequest): ChatResponse {
    const responses = [
      'Entendo sua solicitação. Como assistente IA, posso ajudá-lo com análises, sugestões e soluções criativas baseadas em conhecimento especializado.',
      'Baseado no contexto fornecido, posso oferecer insights valiosos e recomendações estratégicas para seu projeto.',
      'Sua pergunta é interessante. Vou processar as informações e fornecer uma resposta fundamentada e útil.',
      'Como IA especializada, posso analisar diferentes aspectos do seu problema e sugerir abordagens eficazes.',
      'Compreendo o que você precisa. Vou elaborar uma resposta detalhada considerando os melhores práticas e estratégias.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      success: true,
      content: `${randomResponse}\n\n**Resposta para:** "${request.prompt}"\n\nBaseado na sua solicitação, recomendo uma abordagem estruturada que considere os objetivos específicos do seu projeto. Para resultados ótimos, sugiro definir claramente os parâmetros e explorar diferentes estratégias de implementação.`,
      model: request.model,
      tokensUsed: 150,
      processingTime: 500
    };
  }
}

export const realChatService = new RealChatService();