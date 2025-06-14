import { BRAND_CONFIG } from '../client/src/lib/constants';

interface VideoGenerationRequest {
  text: string;
  voice?: string;
  avatar?: string;
  type: 'did' | 'runwayml' | 'pika';
}

interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  downloadUrl?: string;
  previewUrl?: string;
  instructionsUrl?: string;
  error?: string;
  metadata?: {
    duration: number;
    size: string;
    format: string;
    provider: string;
  };
}

export class VideoGenerationService {
  private didApiKey: string;

  constructor() {
    this.didApiKey = process.env.D_ID_API_KEY || '';
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      switch (request.type) {
        case 'did':
          return await this.generateWithDID(request);
        case 'runwayml':
          return this.generateWithRunwayML(request);
        case 'pika':
          return this.generateWithPika(request);
        default:
          throw new Error('Tipo de geração de vídeo não suportado');
      }
    } catch (error) {
      console.error('Erro na geração de vídeo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na geração de vídeo'
      };
    }
  }

  private async generateWithDID(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    if (!this.didApiKey) {
      throw new Error('D-ID API key não configurada');
    }

    const didPayload = {
      script: {
        type: 'text',
        input: request.text,
        provider: {
          type: 'microsoft',
          voice_id: request.voice || 'pt-BR-FranciscaNeural'
        }
      },
      presenter: {
        type: 'talk',
        presenter_id: request.avatar || 'amy-jcwCkr1grs',
        driver_id: 'uM00QMwJ9x'
      },
      config: {
        fluent: true,
        pad_audio: 0,
        align_driver: true,
        auto_match: true,
        normalization_factor: 1,
        sharpen: true,
        stitch: true,
        result_format: 'mp4'
      }
    };

    try {
      // Criar talk
      const createResponse = await fetch('https://api.d-id.com/talks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.didApiKey}:`).toString('base64')}`
        },
        body: JSON.stringify(didPayload)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.text();
        throw new Error(`D-ID API error: ${createResponse.status} - ${errorData}`);
      }

      const createData = await createResponse.json();
      const talkId = createData.id;

      // Aguardar processamento
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        
        const statusResponse = await fetch(`https://api.d-id.com/talks/${talkId}`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.didApiKey}:`).toString('base64')}`
          }
        });

        if (!statusResponse.ok) {
          throw new Error(`Erro ao verificar status: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        
        if (statusData.status === 'done') {
          return {
            success: true,
            videoUrl: statusData.result_url,
            downloadUrl: statusData.result_url,
            previewUrl: statusData.result_url,
            metadata: {
              duration: statusData.duration || 0,
              size: '~5MB',
              format: 'mp4',
              provider: 'D-ID'
            }
          };
        }
        
        if (statusData.status === 'error') {
          throw new Error(`D-ID processing error: ${statusData.error}`);
        }
        
        attempts++;
      }
      
      throw new Error('Timeout: vídeo não foi processado em tempo hábil');
      
    } catch (error) {
      console.error('D-ID Error:', error);
      throw error;
    }
  }

  private generateWithRunwayML(request: VideoGenerationRequest): VideoGenerationResponse {
    const runwayPrompt = encodeURIComponent(
      `${request.text}\n\nStyle: Professional, high-quality video generation\nDuration: 5-10 seconds`
    );
    
    return {
      success: true,
      instructionsUrl: `https://runwayml.com/ai-tools/gen-2?prompt=${runwayPrompt}`,
      metadata: {
        duration: 0,
        size: 'Variável',
        format: 'mp4',
        provider: 'RunwayML'
      }
    };
  }

  private generateWithPika(request: VideoGenerationRequest): VideoGenerationResponse {
    const instructions = `
Para gerar vídeo com Pika Labs:

1. Acesse: https://discord.gg/pika
2. Vá para o canal #generate-1
3. Digite: /create prompt: ${request.text}
4. Aguarde o processamento (1-2 minutos)
5. Baixe o vídeo gerado

Prompt otimizado: ${request.text}
    `.trim();

    return {
      success: true,
      instructionsUrl: 'https://discord.gg/pika',
      metadata: {
        duration: 0,
        size: 'Variável',
        format: 'mp4',
        provider: 'Pika Labs',
        instructions
      }
    };
  }

  async getAvailableVoices(): Promise<string[]> {
    return [
      'pt-BR-FranciscaNeural',
      'pt-BR-AntonioNeural',
      'en-US-AriaNeural',
      'en-US-DavisNeural',
      'es-ES-ElviraNeural',
      'fr-FR-DeniseNeural'
    ];
  }

  async getAvailableAvatars(): Promise<Array<{id: string, name: string, preview: string}>> {
    return [
      { id: 'amy-jcwCkr1grs', name: 'Amy', preview: 'Professional woman' },
      { id: 'eric-jKHVdOc8cV', name: 'Eric', preview: 'Professional man' },
      { id: 'maya-5GuF8uTrGz', name: 'Maya', preview: 'Young woman' },
      { id: 'david-4kHBqTqKxc', name: 'David', preview: 'Business man' }
    ];
  }
}

export const videoGenerationService = new VideoGenerationService();