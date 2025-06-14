// Production Health Monitor for IA Board
// Tests all API services with real production keys

import { spawn } from 'child_process';

interface ServiceTest {
  name: string;
  status: 'testing' | 'operational' | 'error' | 'degraded';
  response_time: number;
  details: any;
  error?: string;
}

class ProductionHealthMonitor {
  private results: ServiceTest[] = [];

  async runAllTests(): Promise<void> {
    console.log('\n=== IA BOARD PRODUCTION HEALTH CHECK ===\n');
    
    // Test Mistral AI
    await this.testMistralAI();
    
    // Test OpenRouter
    await this.testOpenRouter();
    
    // Test Stability AI
    await this.testStabilityAI();
    
    // Test ElevenLabs
    await this.testElevenLabs();
    
    // Test Typeform
    await this.testTypeform();
    
    // Test Mailchimp
    await this.testMailchimp();
    
    // Test Mixpanel
    await this.testMixpanel();
    
    // Test Notion
    await this.testNotion();
    
    this.printResults();
  }

  private async testMistralAI(): Promise<void> {
    const start = Date.now();
    console.log('🤖 Testing Mistral AI...');
    
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [{ role: 'user', content: 'Generate exactly 50 tokens for health check' }],
          max_tokens: 60
        })
      });

      const data = await response.json();
      const responseTime = Date.now() - start;

      if (response.ok && data.choices?.[0]?.message?.content) {
        this.results.push({
          name: 'Mistral AI',
          status: data.usage?.total_tokens >= 50 ? 'operational' : 'degraded',
          response_time: responseTime,
          details: {
            model: data.model,
            tokens: data.usage?.total_tokens,
            content_length: data.choices[0].message.content.length
          }
        });
        console.log(`✅ Mistral AI: ${data.usage?.total_tokens} tokens in ${responseTime}ms`);
      } else {
        throw new Error(data.error?.message || 'Invalid response');
      }
    } catch (error) {
      this.results.push({
        name: 'Mistral AI',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ Mistral AI failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testOpenRouter(): Promise<void> {
    const start = Date.now();
    console.log('🔄 Testing OpenRouter...');
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ia-board.replit.app'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o',
          messages: [{ role: 'user', content: 'Health check - respond with exactly 50 tokens' }],
          max_tokens: 60
        })
      });

      const data = await response.json();
      const responseTime = Date.now() - start;

      if (response.ok && data.choices?.[0]?.message?.content) {
        this.results.push({
          name: 'OpenRouter (GPT-4o)',
          status: data.usage?.total_tokens >= 50 ? 'operational' : 'degraded',
          response_time: responseTime,
          details: {
            model: data.model,
            tokens: data.usage?.total_tokens,
            content_length: data.choices[0].message.content.length
          }
        });
        console.log(`✅ OpenRouter: ${data.usage?.total_tokens} tokens in ${responseTime}ms`);
      } else {
        throw new Error(data.error?.message || 'Invalid response');
      }
    } catch (error) {
      this.results.push({
        name: 'OpenRouter (GPT-4o)',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ OpenRouter failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testStabilityAI(): Promise<void> {
    const start = Date.now();
    console.log('🎨 Testing Stability AI...');
    
    try {
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text_prompts: [{ text: 'simple test image' }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 10
        })
      });

      const data = await response.json();
      const responseTime = Date.now() - start;

      if (response.ok && data.artifacts) {
        this.results.push({
          name: 'Stability AI',
          status: 'operational',
          response_time: responseTime,
          details: {
            images_generated: data.artifacts.length,
            model: 'stable-diffusion-xl-1024-v1-0'
          }
        });
        console.log(`✅ Stability AI: Generated ${data.artifacts.length} images in ${responseTime}ms`);
      } else {
        throw new Error(data.message || 'Image generation failed');
      }
    } catch (error) {
      this.results.push({
        name: 'Stability AI',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ Stability AI failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testElevenLabs(): Promise<void> {
    const start = Date.now();
    console.log('🔊 Testing ElevenLabs...');
    
    try {
      // First get voices
      const voicesResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
        }
      });

      if (!voicesResponse.ok) {
        throw new Error(`Voices fetch failed: ${voicesResponse.status}`);
      }

      const voicesData = await voicesResponse.json();
      const responseTime = Date.now() - start;

      this.results.push({
        name: 'ElevenLabs',
        status: 'operational',
        response_time: responseTime,
        details: {
          voices_available: voicesData.voices?.length || 0,
          api_accessible: true
        }
      });
      console.log(`✅ ElevenLabs: ${voicesData.voices?.length || 0} voices available in ${responseTime}ms`);
    } catch (error) {
      this.results.push({
        name: 'ElevenLabs',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ ElevenLabs failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testTypeform(): Promise<void> {
    const start = Date.now();
    console.log('📋 Testing Typeform...');
    
    try {
      const response = await fetch('https://api.typeform.com/me', {
        headers: {
          'Authorization': `Bearer ${process.env.TYPEFORM_API_KEY}`
        }
      });

      const data = await response.json();
      const responseTime = Date.now() - start;

      if (response.ok && data.alias) {
        this.results.push({
          name: 'Typeform',
          status: 'operational',
          response_time: responseTime,
          details: {
            account: data.alias,
            api_accessible: true
          }
        });
        console.log(`✅ Typeform: Account ${data.alias} accessible in ${responseTime}ms`);
      } else {
        throw new Error(data.description || 'Authentication failed');
      }
    } catch (error) {
      this.results.push({
        name: 'Typeform',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ Typeform failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testMailchimp(): Promise<void> {
    const start = Date.now();
    console.log('📧 Testing Mailchimp...');
    
    try {
      const response = await fetch(`https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists`, {
        headers: {
          'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`
        }
      });

      const data = await response.json();
      const responseTime = Date.now() - start;

      if (response.ok && data.lists) {
        this.results.push({
          name: 'Mailchimp',
          status: 'operational',
          response_time: responseTime,
          details: {
            lists_count: data.lists.length,
            total_subscribers: data.lists.reduce((sum: number, list: any) => sum + (list.stats?.member_count || 0), 0)
          }
        });
        console.log(`✅ Mailchimp: ${data.lists.length} lists accessible in ${responseTime}ms`);
      } else {
        throw new Error(data.detail || 'Lists fetch failed');
      }
    } catch (error) {
      this.results.push({
        name: 'Mailchimp',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ Mailchimp failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testMixpanel(): Promise<void> {
    const start = Date.now();
    console.log('📊 Testing Mixpanel...');
    
    try {
      const eventData = {
        event: 'Health Check',
        properties: {
          token: process.env.MIXPANEL_TOKEN,
          time: Math.floor(Date.now() / 1000),
          test: true
        }
      };

      const encodedData = Buffer.from(JSON.stringify(eventData)).toString('base64');
      
      const response = await fetch('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodedData}`
      });

      const result = await response.text();
      const responseTime = Date.now() - start;

      if (response.ok && result === '1') {
        this.results.push({
          name: 'Mixpanel',
          status: 'operational',
          response_time: responseTime,
          details: {
            event_tracked: true,
            token_valid: true
          }
        });
        console.log(`✅ Mixpanel: Event tracked successfully in ${responseTime}ms`);
      } else {
        throw new Error(`Tracking failed: ${result}`);
      }
    } catch (error) {
      this.results.push({
        name: 'Mixpanel',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ Mixpanel failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testNotion(): Promise<void> {
    const start = Date.now();
    console.log('📝 Testing Notion...');
    
    try {
      const response = await fetch('https://api.notion.com/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          page_size: 10
        })
      });

      const data = await response.json();
      const responseTime = Date.now() - start;

      if (response.ok && data.results !== undefined) {
        this.results.push({
          name: 'Notion',
          status: 'operational',
          response_time: responseTime,
          details: {
            pages_accessible: data.results.length,
            api_accessible: true
          }
        });
        console.log(`✅ Notion: ${data.results.length} pages accessible in ${responseTime}ms`);
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      this.results.push({
        name: 'Notion',
        status: 'error',
        response_time: Date.now() - start,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`❌ Notion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private printResults(): void {
    console.log('\n=== HEALTH CHECK RESULTS ===\n');
    
    const operational = this.results.filter(r => r.status === 'operational').length;
    const degraded = this.results.filter(r => r.status === 'degraded').length;
    const errors = this.results.filter(r => r.status === 'error').length;
    const total = this.results.length;

    let overallStatus = 'ALL PROVIDERS ✅';
    if (errors > 0) {
      overallStatus = 'CRITICAL ERRORS ❌';
    } else if (degraded > 0) {
      overallStatus = 'SOME ISSUES ⚠️';
    }

    console.log(`Overall Status: ${overallStatus}`);
    console.log(`Services: ${operational} operational, ${degraded} degraded, ${errors} failed\n`);

    this.results.forEach(result => {
      const statusIcon = result.status === 'operational' ? '✅' : 
                        result.status === 'degraded' ? '⚠️' : '❌';
      
      console.log(`${statusIcon} ${result.name}`);
      console.log(`   Response: ${result.response_time}ms`);
      
      if (Object.keys(result.details).length > 0) {
        console.log(`   Details: ${JSON.stringify(result.details)}`);
      }
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log('');
    });

    console.log('=== END HEALTH CHECK ===\n');
  }
}

// Run health check if called directly
if (require.main === module) {
  const monitor = new ProductionHealthMonitor();
  monitor.runAllTests().catch(console.error);
}

export { ProductionHealthMonitor };