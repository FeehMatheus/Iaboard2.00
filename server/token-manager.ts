interface TokenConfig {
  service: string;
  tokensPerHour: number;
  tokensUsed: number;
  lastReset: number;
  apiKey?: string;
  freeEndpoint?: string;
}

export class TokenManager {
  private tokens: Map<string, TokenConfig> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // Free tier limits for various services
    this.tokens.set('huggingface', {
      service: 'Hugging Face',
      tokensPerHour: 1000, // Very generous free tier
      tokensUsed: 0,
      lastReset: Date.now(),
      freeEndpoint: 'https://api-inference.huggingface.co'
    });

    this.tokens.set('replicate', {
      service: 'Replicate',
      tokensPerHour: 100,
      tokensUsed: 0,
      lastReset: Date.now(),
      freeEndpoint: 'https://api.replicate.com'
    });

    this.tokens.set('gradio', {
      service: 'Gradio/HF Spaces',
      tokensPerHour: 500,
      tokensUsed: 0,
      lastReset: Date.now(),
      freeEndpoint: 'https://huggingface.co/spaces'
    });

    this.tokens.set('fal', {
      service: 'Fal.ai',
      tokensPerHour: 50,
      tokensUsed: 0,
      lastReset: Date.now(),
      freeEndpoint: 'https://fal.run'
    });
  }

  canUseService(serviceName: string): boolean {
    const config = this.tokens.get(serviceName);
    if (!config) return false;

    this.resetTokensIfNeeded(serviceName);
    return config.tokensUsed < config.tokensPerHour;
  }

  useToken(serviceName: string): boolean {
    if (!this.canUseService(serviceName)) return false;

    const config = this.tokens.get(serviceName)!;
    config.tokensUsed++;
    return true;
  }

  private resetTokensIfNeeded(serviceName: string) {
    const config = this.tokens.get(serviceName);
    if (!config) return;

    const hoursPassed = (Date.now() - config.lastReset) / (1000 * 60 * 60);
    if (hoursPassed >= 1) {
      config.tokensUsed = 0;
      config.lastReset = Date.now();
    }
  }

  getAvailableServices(): string[] {
    return Array.from(this.tokens.keys()).filter(service => this.canUseService(service));
  }

  getServiceStatus(serviceName: string): { available: boolean; tokensLeft: number; resetTime: string } {
    const config = this.tokens.get(serviceName);
    if (!config) return { available: false, tokensLeft: 0, resetTime: 'Unknown' };

    this.resetTokensIfNeeded(serviceName);
    const tokensLeft = config.tokensPerHour - config.tokensUsed;
    const resetTime = new Date(config.lastReset + 60 * 60 * 1000).toISOString();

    return {
      available: tokensLeft > 0,
      tokensLeft,
      resetTime
    };
  }

  getAllServiceStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    this.tokens.forEach((config, service) => {
      status[service] = {
        ...this.getServiceStatus(service),
        service: config.service,
        endpoint: config.freeEndpoint
      };
    });
    return status;
  }
}

export const tokenManager = new TokenManager();