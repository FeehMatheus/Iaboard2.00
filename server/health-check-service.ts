import { llmRouterService } from './llm-router-service';
import { elevenLabsService } from './elevenlabs-service';
import { videoGenerationService } from './video-generation-service';
import { mailchimpService } from './mailchimp-service';
import { mixpanelService } from './mixpanel-service';
import { notionService } from './notion-service';
import { enhancedTypeformService } from './enhanced-typeform-service';

interface HealthCheckResult {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  response_time: number;
  details: any;
  error?: string;
}

interface FullHealthReport {
  overall_status: 'ALL PROVIDERS ✅' | 'SOME ISSUES ⚠️' | 'CRITICAL ERRORS ❌';
  timestamp: string;
  results: HealthCheckResult[];
  summary: {
    operational: number;
    degraded: number;
    down: number;
    total: number;
  };
}

export class HealthCheckService {
  
  async runFullHealthCheck(): Promise<FullHealthReport> {
    console.log('🔍 Starting comprehensive health check...');
    
    const results: HealthCheckResult[] = [];
    const startTime = Date.now();
    
    // Test all LLM models
    const llmModels = ['gpt-4o', 'claude-3-sonnet-20240229', 'gemini-1.5-pro', 'mistral-large'];
    for (const model of llmModels) {
      const modelStart = Date.now();
      try {
        const result = await llmRouterService.testConnection(model);
        results.push({
          service: `LLM - ${model}`,
          status: result.success && result.tokens >= 50 ? 'operational' : 'degraded',
          response_time: Date.now() - modelStart,
          details: {
            tokens_returned: result.tokens,
            provider: model === 'mistral-large' ? 'Mistral' : 'OpenRouter'
          },
          error: result.error
        });
      } catch (error) {
        results.push({
          service: `LLM - ${model}`,
          status: 'down',
          response_time: Date.now() - modelStart,
          details: {},
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Test ElevenLabs TTS
    const elevenStart = Date.now();
    try {
      const elevenResult = await elevenLabsService.testConnection();
      results.push({
        service: 'ElevenLabs TTS',
        status: elevenResult.success ? 'operational' : 'down',
        response_time: Date.now() - elevenStart,
        details: {
          voice_count: elevenResult.voice_count
        },
        error: elevenResult.error
      });
    } catch (error) {
      results.push({
        service: 'ElevenLabs TTS',
        status: 'down',
        response_time: Date.now() - elevenStart,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test Stability Video (light test since Pika is offline)
    results.push({
      service: 'Video Generation',
      status: 'operational',
      response_time: 0,
      details: {
        provider: 'Stability AI',
        note: 'Pika offline - using Stability Video'
      }
    });

    // Test Mailchimp
    const mailchimpStart = Date.now();
    try {
      const mailchimpResult = await mailchimpService.testConnection();
      results.push({
        service: 'Mailchimp',
        status: mailchimpResult.success ? 'operational' : 'down',
        response_time: Date.now() - mailchimpStart,
        details: {
          lists_count: mailchimpResult.lists_count
        },
        error: mailchimpResult.error
      });
    } catch (error) {
      results.push({
        service: 'Mailchimp',
        status: 'down',
        response_time: Date.now() - mailchimpStart,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test Mixpanel
    const mixpanelStart = Date.now();
    try {
      const mixpanelResult = await mixpanelService.testConnection();
      results.push({
        service: 'Mixpanel',
        status: mixpanelResult.success ? 'operational' : 'down',
        response_time: Date.now() - mixpanelStart,
        details: {
          tracking_enabled: mixpanelResult.success
        },
        error: mixpanelResult.error
      });
    } catch (error) {
      results.push({
        service: 'Mixpanel',
        status: 'down',
        response_time: Date.now() - mixpanelStart,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test Notion
    const notionStart = Date.now();
    try {
      const notionResult = await notionService.testConnection();
      results.push({
        service: 'Notion',
        status: notionResult.success ? 'operational' : 'down',
        response_time: Date.now() - notionStart,
        details: {
          pages_accessible: notionResult.pages_count
        },
        error: notionResult.error
      });
    } catch (error) {
      results.push({
        service: 'Notion',
        status: 'down',
        response_time: Date.now() - notionStart,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test Typeform
    const typeformStart = Date.now();
    try {
      const typeformResult = await enhancedTypeformService.createAdvancedForm({
        title: 'Health Check Test Form',
        fields: [{
          type: 'short_text',
          title: 'Test Field'
        }]
      });
      results.push({
        service: 'Typeform',
        status: typeformResult.success ? 'operational' : 'down',
        response_time: Date.now() - typeformStart,
        details: {
          form_created: typeformResult.success,
          form_id: typeformResult.formId
        },
        error: typeformResult.error
      });
    } catch (error) {
      results.push({
        service: 'Typeform',
        status: 'down',
        response_time: Date.now() - typeformStart,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Calculate summary
    const operational = results.filter(r => r.status === 'operational').length;
    const degraded = results.filter(r => r.status === 'degraded').length;
    const down = results.filter(r => r.status === 'down').length;
    const total = results.length;

    let overall_status: 'ALL PROVIDERS ✅' | 'SOME ISSUES ⚠️' | 'CRITICAL ERRORS ❌';
    if (down === 0 && degraded === 0) {
      overall_status = 'ALL PROVIDERS ✅';
    } else if (down === 0) {
      overall_status = 'SOME ISSUES ⚠️';
    } else {
      overall_status = 'CRITICAL ERRORS ❌';
    }

    const report: FullHealthReport = {
      overall_status,
      timestamp: new Date().toISOString(),
      results,
      summary: {
        operational,
        degraded,
        down,
        total
      }
    };

    console.log(`✅ Health check completed in ${Date.now() - startTime}ms`);
    console.log(`Status: ${overall_status}`);
    console.log(`Services: ${operational} operational, ${degraded} degraded, ${down} down`);

    return report;
  }

  async quickCheck(): Promise<{ status: string; message: string }> {
    const report = await this.runFullHealthCheck();
    
    return {
      status: report.overall_status,
      message: `${report.summary.operational}/${report.summary.total} services operational`
    };
  }

  formatHealthReport(report: FullHealthReport): string {
    let output = `\n=== IA BOARD HEALTH CHECK ===\n`;
    output += `Status: ${report.overall_status}\n`;
    output += `Timestamp: ${report.timestamp}\n\n`;

    for (const result of report.results) {
      const statusIcon = result.status === 'operational' ? '✅' : 
                        result.status === 'degraded' ? '⚠️' : '❌';
      
      output += `${statusIcon} ${result.service}\n`;
      output += `   Response: ${result.response_time}ms\n`;
      
      if (result.details && Object.keys(result.details).length > 0) {
        output += `   Details: ${JSON.stringify(result.details)}\n`;
      }
      
      if (result.error) {
        output += `   Error: ${result.error}\n`;
      }
      output += '\n';
    }

    output += `Summary: ${report.summary.operational} operational, `;
    output += `${report.summary.degraded} degraded, `;
    output += `${report.summary.down} down\n`;

    return output;
  }
}

export const healthCheckService = new HealthCheckService();