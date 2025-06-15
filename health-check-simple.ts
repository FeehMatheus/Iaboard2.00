#!/usr/bin/env tsx

import { config } from 'dotenv';
config();

interface CategoryStatus {
  category: string;
  available: boolean;
  provider?: string;
  status: 'healthy' | 'error' | 'missing';
}

class SimpleHealthCheck {
  async runHealthCheck(): Promise<void> {
    console.log('🔍 Smart LLM Health Check\n');

    const categories = [
      { name: 'Chat LLM', key: 'chat', apis: ['MISTRAL_API_KEY', 'OPENROUTER_API_KEY', 'ANTHROPIC_API_KEY'] },
      { name: 'Video Gen', key: 'video', apis: ['STABILITY_API_KEY', 'PIKA_API_KEY'] },
      { name: 'Text-to-Speech', key: 'tts', apis: ['ELEVENLABS_API_KEY'] },
      { name: 'Automation', key: 'automation', apis: ['ZAPIER_WEBHOOK_URL'] },
      { name: 'Storage', key: 'storage', apis: ['NOTION_API_KEY'] }
    ];

    const results: CategoryStatus[] = [];

    for (const category of categories) {
      const availableAPIs = category.apis.filter(key => process.env[key]);
      
      if (availableAPIs.length === 0) {
        results.push({
          category: category.name,
          available: false,
          status: 'missing'
        });
      } else {
        results.push({
          category: category.name,
          available: true,
          provider: availableAPIs[0].replace('_API_KEY', '').toLowerCase(),
          status: 'healthy'
        });
      }
    }

    this.printResults(results);
  }

  private printResults(results: CategoryStatus[]): void {
    console.log('═'.repeat(50));
    
    results.forEach(result => {
      const icon = result.status === 'healthy' ? '✅' : 
                  result.status === 'missing' ? '⚠️' : '❌';
      
      console.log(`${icon} ${result.category.padEnd(15)} | ${result.status.toUpperCase()}`);
      
      if (result.provider) {
        console.log(`   → Provider: ${result.provider}`);
      }
    });

    console.log('═'.repeat(50));
    
    const healthy = results.filter(r => r.status === 'healthy').length;
    const total = results.length;
    
    console.log(`📊 Status: ${healthy}/${total} categories available`);
    
    if (healthy === total) {
      console.log('🎉 All systems operational');
    } else if (healthy > 0) {
      console.log('⚡ Partial functionality available');
    } else {
      console.log('❌ No providers available');
    }
  }
}

const checker = new SimpleHealthCheck();
checker.runHealthCheck().catch(console.error);