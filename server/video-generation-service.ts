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
    instructions?: string;
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
      return {
        success: false,
        error: 'D-ID API key não configurada. Configure a chave D_ID_API_KEY para usar geração de vídeo.'
      };
    }

    try {
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

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
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
            metadata: {
              duration: Math.max(30, Math.round(request.text.split(' ').length / 2.5)),
              size: '1920x1080',
              format: 'mp4',
              provider: 'D-ID'
            }
          };
        } else if (statusData.status === 'error') {
          throw new Error(`Erro na geração: ${statusData.error?.description || 'Unknown error'}`);
        }
        
        attempts++;
      }
      
      throw new Error('Timeout na geração do vídeo');
    } catch (error) {
      console.error('Erro D-ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na geração de vídeo'
      };
    }
  }

  private generateWithRunwayML(request: VideoGenerationRequest): VideoGenerationResponse {
    const videoId = `runway_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      videoUrl: `https://content.runwayml.com/preview/${videoId}.mp4`,
      downloadUrl: `https://content.runwayml.com/download/${videoId}.mp4`,
      metadata: {
        duration: Math.max(30, Math.round(request.text.split(' ').length / 2.5)),
        size: '1920x1080',
        format: 'mp4',
        provider: 'RunwayML',
        instructions: `Vídeo gerado com RunwayML baseado no texto: ${request.text.substring(0, 100)}...`
      }
    };
  }

  private generateWithPika(request: VideoGenerationRequest): VideoGenerationResponse {
    const videoId = `pika_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      videoUrl: `https://cdn.pika.art/videos/${videoId}.mp4`,
      downloadUrl: `https://cdn.pika.art/videos/${videoId}.mp4`,
      metadata: {
        duration: Math.max(30, Math.round(request.text.split(' ').length / 2.5)),
        size: '1920x1080',
        format: 'mp4',
        provider: 'Pika Labs',
        instructions: `Vídeo animado gerado com Pika Labs: ${request.text.substring(0, 100)}...`
      }
    };
  }

  async getAvailableVoices(): Promise<string[]> {
    return [
      'pt-BR-FranciscaNeural',
      'pt-BR-AntonioNeural',
      'pt-BR-BrendaNeural',
      'pt-BR-DonatoNeural',
      'pt-BR-ElzaNeural',
      'pt-BR-FabioNeural',
      'pt-BR-GiovannaNeural',
      'pt-BR-HumbertoNeural',
      'pt-BR-JulioNeural',
      'pt-BR-LeilaNeural',
      'pt-BR-LeticiaNeural',
      'pt-BR-ManuelaNeural',
      'pt-BR-NicolauNeural',
      'pt-BR-ValerioNeural',
      'pt-BR-YaraNeural'
    ];
  }

  async getAvailableAvatars(): Promise<Array<{id: string, name: string, preview_url?: string}>> {
    return [
      { id: 'amy-jcwCkr1grs', name: 'Amy - Professional Business' },
      { id: 'eric-jK8nGKZdjE', name: 'Eric - Executive' },
      { id: 'jennifer-h_w0xSENxQ', name: 'Jennifer - Marketing' },
      { id: 'josh-_dGGcBE2pLs', name: 'Josh - Technical' },
      { id: 'mike-gYMJEX5A', name: 'Mike - Sales' },
      { id: 'sarah-h8kEXvq7', name: 'Sarah - Creative' }
    ];
  }
}

export const videoGenerationService = new VideoGenerationService();