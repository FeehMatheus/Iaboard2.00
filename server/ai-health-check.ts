import { aiMultiProvider } from './ai-multi-provider';
import { stabilityVideoService } from './stability-video-service';
import { heyGenAvatarService } from './heygen-avatar-service';
import { googleTTSService } from './google-tts-service';
import { typeformService } from './typeform-service';

interface HealthCheckResult {
  service: string;
  success: boolean;
  message: string;
  details?: any;
  url?: string;
}

export class AIHealthCheck {
  async runFullHealthCheck(): Promise<{ success: boolean; results: HealthCheckResult[] }> {
    console.log('🔍 Running comprehensive AI health check...');
    
    const results: HealthCheckResult[] = [];

    // 1. LLM Multi-Provider Check
    console.log('Testing LLM providers...');
    const llmCheck = await aiMultiProvider.healthCheck();
    results.push({
      service: 'LLM Multi-Provider',
      success: llmCheck.success,
      message: llmCheck.success ? 'All LLM models responding correctly' : 'Some LLM models failed',
      details: llmCheck.results
    });

    // 2. Stability Video Check
    console.log('Testing Stability AI video generation...');
    const videoCheck = await stabilityVideoService.healthCheck();
    results.push({
      service: 'Stability Video',
      success: videoCheck.success,
      message: videoCheck.message,
      url: videoCheck.videoUrl
    });

    // 3. HeyGen Avatar Check
    console.log('Testing HeyGen avatar generation...');
    const avatarCheck = await heyGenAvatarService.healthCheck();
    results.push({
      service: 'HeyGen Avatar',
      success: avatarCheck.success,
      message: avatarCheck.message,
      url: avatarCheck.videoUrl
    });

    // 4. Google TTS Check
    console.log('Testing Google Text-to-Speech...');
    const ttsCheck = await googleTTSService.healthCheck();
    results.push({
      service: 'Google TTS',
      success: ttsCheck.success,
      message: ttsCheck.message,
      url: ttsCheck.audioUrl
    });

    // 5. Typeform Check
    console.log('Testing Typeform integration...');
    const formCheck = await typeformService.healthCheck();
    results.push({
      service: 'Typeform',
      success: formCheck.success,
      message: formCheck.message,
      url: formCheck.formUrl
    });

    const allPassed = results.every(r => r.success);
    
    console.log(`✅ Health check completed: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'}`);
    
    return {
      success: allPassed,
      results
    };
  }

  async quickCheck(): Promise<{ success: boolean; summary: string }> {
    const requiredEnvVars = [
      'OPENROUTER_API_KEY',
      'MISTRAL_API_KEY',
      'STABILITY_API_KEY',
      'HEYGEN_API_KEY',
      'TYPEFORM_API_KEY',
      'GOOGLE_API_KEY'
    ];

    const missing = requiredEnvVars.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      return {
        success: false,
        summary: `Missing API keys: ${missing.join(', ')}`
      };
    }

    return {
      success: true,
      summary: 'All API keys configured'
    };
  }
}

export const aiHealthCheck = new AIHealthCheck();