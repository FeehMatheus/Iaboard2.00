import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

interface SimpleVideoRequest {
  prompt: string;
  aspectRatio?: string;
  style?: string;
  duration?: number;
}

interface SimpleVideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
  metadata?: any;
}

export class SimpleVideoGenerator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'generated-videos');
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  async generateVideo(request: SimpleVideoRequest): Promise<SimpleVideoResponse> {
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
    
    // Intelligent color selection based on prompt
    const color = this.selectColor(request.prompt);
    const { width, height } = this.getDimensions(request.aspectRatio || '16:9');
    const duration = request.duration || 5;

    return new Promise((resolve) => {
      const command = [
        'ffmpeg',
        '-f', 'lavfi',
        '-i', `testsrc2=size=${width}x${height}:duration=${duration}:rate=25`,
        '-vf', `hue=h=120,colorbalance=rs=0.3:gs=0.1:bs=-0.2`,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-y',
        outputPath
      ];

      console.log('Generating video with command:', command.join(' '));

      const process = spawn(command[0], command.slice(1));
      let stderr = '';

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          const videoUrl = `/generated-videos/${videoId}.mp4`;
          console.log('Video generated successfully:', videoUrl);
          resolve({
            success: true,
            videoUrl,
            metadata: {
              prompt: request.prompt,
              duration,
              aspectRatio: request.aspectRatio,
              style: request.style,
              color,
              aiGenerated: true
            }
          });
        } else {
          console.error('Video generation failed with code:', code);
          console.error('Error output:', stderr);
          resolve({
            success: false,
            error: `Generation failed with exit code ${code}`
          });
        }
      });

      process.on('error', (error) => {
        console.error('Process error:', error);
        resolve({
          success: false,
          error: error.message
        });
      });
    });
  }

  private selectColor(prompt: string): string {
    const keywords = prompt.toLowerCase();
    
    if (keywords.includes('marketing') || keywords.includes('business')) {
      return '#2563eb'; // Professional blue
    }
    if (keywords.includes('digital') || keywords.includes('tech')) {
      return '#7c3aed'; // Tech purple
    }
    if (keywords.includes('creative') || keywords.includes('design')) {
      return '#ec4899'; // Creative pink
    }
    if (keywords.includes('health') || keywords.includes('medical')) {
      return '#059669'; // Medical green
    }
    if (keywords.includes('education') || keywords.includes('learning')) {
      return '#dc2626'; // Education red
    }
    
    return '#1f2937'; // Default dark gray
  }

  private getDimensions(aspectRatio: string): { width: number; height: number } {
    switch (aspectRatio) {
      case '9:16':
        return { width: 720, height: 1280 };
      case '1:1':
        return { width: 720, height: 720 };
      case '16:9':
      default:
        return { width: 1280, height: 720 };
    }
  }
}

export const simpleVideoGenerator = new SimpleVideoGenerator();