interface LLMRequest {
  model: 'gpt-4o' | 'claude-3-sonnet-20240229' | 'gemini-1.5-pro' | 'mistral-large';
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface LLMResponse {
  success: boolean;
  content: string;
  model: string;
  tokens_used: number;
  provider: string;
  error?: string;
}

export class LLMRouterService {
  private openRouterKey: string;
  private mistralKey: string;

  constructor() {
    this.openRouterKey = process.env.OPENROUTER_API_KEY || '';
    this.mistralKey = process.env.MISTRAL_API_KEY || '';
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    console.log(`🤖 Starting LLM generation with model: ${request.model}`);
    
    try {
      if (request.model === 'mistral-large') {
        return await this.callMistralDirect(request);
      } else {
        return await this.callOpenRouter(request);
      }
    } catch (error) {
      console.error(`❌ LLM Router error:`, error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error(`${this.getProviderName(request.model)} authentication failed. Please check API key.`);
      }
      
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error(`${this.getProviderName(request.model)} access denied. API key may be invalid or expired.`);
      }
      
      if (error instanceof Error && error.message.includes('quota')) {
        throw new Error(`${this.getProviderName(request.model)} quota exceeded. Please upgrade your plan.`);
      }
      
      throw error;
    }
  }

  private async callOpenRouter(request: LLMRequest): Promise<LLMResponse> {
    if (!this.openRouterKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ia-board.replit.app',
        'X-Title': 'IA Board'
      },
      body: JSON.stringify({
        model: this.mapModelToOpenRouter(request.model),
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenRouter error: ${data.error.message}`);
    }

    return {
      success: true,
      content: data.choices[0].message.content,
      model: request.model,
      tokens_used: data.usage?.total_tokens || 0,
      provider: 'OpenRouter'
    };
  }

  private async callMistralDirect(request: LLMRequest): Promise<LLMResponse> {
    if (!this.mistralKey) {
      throw new Error('Mistral API key not configured');
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.mistralKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices[0].message.content,
      model: request.model,
      tokens_used: data.usage?.total_tokens || 0,
      provider: 'Mistral'
    };
  }

  private mapModelToOpenRouter(model: string): string {
    const mapping: Record<string, string> = {
      'gpt-4o': 'openai/gpt-4o',
      'claude-3-sonnet-20240229': 'anthropic/claude-3-sonnet',
      'gemini-1.5-pro': 'google/gemini-1.5-pro'
    };
    
    return mapping[model] || model;
  }

  private getProviderName(model: string): string {
    if (model === 'mistral-large') return 'Mistral AI';
    if (model.includes('gpt')) return 'OpenAI';
    if (model.includes('claude')) return 'Anthropic';
    if (model.includes('gemini')) return 'Google';
    return 'LLM Provider';
  }

  async testConnection(model: string): Promise<{ success: boolean; tokens: number; error?: string }> {
    try {
      const testRequest: LLMRequest = {
        model: model as any,
        messages: [
          { role: 'user', content: 'Hello! Please respond with exactly 50 tokens to test the connection.' }
        ],
        max_tokens: 100
      };

      const response = await this.generateResponse(testRequest);
      
      return {
        success: response.success,
        tokens: response.tokens_used
      };
    } catch (error) {
      return {
        success: false,
        tokens: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const llmRouterService = new LLMRouterService();