import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface AIExecutionRequest {
  model: 'gpt-4o' | 'claude-3-sonnet-20240229' | 'gemini-1.5-pro';
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  context?: string;
}

interface AIExecutionResponse {
  success: boolean;
  content?: string;
  error?: string;
  model: string;
  tokensUsed?: number;
  processingTime: number;
}

export class AdvancedAIService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }

    // Initialize Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }

  async executeAI(request: AIExecutionRequest): Promise<AIExecutionResponse> {
    const startTime = Date.now();

    try {
      let content: string;
      let tokensUsed = 0;

      switch (request.model) {
        case 'gpt-4o':
          if (!this.openai) {
            throw new Error('OpenAI API key não configurada');
          }
          const openaiResult = await this.executeOpenAI(request);
          content = openaiResult.content;
          tokensUsed = openaiResult.tokensUsed;
          break;

        case 'claude-3-sonnet-20240229':
          if (!this.anthropic) {
            throw new Error('Anthropic API key não configurada');
          }
          const claudeResult = await this.executeClaude(request);
          content = claudeResult.content;
          tokensUsed = claudeResult.tokensUsed;
          break;

        case 'gemini-1.5-pro':
          // For now, we'll use OpenAI as fallback for Gemini
          // In a real implementation, you'd integrate with Google's Gemini API
          if (!this.openai) {
            throw new Error('Google Gemini API não implementada - usando OpenAI como fallback');
          }
          const geminiResult = await this.executeOpenAI(request);
          content = geminiResult.content;
          tokensUsed = geminiResult.tokensUsed;
          break;

        default:
          throw new Error(`Modelo não suportado: ${request.model}`);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        content,
        model: request.model,
        tokensUsed,
        processingTime
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        model: request.model,
        processingTime
      };
    }
  }

  private async executeOpenAI(request: AIExecutionRequest): Promise<{ content: string; tokensUsed: number }> {
    const messages: any[] = [];
    
    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: request.prompt
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000,
      stream: false
    });

    return {
      content: response.choices[0]?.message?.content || 'Resposta vazia',
      tokensUsed: response.usage?.total_tokens || 0
    };
  }

  private async executeClaude(request: AIExecutionRequest): Promise<{ content: string; tokensUsed: number }> {
    const messages: any[] = [];
    
    messages.push({
      role: 'user',
      content: request.prompt
    });

    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: request.maxTokens || 1000,
      temperature: request.temperature || 0.7,
      system: request.systemPrompt || 'Você é um assistente útil e inteligente.',
      messages
    });

    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return {
      content: content || 'Resposta vazia',
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0
    };
  }

  // Enhanced AI features for canvas nodes
  async generateNodeSuggestions(context: string): Promise<string[]> {
    try {
      const prompt = `
        Baseado no contexto: "${context}"
        
        Sugira 5 prompts úteis e criativos para nós de IA que complementem este contexto.
        Retorne apenas uma lista numerada dos prompts, sem explicações adicionais.
      `;

      const result = await this.executeAI({
        model: 'gpt-4o',
        prompt,
        temperature: 0.8,
        maxTokens: 300
      });

      if (result.success && result.content) {
        return result.content
          .split('\n')
          .filter(line => line.trim().match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .slice(0, 5);
      }

      return [];
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      return [];
    }
  }

  async optimizePrompt(originalPrompt: string): Promise<string> {
    try {
      const prompt = `
        Como especialista em engenharia de prompts, otimize o seguinte prompt para obter melhores resultados:
        
        "${originalPrompt}"
        
        Retorne apenas o prompt otimizado, sem explicações adicionais.
      `;

      const result = await this.executeAI({
        model: 'gpt-4o',
        prompt,
        temperature: 0.3,
        maxTokens: 200
      });

      return result.success && result.content ? result.content.trim() : originalPrompt;
    } catch (error) {
      console.error('Erro ao otimizar prompt:', error);
      return originalPrompt;
    }
  }

  async generateWorkflowFromNodes(nodes: any[]): Promise<string> {
    try {
      const nodeDescriptions = nodes.map((node, index) => 
        `Nó ${index + 1}: ${node.title} (${node.model}) - Prompt: ${node.prompt}`
      ).join('\n');

      const prompt = `
        Analise estes nós de IA e gere uma descrição de workflow coerente:
        
        ${nodeDescriptions}
        
        Crie uma descrição de como estes nós trabalham juntos para formar um processo completo.
        Seja conciso e focado no valor do workflow.
      `;

      const result = await this.executeAI({
        model: 'gpt-4o',
        prompt,
        temperature: 0.7,
        maxTokens: 400
      });

      return result.success && result.content ? result.content : 'Workflow não pôde ser gerado';
    } catch (error) {
      console.error('Erro ao gerar workflow:', error);
      return 'Erro ao gerar descrição do workflow';
    }
  }
}

export const advancedAIService = new AdvancedAIService();