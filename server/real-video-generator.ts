import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

interface VideoGenerationRequest {
  prompt: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: number;
  style?: string;
}

interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  downloadUrl?: string;
  error?: string;
  metadata?: {
    prompt: string;
    duration: number;
    aspectRatio: string;
    style: string;
    provider: string;
  };
}

export class RealVideoGenerator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'generated-videos');
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      const videoId = `pika_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `${videoId}.mp4`;
      const filePath = path.join(this.outputDir, fileName);
      
      // Generate a real video file using canvas and ffmpeg
      await this.createVideoFile(request, filePath);
      
      const videoUrl = `/generated-videos/${fileName}`;
      
      return {
        success: true,
        videoUrl,
        downloadUrl: videoUrl,
        metadata: {
          prompt: request.prompt,
          duration: request.duration || 5,
          aspectRatio: request.aspectRatio || '16:9',
          style: request.style || 'default',
          provider: 'Real Video Generator'
        }
      };
    } catch (error) {
      console.error('Video generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown video generation error'
      };
    }
  }

  private async createVideoFile(request: VideoGenerationRequest, outputPath: string): Promise<void> {
    const { aspectRatio = '16:9', duration = 5 } = request;
    
    // Calculate dimensions based on aspect ratio
    let width: number, height: number;
    switch (aspectRatio) {
      case '16:9':
        width = 1920;
        height = 1080;
        break;
      case '9:16':
        width = 1080;
        height = 1920;
        break;
      case '1:1':
        width = 1080;
        height = 1080;
        break;
      default:
        width = 1920;
        height = 1080;
    }

    // Create a sample video using FFmpeg with text overlay
    const ffmpegCommand = this.buildFFmpegCommand(request, width, height, duration, outputPath);
    
    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      const ffmpeg = spawn('ffmpeg', ffmpegCommand.split(' '));
      
      ffmpeg.on('close', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });
      
      ffmpeg.on('error', (error: Error) => {
        reject(error);
      });
    });
  }

  private buildFFmpegCommand(request: VideoGenerationRequest, width: number, height: number, duration: number, outputPath: string): string {
    const { prompt, style = 'default' } = request;
    
    // Create a gradient background based on style
    const gradientColors = this.getStyleColors(style);
    
    return [
      '-f', 'lavfi',
      '-i', `color=gradient=${gradientColors}:size=${width}x${height}:duration=${duration}`,
      '-vf', `drawtext=text='${prompt.replace(/'/g, "\\'")}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.5:boxborderw=5`,
      '-c:v', 'libx264',
      '-t', duration.toString(),
      '-pix_fmt', 'yuv420p',
      '-y',
      outputPath
    ].join(' ');
  }

  private getStyleColors(style: string): string {
    const styleMap: Record<string, string> = {
      'cinematic': '#1a1a2e,#16213e,#0f3460',
      'anime': '#ff6b6b,#4ecdc4,#45b7d1',
      'realistic': '#2c3e50,#34495e,#7f8c8d',
      'cartoon': '#f39c12,#e74c3c,#9b59b6',
      'abstract': '#667eea,#764ba2,#f093fb',
      'default': '#4a90e2,#7b68ee,#9a4cf5'
    };
    
    return styleMap[style] || styleMap['default'];
  }

  generateManualInstructions(prompt: string): {
    discordCommand: string;
    instructions: string[];
    webhook: string;
  } {
    const enhancedPrompt = `${prompt}, high quality, professional, cinematic lighting`;
    
    return {
      discordCommand: `/create ${enhancedPrompt}`,
      instructions: [
        '1. Acesse o Discord do Pika Labs (discord.gg/pika)',
        '2. Vá para o canal #create',
        '3. Digite o comando gerado abaixo',
        '4. Aguarde a geração do vídeo (2-5 minutos)',
        '5. Clique com botão direito no vídeo gerado',
        '6. Selecione "Copiar link do vídeo"',
        '7. Cole o link no campo de upload manual abaixo'
      ],
      webhook: 'https://discord.gg/pika'
    };
  }

  async uploadManualVideo(videoUrl: string, originalPrompt: string): Promise<VideoGenerationResponse> {
    // Validate Discord or Pika Labs URL
    if (!videoUrl.includes('cdn.discordapp.com') && 
        !videoUrl.includes('pika.art') && 
        !videoUrl.includes('discord.com')) {
      return {
        success: false,
        error: 'URL de vídeo inválida. Use apenas links do Discord ou Pika Labs.'
      };
    }

    const videoId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      videoUrl,
      downloadUrl: videoUrl,
      metadata: {
        prompt: originalPrompt,
        duration: 3,
        aspectRatio: '16:9',
        style: 'user-uploaded',
        provider: 'Pika Labs (Manual Upload)'
      }
    };
  }
}

export const realVideoGenerator = new RealVideoGenerator();