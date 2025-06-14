import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { tokenManager } from './token-manager';

interface PublicAPIRequest {
  prompt: string;
  type: 'text' | 'image' | 'video' | 'audio';
  parameters?: any;
}

interface PublicAPIResponse {
  success: boolean;
  content?: string;
  url?: string;
  error?: string;
  provider?: string;
  metadata?: any;
}

export class FreePublicAPIs {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'generated-content');
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  async generateContent(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    console.log(`🌐 Using truly free public APIs for ${request.type}:`, request.prompt);

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
        return { success: false, error: 'Unsupported content type' };
    }
  }

  private async generateText(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    // Try multiple free text generation APIs
    const freeTextAPIs = [
      () => this.tryHuggingFaceText(request),
      () => this.tryGoogleBardAPI(request),
      () => this.tryPerplexityAPI(request),
      () => this.tryCoereTrial(request),
      () => this.tryOllamaPublic(request)
    ];

    for (const api of freeTextAPIs) {
      try {
        const result = await api();
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.log(`Text API failed: ${(error as Error).message}`);
      }
    }

    return { success: false, error: 'All free text APIs failed' };
  }

  private async tryHuggingFaceText(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    const models = [
      'microsoft/DialoGPT-large',
      'EleutherAI/gpt-j-6b',
      'facebook/blenderbot-400M-distill',
      'microsoft/DialoGPT-medium',
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
              temperature: request.parameters?.temperature || 0.7,
              do_sample: true,
              top_p: 0.9
            }
          })
        });

        if (response.ok) {
          const data = await response.json() as any;
          
          if (data && data[0] && data[0].generated_text) {
            let generatedText = data[0].generated_text;
            
            // Clean up the response - remove the original prompt if it's repeated
            if (generatedText.startsWith(request.prompt)) {
              generatedText = generatedText.slice(request.prompt.length).trim();
            }
            
            if (generatedText.length > 10) {
              return {
                success: true,
                content: generatedText,
                provider: `Hugging Face - ${model}`,
                metadata: { model, free: true, authentic: true }
              };
            }
          }
        }
      } catch (error) {
        console.log(`HF model ${model} failed:`, (error as Error).message);
      }
    }

    return { success: false, error: 'Hugging Face text models failed' };
  }

  private async tryGoogleBardAPI(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    try {
      // Try Google's free AI Studio API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: request.prompt }]
          }],
          generationConfig: {
            temperature: request.parameters?.temperature || 0.7,
            maxOutputTokens: request.parameters?.maxTokens || 500
          }
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const content = data.candidates[0].content.parts[0].text;
          
          return {
            success: true,
            content,
            provider: 'Google Gemini Pro',
            metadata: { model: 'gemini-pro', free: true, authentic: true }
          };
        }
      }
    } catch (error) {
      console.log('Google Bard API failed:', (error as Error).message);
    }

    return { success: false, error: 'Google Bard API failed' };
  }

  private async tryPerplexityAPI(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    try {
      // Try Perplexity's free tier
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'sonar-small-chat',
          messages: [
            { role: 'user', content: request.prompt }
          ],
          max_tokens: request.parameters?.maxTokens || 500,
          temperature: request.parameters?.temperature || 0.7
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          return {
            success: true,
            content: data.choices[0].message.content,
            provider: 'Perplexity AI',
            metadata: { model: 'sonar-small-chat', free: true, authentic: true }
          };
        }
      }
    } catch (error) {
      console.log('Perplexity API failed:', (error as Error).message);
    }

    return { success: false, error: 'Perplexity API failed' };
  }

  private async tryCoereTrial(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    try {
      // Try Cohere's trial API
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          max_tokens: request.parameters?.maxTokens || 500,
          temperature: request.parameters?.temperature || 0.7,
          model: 'command'
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.generations && data.generations[0]) {
          return {
            success: true,
            content: data.generations[0].text.trim(),
            provider: 'Cohere',
            metadata: { model: 'command', free: true, authentic: true }
          };
        }
      }
    } catch (error) {
      console.log('Cohere API failed:', (error as Error).message);
    }

    return { success: false, error: 'Cohere API failed' };
  }

  private async tryOllamaPublic(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    try {
      // Try public Ollama instances
      const response = await fetch('https://ollama.ai/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: request.prompt,
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.response) {
          return {
            success: true,
            content: data.response,
            provider: 'Ollama Public',
            metadata: { model: 'llama2', free: true, authentic: true }
          };
        }
      }
    } catch (error) {
      console.log('Ollama public failed:', (error as Error).message);
    }

    return { success: false, error: 'Ollama public failed' };
  }

  private async generateImage(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    // Try free image generation APIs
    const freeImageAPIs = [
      () => this.tryHuggingFaceImage(request),
      () => this.tryReplicate(request),
      () => this.tryStableDiffusionWeb(request)
    ];

    for (const api of freeImageAPIs) {
      try {
        const result = await api();
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.log(`Image API failed: ${(error as Error).message}`);
      }
    }

    return { success: false, error: 'All free image APIs failed' };
  }

  private async tryHuggingFaceImage(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    const models = [
      'runwayml/stable-diffusion-v1-5',
      'CompVis/stable-diffusion-v1-4',
      'stabilityai/stable-diffusion-2-1'
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
            const imageBuffer = await response.buffer();
            const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const outputPath = path.join(this.outputDir, `${imageId}.png`);
            
            await fs.writeFile(outputPath, imageBuffer);
            
            return {
              success: true,
              url: `/generated-content/${imageId}.png`,
              provider: `Hugging Face - ${model}`,
              metadata: { model, free: true, authentic: true }
            };
          }
        }
      } catch (error) {
        console.log(`HF image model ${model} failed:`, (error as Error).message);
      }
    }

    return { success: false, error: 'Hugging Face image models failed' };
  }

  private async tryReplicate(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: 'stability-ai/stable-diffusion',
          input: {
            prompt: request.prompt
          }
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.output && data.output[0]) {
          return {
            success: true,
            url: data.output[0],
            provider: 'Replicate Stable Diffusion',
            metadata: { model: 'stable-diffusion', free: true, authentic: true }
          };
        }
      }
    } catch (error) {
      console.log('Replicate failed:', (error as Error).message);
    }

    return { success: false, error: 'Replicate failed' };
  }

  private async tryStableDiffusionWeb(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    try {
      const response = await fetch('https://stablediffusionapi.com/api/v3/text2img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          width: 512,
          height: 512,
          samples: 1
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.output && data.output[0]) {
          return {
            success: true,
            url: data.output[0],
            provider: 'Stable Diffusion API',
            metadata: { free: true, authentic: true }
          };
        }
      }
    } catch (error) {
      console.log('Stable Diffusion Web failed:', (error as Error).message);
    }

    return { success: false, error: 'Stable Diffusion Web failed' };
  }

  private async generateVideo(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    // Use the existing free video APIs
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
      metadata: { ...result.metadata, authentic: true }
    };
  }

  private async generateAudio(request: PublicAPIRequest): Promise<PublicAPIResponse> {
    try {
      // Try ElevenLabs free tier
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: request.prompt,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (response.ok) {
        const audioBuffer = await response.buffer();
        const audioId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const outputPath = path.join(this.outputDir, `${audioId}.mp3`);
        
        await fs.writeFile(outputPath, audioBuffer);
        
        return {
          success: true,
          url: `/generated-content/${audioId}.mp3`,
          provider: 'ElevenLabs Free',
          metadata: { free: true, authentic: true }
        };
      }
    } catch (error) {
      console.log('ElevenLabs failed:', (error as Error).message);
    }

    return { success: false, error: 'Audio generation failed' };
  }
}

export const freePublicAPIs = new FreePublicAPIs();