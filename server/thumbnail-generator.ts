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

export class ThumbnailGenerator {
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
      
      await this.createThumbnailWithFFmpeg(request, filePath);
      
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

  private async createThumbnailWithFFmpeg(request: ThumbnailRequest, outputPath: string): Promise<void> {
    const { aspectRatio = '16:9', prompt, style = 'default' } = request;
    
    const dimensions = this.getDimensions(aspectRatio);
    const colors = this.getStyleColors(style);
    const elements = this.getStyleElements(style);
    
    // Create simple gradient thumbnail with text
    const escapedPrompt = this.escapeText(prompt);
    const fontSize = Math.floor(dimensions.width/25);
    
    const ffmpegArgs = [
      '-f', 'lavfi',
      '-i', `color=c=${colors.primary}:size=${dimensions.width}x${dimensions.height}:duration=1`,
      '-vf', 
      `drawtext=text='${escapedPrompt}':fontsize=${fontSize}:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.8:boxborderw=5`,
      '-frames:v', '1',
      '-q:v', '2',
      '-y',
      outputPath
    ];

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      
      ffmpeg.stderr.on('data', (data) => {
        console.log(`Thumbnail FFmpeg: ${data}`);
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Thumbnail FFmpeg process exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`Thumbnail FFmpeg error: ${error.message}`));
      });
    });
  }

  private buildElementsFilter(elements: any, dimensions: any, colors: any): string {
    let filter = '';
    
    // Add decorative elements based on style
    if (elements.shapes) {
      filter += `drawbox=x=${dimensions.width * 0.1}:y=${dimensions.height * 0.1}:w=${dimensions.width * 0.8}:h=4:color=${colors.accent}@0.7:t=fill,`;
      filter += `drawbox=x=${dimensions.width * 0.1}:y=${dimensions.height * 0.9}:w=${dimensions.width * 0.8}:h=4:color=${colors.accent}@0.7:t=fill,`;
    }
    
    if (elements.corner_accents) {
      const cornerSize = Math.min(dimensions.width, dimensions.height) * 0.05;
      filter += `drawbox=x=20:y=20:w=${cornerSize}:h=${cornerSize}:color=${colors.accent}@0.5:t=fill,`;
      filter += `drawbox=x=${dimensions.width - cornerSize - 20}:y=${dimensions.height - cornerSize - 20}:w=${cornerSize}:h=${cornerSize}:color=${colors.accent}@0.5:t=fill,`;
    }
    
    // Remove trailing comma if present
    return filter.endsWith(',') ? filter.slice(0, -1) : filter;
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

  private getStyleColors(style: string) {
    const styleMap: Record<string, { primary: string; secondary: string; text: string; box: string; accent: string }> = {
      'cinematic': { primary: '#1a1a2e', secondary: '#16213e', text: 'white', box: 'black', accent: '#ffd700' },
      'anime': { primary: '#ff6b6b', secondary: '#4ecdc4', text: 'white', box: 'black', accent: '#ff9ff3' },
      'realistic': { primary: '#2c3e50', secondary: '#34495e', text: 'white', box: 'black', accent: '#3498db' },
      'cartoon': { primary: '#f39c12', secondary: '#e74c3c', text: 'white', box: 'black', accent: '#2ecc71' },
      'abstract': { primary: '#667eea', secondary: '#764ba2', text: 'white', box: 'black', accent: '#f093fb' },
      'default': { primary: '#4a90e2', secondary: '#7b68ee', text: 'white', box: 'black', accent: '#50c878' }
    };
    
    return styleMap[style] || styleMap['default'];
  }

  private getStyleElements(style: string) {
    const elementMap: Record<string, { shapes: boolean; corner_accents: boolean; gradient_type: string }> = {
      'cinematic': { shapes: true, corner_accents: true, gradient_type: 'dramatic' },
      'anime': { shapes: false, corner_accents: true, gradient_type: 'vibrant' },
      'realistic': { shapes: true, corner_accents: false, gradient_type: 'subtle' },
      'cartoon': { shapes: false, corner_accents: true, gradient_type: 'playful' },
      'abstract': { shapes: true, corner_accents: true, gradient_type: 'artistic' },
      'default': { shapes: true, corner_accents: false, gradient_type: 'simple' }
    };
    
    return elementMap[style] || elementMap['default'];
  }

  private escapeText(text: string): string {
    return text
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/:/g, '\\:')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\n/g, ' ')
      .substring(0, 80);
  }
}

export const thumbnailGenerator = new ThumbnailGenerator();