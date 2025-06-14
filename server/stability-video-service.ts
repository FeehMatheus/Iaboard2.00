import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface VideoRequest {
  prompt: string;
  seed?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

interface VideoResponse {
  success: boolean;
  videoUrl?: string;
  taskId?: string;
  status: string;
  error?: string;
  metadata?: any;
}

export class StabilityVideoService {
  private outputDir: string;
  private logPath: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'ai-content');
    this.logPath = path.join(process.cwd(), 'logs', 'video.log');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    if (!fs.existsSync(path.dirname(this.logPath))) {
      fs.mkdirSync(path.dirname(this.logPath), { recursive: true });
    }
  }

  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    const startTime = Date.now();

    try {
      console.log('🎬 Starting Stability AI video generation:', request.prompt);

      const response = await fetch('https://api.stability.ai/v2beta/image-to-video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: await this.generateBaseImage(request.prompt),
          seed: request.seed || Math.floor(Math.random() * 1000000),
          cfg_scale: 1.8,
          motion_bucket_id: 127
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stability API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.id) {
        // Poll for completion
        const result = await this.pollForCompletion(data.id);
        
        if (result.success && result.videoUrl) {
          // Download and save video
          const localPath = await this.downloadVideo(result.videoUrl, request.prompt);
          
          const finalResponse: VideoResponse = {
            success: true,
            videoUrl: localPath,
            taskId: data.id,
            status: 'completed',
            metadata: {
              prompt: request.prompt,
              seed: request.seed,
              duration: '4s',
              resolution: '1024x576',
              provider: 'Stability AI',
              generatedAt: new Date().toISOString(),
              processingTime: Date.now() - startTime
            }
          };

          this.logVideoGeneration(request, finalResponse, Date.now() - startTime);
          return finalResponse;
        }
      }

      throw new Error('Invalid response from Stability AI');

    } catch (error) {
      console.error('❌ Stability video generation failed:', error);
      
      const errorResponse: VideoResponse = {
        success: false,
        status: 'failed',
        error: error.message
      };

      this.logVideoGeneration(request, errorResponse, Date.now() - startTime);
      return errorResponse;
    }
  }

  private async generateBaseImage(prompt: string): Promise<string> {
    // Generate a base image for video generation
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 576,
        width: 1024,
        samples: 1,
        steps: 30
      })
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.artifacts[0].base64;
  }

  private async pollForCompletion(taskId: string, maxAttempts: number = 30): Promise<VideoResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`https://api.stability.ai/v2beta/image-to-video/result/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
            'Accept': 'video/*'
          }
        });

        if (response.status === 202) {
          // Still processing
          console.log(`🔄 Video generation in progress... (${attempt + 1}/${maxAttempts})`);
          await this.sleep(2000);
          continue;
        }

        if (response.ok) {
          // Get the video URL from response headers or body
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('video')) {
            // Save the video data
            const buffer = await response.buffer();
            const filename = `stability_video_${taskId}.mp4`;
            const filepath = path.join(this.outputDir, filename);
            fs.writeFileSync(filepath, buffer);
            
            return {
              success: true,
              videoUrl: `/ai-content/${filename}`,
              status: 'completed'
            };
          }
        }

        throw new Error(`Unexpected response: ${response.status}`);

      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await this.sleep(2000);
      }
    }

    throw new Error('Video generation timeout');
  }

  private async downloadVideo(url: string, prompt: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    const filename = `stability_${Date.now()}.mp4`;
    const filepath = path.join(this.outputDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Video saved: ${filepath} (${buffer.length} bytes)`);
    
    return `/ai-content/${filename}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logVideoGeneration(request: VideoRequest, response: VideoResponse, duration: number) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      service: 'stability',
      prompt: request.prompt,
      success: response.success,
      duration: duration,
      status: response.status,
      error: response.error,
      videoUrl: response.videoUrl
    };

    fs.appendFileSync(this.logPath, JSON.stringify(logEntry) + '\n');
  }

  async healthCheck(): Promise<{ success: boolean; message: string; videoUrl?: string }> {
    try {
      const result = await this.generateVideo({
        prompt: 'Cinematic drone shot of neo-tokyo at sunset, 4k',
        seed: 42
      });

      if (result.success && result.videoUrl) {
        // Verify the file exists and is accessible
        const fullPath = path.join(process.cwd(), 'public', result.videoUrl.replace('/', ''));
        const exists = fs.existsSync(fullPath);
        
        return {
          success: exists,
          message: exists ? 'Stability video generation working' : 'Video file not accessible',
          videoUrl: result.videoUrl
        };
      }

      return {
        success: false,
        message: result.error || 'Video generation failed'
      };
    } catch (error) {
      return {
        success: false,
        message: `Health check failed: ${error.message}`
      };
    }
  }
}

export const stabilityVideoService = new StabilityVideoService();