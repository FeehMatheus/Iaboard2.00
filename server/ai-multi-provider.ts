import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface LLMRequest {
  prompt: string;
  model: 'gpt-4o' | 'claude-3-sonnet-20240229' | 'gemini-1.5-pro' | 'mistral-large';
  maxTokens?: number;
  temperature?: number;
}

interface LLMResponse {
  success: boolean;
  content: string;
  tokensUsed: number;
  provider: string;
  latency: number;
  cost?: number;
}

export class AIMultiProvider {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDir();
  }

  private ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  async generateLLM(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    
    try {
      let response: LLMResponse;
      
      if (request.model === 'mistral-large') {
        response = await this.callMistral(request);
      } else {
        response = await this.callOpenRouter(request);
      }
      
      response.latency = Date.now() - startTime;
      this.logLLMRequest(request, response);
      
      return response;
    } catch (error) {
      const errorResponse: LLMResponse = {
        success: false,
        content: `Error: ${error.message}`,
        tokensUsed: 0,
        provider: request.model,
        latency: Date.now() - startTime
      };
      
      this.logLLMRequest(request, errorResponse);
      return errorResponse;
    }
  }

  private async callOpenRouter(request: LLMRequest): Promise<LLMResponse> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://iaboard.com',
        'X-Title': 'IA Board by Filippe'
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
      provider: 'OpenRouter',
      latency: 0, // Will be set by caller
      cost: this.calculateCost(request.model, data.usage?.total_tokens || 0)
    };
  }

  private async callMistral(request: LLMRequest): Promise<LLMResponse> {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: request.prompt
          }
        ],
        max_tokens: request.maxTokens || 500,
        temperature: request.temperature || 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
      provider: 'Mistral',
      latency: 0, // Will be set by caller
      cost: this.calculateCost('mistral-large', data.usage?.total_tokens || 0)
    };
  }

  private calculateCost(model: string, tokens: number): number {
    const costPer1K = {
      'gpt-4o': 0.015,
      'claude-3-sonnet-20240229': 0.015,
      'gemini-1.5-pro': 0.0125,
      'mistral-large': 0.008
    };
    
    return (tokens / 1000) * (costPer1K[model] || 0.01);
  }

  private logLLMRequest(request: LLMRequest, response: LLMResponse) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      model: request.model,
      promptLength: request.prompt.length,
      success: response.success,
      tokensUsed: response.tokensUsed,
      latency: response.latency,
      cost: response.cost,
      provider: response.provider
    };

    const logPath = path.join(this.logDir, 'ai.log');
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
  }

  async healthCheck(): Promise<{ success: boolean; results: any[] }> {
    const models = ['gpt-4o', 'claude-3-sonnet-20240229', 'gemini-1.5-pro', 'mistral-large'];
    const results = [];

    for (const model of models) {
      try {
        const response = await this.generateLLM({
          prompt: 'Teste técnico IA Board',
          model: model as any,
          maxTokens: 100
        });

        const passed = response.success && response.content.length >= 50;
        results.push({
          model,
          passed,
          tokensUsed: response.tokensUsed,
          latency: response.latency,
          error: passed ? null : 'Response too short or failed'
        });
      } catch (error) {
        results.push({
          model,
          passed: false,
          error: error.message
        });
      }
    }

    const allPassed = results.every(r => r.passed);
    return { success: allPassed, results };
  }
}

export const aiMultiProvider = new AIMultiProvider();