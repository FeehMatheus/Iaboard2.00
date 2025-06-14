import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';
import { tokenManager } from './token-manager';

interface AIRequest {
  prompt: string;
  type: 'text' | 'image' | 'video' | 'audio';
  parameters?: any;
}

interface AIResponse {
  success: boolean;
  content?: string;
  url?: string;
  error?: string;
  provider?: string;
  metadata?: any;
}

export class RealAIServices {
  private openai?: OpenAI;
  private anthropic?: Anthropic;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }

  async generateText(request: AIRequest): Promise<AIResponse> {
    console.log('🤖 Generating text with real AI services');

    // Try OpenAI first
    if (this.openai && tokenManager.canUseService('openai')) {
      try {
        tokenManager.useToken('openai');
        
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            { role: 'system', content: 'You are a professional AI assistant.' },
            { role: 'user', content: request.prompt }
          ],
          max_tokens: request.parameters?.maxTokens || 1000,
          temperature: request.parameters?.temperature || 0.7
        });

        return {
          success: true,
          content: response.choices[0].message.content || '',
          provider: 'OpenAI GPT-4o',
          metadata: {
            model: 'gpt-4o',
            tokens: response.usage?.total_tokens || 0
          }
        };
      } catch (error) {
        console.log('OpenAI error:', (error as Error).message);
      }
    }

    // Try Anthropic
    if (this.anthropic && tokenManager.canUseService('anthropic')) {
      try {
        tokenManager.useToken('anthropic');
        
        const response = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: request.parameters?.maxTokens || 1000,
          messages: [
            { role: 'user', content: request.prompt }
          ]
        });

        return {
          success: true,
          content: response.content[0].type === 'text' ? response.content[0].text : '',
          provider: 'Anthropic Claude-3',
          metadata: {
            model: 'claude-3-sonnet-20240229',
            tokens: response.usage.input_tokens + response.usage.output_tokens
          }
        };
      } catch (error) {
        console.log('Anthropic error:', (error as Error).message);
      }
    }

    // Try free alternatives
    return await this.tryFreeTextAPIs(request);
  }

  async generateImage(request: AIRequest): Promise<AIResponse> {
    console.log('🎨 Generating image with real AI services');

    // Try DALL-E 3
    if (this.openai && tokenManager.canUseService('openai')) {
      try {
        tokenManager.useToken('openai');
        
        const response = await this.openai.images.generate({
          model: 'dall-e-3',
          prompt: request.prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        });

        return {
          success: true,
          url: response.data[0].url,
          provider: 'OpenAI DALL-E 3',
          metadata: {
            model: 'dall-e-3',
            size: '1024x1024'
          }
        };
      } catch (error) {
        console.log('DALL-E error:', (error as Error).message);
      }
    }

    // Try free image generation APIs
    return await this.tryFreeImageAPIs(request);
  }

  private async tryFreeTextAPIs(request: AIRequest): Promise<AIResponse> {
    // Try Hugging Face free text models
    const models = [
      'microsoft/DialoGPT-large',
      'facebook/blenderbot-400M-distill',
      'google/flan-t5-large'
    ];

    for (const model of models) {
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: request.prompt,
            parameters: {
              max_length: request.parameters?.maxTokens || 500,
              temperature: request.parameters?.temperature || 0.7
            }
          })
        });

        if (response.ok) {
          const data = await response.json() as any;
          
          if (data && data[0] && data[0].generated_text) {
            return {
              success: true,
              content: data[0].generated_text,
              provider: `Hugging Face - ${model}`,
              metadata: { model, free: true }
            };
          }
        }
      } catch (error) {
        console.log(`Free text model ${model} failed:`, (error as Error).message);
      }
    }

    return { success: false, error: 'All free text APIs failed' };
  }

  private async tryFreeImageAPIs(request: AIRequest): Promise<AIResponse> {
    // Try Hugging Face free image generation
    const models = [
      'runwayml/stable-diffusion-v1-5',
      'CompVis/stable-diffusion-v1-4',
      'prompthero/openjourney'
    ];

    for (const model of models) {
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: request.prompt
          })
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('image')) {
            // For actual deployment, we'd save this image and return a URL
            // For now, return the blob URL concept
            return {
              success: true,
              url: `data:${contentType};base64,${(await response.buffer()).toString('base64')}`,
              provider: `Hugging Face - ${model}`,
              metadata: { model, free: true }
            };
          }
        }
      } catch (error) {
        console.log(`Free image model ${model} failed:`, (error as Error).message);
      }
    }

    return { success: false, error: 'All free image APIs failed' };
  }

  async generateVideo(request: AIRequest): Promise<AIResponse> {
    console.log('🎬 Generating video with real AI services');
    
    // Use the existing free video APIs system
    const { freeRealVideoAPIs } = await import('./free-real-video-apis');
    
    const result = await freeRealVideoAPIs.generateVideo({
      prompt: request.prompt,
      aspectRatio: request.parameters?.aspectRatio || '16:9',
      style: request.parameters?.style || 'cinematic',
      duration: request.parameters?.duration || 5
    });

    return {
      success: result.success,
      url: result.videoUrl,
      error: result.error,
      provider: result.metadata?.provider || 'Free Video APIs',
      metadata: result.metadata
    };
  }

  async generateAudio(request: AIRequest): Promise<AIResponse> {
    console.log('🎵 Generating audio with real AI services');

    // Try OpenAI TTS
    if (this.openai && tokenManager.canUseService('openai')) {
      try {
        tokenManager.useToken('openai');
        
        const response = await this.openai.audio.speech.create({
          model: 'tts-1',
          voice: 'alloy',
          input: request.prompt
        });

        // For actual deployment, we'd save this audio file
        return {
          success: true,
          url: 'data:audio/mpeg;base64,' + Buffer.from(await response.arrayBuffer()).toString('base64'),
          provider: 'OpenAI TTS',
          metadata: {
            model: 'tts-1',
            voice: 'alloy'
          }
        };
      } catch (error) {
        console.log('OpenAI TTS error:', (error as Error).message);
      }
    }

    // Try free TTS alternatives
    return await this.tryFreeTTSAPIs(request);
  }

  private async tryFreeTTSAPIs(request: AIRequest): Promise<AIResponse> {
    try {
      // Try Microsoft Cognitive Services free tier
      const response = await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
        },
        body: `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
          <voice name='en-US-JennyNeural'>${request.prompt}</voice>
        </speak>`
      });

      if (response.ok) {
        const audioBuffer = await response.buffer();
        return {
          success: true,
          url: 'data:audio/mpeg;base64,' + audioBuffer.toString('base64'),
          provider: 'Microsoft TTS (Free)',
          metadata: { voice: 'en-US-JennyNeural', free: true }
        };
      }
    } catch (error) {
      console.log('Free TTS failed:', (error as Error).message);
    }

    return { success: false, error: 'All free TTS APIs failed' };
  }

  // Universal AI generation method
  async generate(request: AIRequest): Promise<AIResponse> {
    switch (request.type) {
      case 'text':
        return await this.generateText(request);
      case 'image':
        return await this.generateImage(request);
      case 'video':
        return await this.generateVideo(request);
      case 'audio':
        return await this.generateAudio(request);
      default:
        return { success: false, error: 'Unsupported generation type' };
    }
  }
}

export const realAIServices = new RealAIServices();