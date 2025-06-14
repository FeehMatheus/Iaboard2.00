import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

interface ThumbnailRequest {
  prompt: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: string;
}

interface ThumbnailResponse {
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
}

export class SimpleThumbnailGenerator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'thumbnails');
    this.initializeOutputDirectory();
  }

  private async initializeOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create thumbnail directory:', error);
    }
  }

  async generateThumbnail(request: ThumbnailRequest): Promise<ThumbnailResponse> {
    try {
      const thumbnailId = `thumb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `${thumbnailId}.jpg`;
      const filePath = path.join(this.outputDir, fileName);
      
      await this.createSimpleThumbnail(request, filePath);
      
      const thumbnailUrl = `/thumbnails/${fileName}`;
      
      return {
        success: true,
        thumbnailUrl
      };
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Thumbnail generation failed'
      };
    }
  }

  private async createSimpleThumbnail(request: ThumbnailRequest, outputPath: string): Promise<void> {
    const { aspectRatio = '16:9', style = 'default' } = request;
    
    const dimensions = this.getDimensions(aspectRatio);
    const color = this.getStyleColor(style);
    
    // Create a simple colored thumbnail
    const ffmpegArgs = [
      '-f', 'lavfi',
      '-i', `color=c=${color}:size=${dimensions.width}x${dimensions.height}:duration=0.1`,
      '-frames:v', '1',
      '-q:v', '2',
      '-y',
      outputPath
    ];

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      let stderr = '';
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error('FFmpeg stderr:', stderr);
          reject(new Error(`Simple thumbnail FFmpeg process exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`Simple thumbnail FFmpeg error: ${error.message}`));
      });
    });
  }

  private getDimensions(aspectRatio: string) {
    switch (aspectRatio) {
      case '16:9':
        return { width: 640, height: 360 };
      case '9:16':
        return { width: 360, height: 640 };
      case '1:1':
        return { width: 480, height: 480 };
      default:
        return { width: 640, height: 360 };
    }
  }

  private getStyleColor(style: string): string {
    const colorMap: Record<string, string> = {
      'cinematic': '#1a1a2e',
      'anime': '#ff6b6b',
      'realistic': '#2c3e50',
      'cartoon': '#f39c12',
      'abstract': '#667eea',
      'default': '#4a90e2'
    };
    
    return colorMap[style] || colorMap['default'];
  }
}

export const simpleThumbnailGenerator = new SimpleThumbnailGenerator();