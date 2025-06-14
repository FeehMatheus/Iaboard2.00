import fetch from 'node-fetch';

interface RunwayGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: string;
  motion?: 'low' | 'medium' | 'high';
  seed?: number;
}

interface RunwayGenerationResponse {
  success: boolean;
  taskId?: string;
  videoUrl?: string;
  error?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number;
}

export class RunwayAIService {
  private apiKey: string;
  private baseUrl = 'https://api.runwayml.com/v1';

  constructor() {
    this.apiKey = process.env.RUNWAY_API_KEY || '';
  }

  async generateVideo(request: RunwayGenerationRequest): Promise<RunwayGenerationResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'RunwayML API key não configurada. Configure RUNWAY_API_KEY nas variáveis de ambiente.'
        };
      }

      // Create enhanced prompt based on style
      const enhancedPrompt = this.enhancePrompt(request.prompt, request.style || 'cinematic');

      const generationData = {
        prompt: enhancedPrompt,
        duration: request.duration || 4,
        aspectRatio: this.convertAspectRatio(request.aspectRatio || '16:9'),
        motion: request.motion || 'medium',
        seed: request.seed || Math.floor(Math.random() * 1000000),
        model: 'gen3a_turbo' // RunwayML's latest video generation model
      };

      console.log('🎬 Iniciando geração de vídeo RunwayML:', {
        prompt: enhancedPrompt,
        duration: generationData.duration,
        aspectRatio: generationData.aspectRatio
      });

      const response = await fetch(`${this.baseUrl}/video/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Runway-Version': '2024-06-01'
        },
        body: JSON.stringify(generationData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('RunwayML API Error:', errorData);
        
        if (response.status === 401) {
          return {
            success: false,
            error: 'API key inválida. Verifique sua chave RunwayML.'
          };
        }
        
        if (response.status === 429) {
          return {
            success: false,
            error: 'Limite de rate atingido. Tente novamente em alguns minutos.'
          };
        }

        return {
          success: false,
          error: `Erro na API RunwayML: ${response.status} - ${errorData}`
        };
      }

      const result = await response.json() as any;

      return {
        success: true,
        taskId: result.id,
        status: 'processing',
        estimatedTime: 60 // RunwayML typically takes 1-2 minutes
      };

    } catch (error) {
      console.error('RunwayML service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido no RunwayML'
      };
    }
  }

  async checkGenerationStatus(taskId: string): Promise<RunwayGenerationResponse> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'RunwayML API key não configurada'
        };
      }

      const response = await fetch(`${this.baseUrl}/video/generate/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Runway-Version': '2024-06-01'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        return {
          success: false,
          error: `Erro ao verificar status: ${response.status} - ${errorData}`
        };
      }

      const result = await response.json() as any;

      if (result.status === 'SUCCEEDED') {
        return {
          success: true,
          status: 'completed',
          videoUrl: result.output?.[0] || result.video_url,
          taskId: taskId
        };
      }

      if (result.status === 'FAILED') {
        return {
          success: false,
          status: 'failed',
          error: result.failure_reason || 'Geração falhou',
          taskId: taskId
        };
      }

      return {
        success: true,
        status: 'processing',
        taskId: taskId,
        estimatedTime: this.calculateRemainingTime(result.progress || 0)
      };

    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar status'
      };
    }
  }

  private enhancePrompt(originalPrompt: string, style: string): string {
    const styleEnhancements: Record<string, string> = {
      'cinematic': 'cinematic lighting, professional camera work, dramatic composition, film grain, color graded',
      'anime': 'anime style, vibrant colors, dynamic movement, Japanese animation aesthetic, detailed character design',
      'realistic': 'photorealistic, natural lighting, authentic details, documentary style, high definition',
      'cartoon': '3D cartoon style, colorful, playful animation, smooth character movement, Pixar-like quality',
      'abstract': 'abstract art style, geometric shapes, fluid motion, artistic interpretation, creative visualization'
    };

    const enhancement = styleEnhancements[style] || styleEnhancements['cinematic'];
    
    return `${originalPrompt}, ${enhancement}, high quality, smooth motion, 4K resolution`;
  }

  private convertAspectRatio(ratio: string): string {
    const ratioMap: Record<string, string> = {
      '16:9': '1280:720',
      '9:16': '720:1280',
      '1:1': '720:720'
    };
    return ratioMap[ratio] || ratioMap['16:9'];
  }

  private calculateRemainingTime(progress: number): number {
    // Estimate remaining time based on progress (0-100)
    if (progress < 10) return 90;
    if (progress < 25) return 75;
    if (progress < 50) return 45;
    if (progress < 75) return 20;
    return 10;
  }

  async downloadVideo(videoUrl: string, filename: string): Promise<{ success: boolean; localPath?: string; error?: string }> {
    try {
      const response = await fetch(videoUrl);
      
      if (!response.ok) {
        return {
          success: false,
          error: 'Falha ao baixar vídeo do RunwayML'
        };
      }

      const fs = await import('fs/promises');
      const path = await import('path');
      
      const outputDir = path.join(process.cwd(), 'public', 'runway-videos');
      await fs.mkdir(outputDir, { recursive: true });
      
      const localPath = path.join(outputDir, filename);
      const buffer = await response.buffer();
      await fs.writeFile(localPath, buffer);

      return {
        success: true,
        localPath: `/runway-videos/${filename}`
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

export const runwayAIService = new RunwayAIService();