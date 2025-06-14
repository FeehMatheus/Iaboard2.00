import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

interface VideoRequest {
  prompt: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: number;
  style?: string;
}

interface VideoResponse {
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

export class InternalVideoGenerator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'generated-videos');
    this.initializeOutputDirectory();
  }

  private async initializeOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    try {
      const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `${videoId}.mp4`;
      const filePath = path.join(this.outputDir, fileName);
      
      await this.createVideoWithFFmpeg(request, filePath);
      
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
          provider: 'Internal Video Generator'
        }
      };
    } catch (error) {
      console.error('Video generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Video generation failed'
      };
    }
  }

  private async createVideoWithFFmpeg(request: VideoRequest, outputPath: string): Promise<void> {
    const { aspectRatio = '16:9', duration = 5, prompt, style = 'default' } = request;
    
    const dimensions = this.getDimensions(aspectRatio);
    const colors = this.getStyleColors(style);
    
    // Create a more engaging video with animated text and gradient background
    const ffmpegArgs = [
      '-f', 'lavfi',
      '-i', `color=c=${colors.primary}:size=${dimensions.width}x${dimensions.height}:duration=${duration}`,
      '-f', 'lavfi', 
      '-i', `color=c=${colors.secondary}:size=${dimensions.width}x${dimensions.height}:duration=${duration}`,
      '-filter_complex', 
      `[0:v][1:v]blend=all_mode=overlay:all_opacity=0.5[bg];
       [bg]drawtext=text='${this.escapeText(prompt)}':fontsize=${Math.floor(dimensions.width/25)}:fontcolor=${colors.text}:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=${colors.box}@0.7:boxborderw=10:enable='between(t,1,${duration-1})'[textoverlay];
       [textoverlay]drawtext=text='Powered by IA Board':fontsize=${Math.floor(dimensions.width/40)}:fontcolor=${colors.text}:x=w-text_w-20:y=h-text_h-20:alpha=0.8[final]`,
      '-map', '[final]',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-t', duration.toString(),
      '-y',
      outputPath
    ];

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      ffmpeg.stderr.on('data', (data) => {
        console.log(`FFmpeg: ${data}`);
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`FFmpeg error: ${error.message}`));
      });
    });
  }

  private getDimensions(aspectRatio: string) {
    switch (aspectRatio) {
      case '16:9':
        return { width: 1920, height: 1080 };
      case '9:16':
        return { width: 1080, height: 1920 };
      case '1:1':
        return { width: 1080, height: 1080 };
      default:
        return { width: 1920, height: 1080 };
    }
  }

  private getStyleColors(style: string) {
    const styleMap: Record<string, { primary: string; secondary: string; text: string; box: string }> = {
      'cinematic': { primary: '#1a1a2e', secondary: '#16213e', text: 'white', box: 'black' },
      'anime': { primary: '#ff6b6b', secondary: '#4ecdc4', text: 'white', box: 'black' },
      'realistic': { primary: '#2c3e50', secondary: '#34495e', text: 'white', box: 'black' },
      'cartoon': { primary: '#f39c12', secondary: '#e74c3c', text: 'white', box: 'black' },
      'abstract': { primary: '#667eea', secondary: '#764ba2', text: 'white', box: 'black' },
      'default': { primary: '#4a90e2', secondary: '#7b68ee', text: 'white', box: 'black' }
    };
    
    return styleMap[style] || styleMap['default'];
  }

  private escapeText(text: string): string {
    return text
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/:/g, '\\:')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\n/g, ' ')
      .substring(0, 100);
  }
}

export const internalVideoGenerator = new InternalVideoGenerator();