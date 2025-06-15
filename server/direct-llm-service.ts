import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface DirectLLMRequest {
  prompt: string;
  model?: 'gpt-4o' | 'claude-sonnet-4' | 'mistral-large';
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

interface DirectLLMResponse {
  success: boolean;
  content: string;
  model: string;
  tokensUsed: number;
  provider: string;
  error?: string;
}

export class DirectLLMService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Initialize Anthropic if API key is available
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async generateContent(request: DirectLLMRequest): Promise<DirectLLMResponse> {
    const startTime = Date.now();
    
    try {
      // Determine best available model
      const model = request.model || this.getBestAvailableModel();
      
      if (model === 'gpt-4o' && this.openai) {
        return await this.generateWithOpenAI(request);
      } else if (model === 'claude-sonnet-4' && this.anthropic) {
        return await this.generateWithClaude(request);
      } else if (model === 'mistral-large') {
        return await this.generateWithMistral(request);
      } else {
        // Fallback to any available service
        if (this.anthropic) {
          return await this.generateWithClaude({ ...request, model: 'claude-sonnet-4' });
        } else if (this.openai) {
          return await this.generateWithOpenAI({ ...request, model: 'gpt-4o' });
        } else {
          return await this.generateWithMistral({ ...request, model: 'mistral-large' });
        }
      }
    } catch (error) {
      console.error('Direct LLM generation error:', error);
      return {
        success: false,
        content: '',
        model: request.model || 'unknown',
        tokensUsed: 0,
        provider: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async generateWithOpenAI(request: DirectLLMRequest): Promise<DirectLLMResponse> {
    if (!this.openai) throw new Error('OpenAI not initialized');

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    
    messages.push({ role: 'user', content: request.prompt });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      max_tokens: request.maxTokens || 2000,
      temperature: request.temperature || 0.7,
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content || '',
      model: 'gpt-4o',
      tokensUsed: response.usage?.total_tokens || 0,
      provider: 'openai-direct'
    };
  }

  private async generateWithClaude(request: DirectLLMRequest): Promise<DirectLLMResponse> {
    if (!this.anthropic) throw new Error('Anthropic not initialized');

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
      max_tokens: request.maxTokens || 2000,
      system: request.systemPrompt || undefined,
      messages: [
        { role: 'user', content: request.prompt }
      ],
      temperature: request.temperature || 0.7,
    });

    return {
      success: true,
      content: response.content[0]?.type === 'text' ? response.content[0].text : '',
      model: 'claude-sonnet-4-20250514',
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      provider: 'anthropic-direct'
    };
  }

  private async generateWithMistral(request: DirectLLMRequest): Promise<DirectLLMResponse> {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.maxTokens || 2000,
        temperature: request.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      model: 'mistral-large-latest',
      tokensUsed: data.usage?.total_tokens || 0,
      provider: 'mistral-direct'
    };
  }

  private getBestAvailableModel(): 'gpt-4o' | 'claude-sonnet-4' | 'mistral-large' {
    // Priority: Claude > OpenAI > Mistral (based on capability)
    if (this.anthropic && process.env.ANTHROPIC_API_KEY) {
      return 'claude-sonnet-4';
    } else if (this.openai && process.env.OPENAI_API_KEY) {
      return 'gpt-4o';
    } else {
      return 'mistral-large';
    }
  }

  async healthCheck(): Promise<{ provider: string; available: boolean; model: string }[]> {
    const results = [];

    // Test OpenAI
    if (this.openai) {
      try {
        await this.openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        });
        results.push({ provider: 'openai-direct', available: true, model: 'gpt-4o' });
      } catch (error) {
        results.push({ provider: 'openai-direct', available: false, model: 'gpt-4o' });
      }
    }

    // Test Anthropic
    if (this.anthropic) {
      try {
        await this.anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }],
        });
        results.push({ provider: 'anthropic-direct', available: true, model: 'claude-sonnet-4-20250514' });
      } catch (error) {
        results.push({ provider: 'anthropic-direct', available: false, model: 'claude-sonnet-4-20250514' });
      }
    }

    // Test Mistral
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1,
        }),
      });
      results.push({ provider: 'mistral-direct', available: response.ok, model: 'mistral-large-latest' });
    } catch (error) {
      results.push({ provider: 'mistral-direct', available: false, model: 'mistral-large-latest' });
    }

    return results;
  }
}

export const directLLMService = new DirectLLMService();