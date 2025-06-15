#!/usr/bin/env tsx

import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

interface HealthResult {
  provider: string;
  status: 'healthy' | 'error' | 'missing_key';
  response?: string;
  error?: string;
  latency?: number;
}

class HealthChecker {
  private results: HealthResult[] = [];

  async runFullHealthCheck(): Promise<void> {
    console.log('🔍 IA Board Health Check - Verificando todos os provedores...\n');

    await Promise.all([
      this.checkOpenRouter(),
      this.checkMistral(),
      this.checkStabilityAI(),
      this.checkElevenLabs(),
      this.checkNotion(),
      this.checkMailchimp(),
      this.checkZapierWebhook()
    ]);

    this.printResults();
  }

  private async checkOpenRouter(): Promise<void> {
    if (!process.env.OPENROUTER_API_KEY) {
      this.results.push({
        provider: 'OpenRouter',
        status: 'missing_key',
        error: 'OPENROUTER_API_KEY não configurada'
      });
      return;
    }

    try {
      const startTime = Date.now();
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ia-board.com',
          'X-Title': 'IA Board'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5
        })
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.results.push({
          provider: 'OpenRouter',
          status: 'healthy',
          response: data.choices?.[0]?.message?.content || 'OK',
          latency
        });
      } else {
        const error = await response.text();
        this.results.push({
          provider: 'OpenRouter',
          status: 'error',
          error: `HTTP ${response.status}: ${error.substring(0, 100)}`
        });
      }
    } catch (error) {
      this.results.push({
        provider: 'OpenRouter',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async checkMistral(): Promise<void> {
    if (!process.env.MISTRAL_API_KEY) {
      this.results.push({
        provider: 'Mistral',
        status: 'missing_key',
        error: 'MISTRAL_API_KEY não configurada'
      });
      return;
    }

    try {
      const startTime = Date.now();
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistral-small',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5
        })
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.results.push({
          provider: 'Mistral',
          status: 'healthy',
          response: data.choices?.[0]?.message?.content || 'OK',
          latency
        });
      } else {
        const error = await response.text();
        this.results.push({
          provider: 'Mistral',
          status: 'error',
          error: `HTTP ${response.status}: ${error.substring(0, 100)}`
        });
      }
    } catch (error) {
      this.results.push({
        provider: 'Mistral',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async checkStabilityAI(): Promise<void> {
    if (!process.env.STABILITY_API_KEY) {
      this.results.push({
        provider: 'Stability AI',
        status: 'missing_key',
        error: 'STABILITY_API_KEY não configurada'
      });
      return;
    }

    try {
      const startTime = Date.now();
      const response = await fetch('https://api.stability.ai/v1/user/account', {
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
        }
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.results.push({
          provider: 'Stability AI',
          status: 'healthy',
          response: `Account valid`,
          latency
        });
      } else {
        const error = await response.text();
        this.results.push({
          provider: 'Stability AI',
          status: 'error',
          error: `HTTP ${response.status}: ${error.substring(0, 100)}`
        });
      }
    } catch (error) {
      this.results.push({
        provider: 'Stability AI',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async checkElevenLabs(): Promise<void> {
    if (!process.env.ELEVENLABS_API_KEY) {
      this.results.push({
        provider: 'ElevenLabs',
        status: 'missing_key',
        error: 'ELEVENLABS_API_KEY não configurada'
      });
      return;
    }

    try {
      const startTime = Date.now();
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        }
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        this.results.push({
          provider: 'ElevenLabs',
          status: 'healthy',
          response: `User valid`,
          latency
        });
      } else {
        const error = await response.text();
        this.results.push({
          provider: 'ElevenLabs',
          status: 'error',
          error: `HTTP ${response.status}: ${error.substring(0, 100)}`
        });
      }
    } catch (error) {
      this.results.push({
        provider: 'ElevenLabs',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async checkNotion(): Promise<void> {
    if (!process.env.NOTION_API_KEY) {
      this.results.push({
        provider: 'Notion',
        status: 'missing_key',
        error: 'NOTION_API_KEY não configurada'
      });
      return;
    }

    try {
      const startTime = Date.now();
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28'
        }
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        this.results.push({
          provider: 'Notion',
          status: 'healthy',
          response: `API accessible`,
          latency
        });
      } else {
        const error = await response.text();
        this.results.push({
          provider: 'Notion',
          status: 'error',
          error: `HTTP ${response.status}: ${error.substring(0, 100)}`
        });
      }
    } catch (error) {
      this.results.push({
        provider: 'Notion',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async checkMailchimp(): Promise<void> {
    if (!process.env.MAILCHIMP_API_KEY) {
      this.results.push({
        provider: 'Mailchimp',
        status: 'missing_key',
        error: 'MAILCHIMP_API_KEY não configurada'
      });
      return;
    }

    try {
      const startTime = Date.now();
      const server = process.env.MAILCHIMP_SERVER_PREFIX || 'us17';
      const response = await fetch(`https://${server}.api.mailchimp.com/3.0/`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString('base64')}`
        }
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        this.results.push({
          provider: 'Mailchimp',
          status: 'healthy',
          response: `API accessible`,
          latency
        });
      } else {
        const error = await response.text();
        this.results.push({
          provider: 'Mailchimp',
          status: 'error',
          error: `HTTP ${response.status}: ${error.substring(0, 100)}`
        });
      }
    } catch (error) {
      this.results.push({
        provider: 'Mailchimp',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async checkZapierWebhook(): Promise<void> {
    if (!process.env.ZAPIER_WEBHOOK_URL) {
      this.results.push({
        provider: 'Zapier Webhook',
        status: 'missing_key',
        error: 'ZAPIER_WEBHOOK_URL não configurada'
      });
      return;
    }

    try {
      const startTime = Date.now();
      const response = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          source: 'health-check'
        })
      });

      const latency = Date.now() - startTime;

      if (response.ok) {
        this.results.push({
          provider: 'Zapier Webhook',
          status: 'healthy',
          response: 'Webhook accessible',
          latency
        });
      } else {
        this.results.push({
          provider: 'Zapier Webhook',
          status: 'error',
          error: `HTTP ${response.status}`
        });
      }
    } catch (error) {
      this.results.push({
        provider: 'Zapier Webhook',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private printResults(): void {
    console.log('\n📊 RESULTADOS DO HEALTH CHECK\n');
    console.log('═'.repeat(60));

    const healthy = this.results.filter(r => r.status === 'healthy');
    const errors = this.results.filter(r => r.status === 'error');
    const missingKeys = this.results.filter(r => r.status === 'missing_key');

    this.results.forEach(result => {
      const statusIcon = result.status === 'healthy' ? '✅' : 
                        result.status === 'error' ? '❌' : '⚠️';
      
      console.log(`${statusIcon} ${result.provider.padEnd(15)} | ${result.status.toUpperCase()}`);
      
      if (result.response) {
        console.log(`   → ${result.response}`);
      }
      
      if (result.latency) {
        console.log(`   → Latência: ${result.latency}ms`);
      }
      
      if (result.error) {
        console.log(`   → Erro: ${result.error}`);
      }
      
      console.log('');
    });

    console.log('═'.repeat(60));
    console.log(`📈 RESUMO: ${healthy.length}/${this.results.length} provedores funcionais`);
    
    if (errors.length === 0 && missingKeys.length === 0) {
      console.log('🎉 ALL PROVIDERS ✅');
    } else {
      console.log(`\n🔧 AÇÕES NECESSÁRIAS:`);
      
      if (missingKeys.length > 0) {
        console.log(`\n⚠️  Chaves não configuradas (${missingKeys.length}):`);
        missingKeys.forEach(result => {
          console.log(`   • ${result.provider}: ${result.error}`);
        });
      }
      
      if (errors.length > 0) {
        console.log(`\n❌ Provedores com erro (${errors.length}):`);
        errors.forEach(result => {
          console.log(`   • ${result.provider}: ${result.error}`);
        });
      }
    }
    
    console.log('\n');
  }
}

// Execute health check
const checker = new HealthChecker();
checker.runFullHealthCheck().catch(console.error);