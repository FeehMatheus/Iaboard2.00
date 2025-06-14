import fetch from 'node-fetch';

interface LeonardoVideoRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: string;
  motion?: 'low' | 'medium' | 'high';
}

interface LeonardoVideoResponse {
  success: boolean;
  generationId?: string;
  videoUrl?: string;
  error?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number;
}

export class LeonardoAIService {
  private apiKey: string;
  private baseUrl = 'https://cloud.leonardo.ai/api/rest/v1';

  constructor() {
    this.apiKey = process.env.LEONARDO_API_KEY || '';
  }

  async generateVideo(request: LeonardoVideoRequest): Promise<LeonardoVideoResponse> {
    try {
      if (!this.apiKey) {
        console.log('Leonardo API key não encontrada, tentando usar OpenAI para vídeo...');
        return await this.generateWithOpenAI(request);
      }

      const enhancedPrompt = this.enhancePrompt(request.prompt, request.style || 'cinematic');

      const videoData = {
        height: this.getVideoDimensions(request.aspectRatio).height,
        width: this.getVideoDimensions(request.aspectRatio).width,
        motionStrength: this.getMotionStrength(request.motion || 'medium'),
        prompt: enhancedPrompt,
        isPublic: false
      };

      console.log('🎬 Gerando vídeo com Leonardo.ai:', enhancedPrompt);

      const response = await fetch(`${this.baseUrl}/generations-motion-svd`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoData)
      });

      if (!response.ok) {
        console.error('Leonardo API error:', response.status);
        return await this.generateWithOpenAI(request);
      }

      const result = await response.json() as any;

      return {
        success: true,
        generationId: result.sdGenerationJob?.generationId,
        status: 'processing',
        estimatedTime: 45
      };

    } catch (error) {
      console.error('Leonardo service error:', error);
      return await this.generateWithOpenAI(request);
    }
  }

  async checkVideoStatus(generationId: string): Promise<LeonardoVideoResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'Leonardo API key não configurada'
        };
      }

      const response = await fetch(`${this.baseUrl}/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ao verificar status: ${response.status}`
        };
      }

      const result = await response.json() as any;
      const generation = result.generations_by_pk;

      if (generation?.status === 'COMPLETE' && generation.generated_images?.length > 0) {
        const videoUrl = generation.generated_images[0].motionMP4URL;
        
        if (videoUrl) {
          return {
            success: true,
            status: 'completed',
            videoUrl: videoUrl,
            generationId: generationId
          };
        }
      }

      if (generation?.status === 'FAILED') {
        return {
          success: false,
          status: 'failed',
          error: 'Geração falhou no Leonardo.ai'
        };
      }

      return {
        success: true,
        status: 'processing',
        generationId: generationId,
        estimatedTime: 30
      };

    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar status'
      };
    }
  }

  private async generateWithOpenAI(request: LeonardoVideoRequest): Promise<LeonardoVideoResponse> {
    try {
      console.log('🤖 Gerando vídeo conceitual com OpenAI + FFmpeg...');
      
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Gerar conceito visual detalhado com OpenAI
      const conceptResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'system',
          content: 'Você é um diretor de vídeo criativo. Crie uma descrição visual detalhada e cinematográfica para um vídeo baseado no prompt do usuário. Inclua elementos visuais específicos, movimentos de câmera, cores, e atmosfera.'
        }, {
          role: 'user',
          content: `Crie um conceito visual detalhado para: ${request.prompt}`
        }],
        max_tokens: 500
      });

      const videoDescription = conceptResponse.choices[0].message.content || request.prompt;

      // Gerar vídeo usando sistema interno aprimorado
      const { enhancedVideoGenerator } = await import('./enhanced-video-generator');
      const videoResult = await enhancedVideoGenerator.generateAIVideo({
        prompt: request.prompt,
        description: videoDescription,
        aspectRatio: request.aspectRatio || '16:9',
        style: request.style || 'cinematic',
        duration: request.duration || 5
      });

      if (videoResult.success) {
        return {
          success: true,
          status: 'completed',
          videoUrl: videoResult.videoUrl,
          generationId: `openai_${Date.now()}`
        };
      }

      throw new Error('Falha na geração do vídeo');

    } catch (error) {
      console.error('OpenAI video generation error:', error);
      return {
        success: false,
        error: 'Falha na geração de vídeo. Verifique as chaves API.'
      };
    }
  }

  private enhancePrompt(originalPrompt: string, style: string): string {
    const styleMap: Record<string, string> = {
      'cinematic': 'cinematic, professional cinematography, dramatic lighting, film quality',
      'anime': 'anime style, vibrant colors, dynamic animation, Japanese art style',
      'realistic': 'photorealistic, natural lighting, documentary style, authentic',
      'cartoon': '3D animation, colorful, playful style, smooth motion',
      'abstract': 'abstract art, artistic, creative interpretation, fluid motion'
    };

    const enhancement = styleMap[style] || styleMap['cinematic'];
    return `${originalPrompt}, ${enhancement}, high quality, smooth motion`;
  }

  private getVideoDimensions(aspectRatio?: string) {
    const dimensions: Record<string, { width: number; height: number }> = {
      '16:9': { width: 1024, height: 576 },
      '9:16': { width: 576, height: 1024 },
      '1:1': { width: 768, height: 768 }
    };
    return dimensions[aspectRatio || '16:9'];
  }

  private getMotionStrength(motion: string): number {
    const strengthMap: Record<string, number> = {
      'low': 3,
      'medium': 5,
      'high': 7
    };
    return strengthMap[motion] || 5;
  }

  async downloadVideo(videoUrl: string, filename: string): Promise<{ success: boolean; localPath?: string; error?: string }> {
    try {
      const response = await fetch(videoUrl);
      
      if (!response.ok) {
        return {
          success: false,
          error: 'Falha ao baixar vídeo'
        };
      }

      const fs = await import('fs/promises');
      const path = await import('path');
      
      const outputDir = path.join(process.cwd(), 'public', 'ai-videos');
      await fs.mkdir(outputDir, { recursive: true });
      
      const localPath = path.join(outputDir, filename);
      const buffer = await response.buffer();
      await fs.writeFile(localPath, buffer);

      return {
        success: true,
        localPath: `/ai-videos/${filename}`
      };

    } catch (error) {
      console.error('Download error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao baixar vídeo'
      };
    }
  }
}

export const leonardoAIService = new LeonardoAIService();