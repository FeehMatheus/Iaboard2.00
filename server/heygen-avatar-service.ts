import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

interface AvatarRequest {
  text: string;
  voice?: string;
  avatar?: string;
}

interface AvatarResponse {
  success: boolean;
  videoUrl?: string;
  taskId?: string;
  status: string;
  error?: string;
  metadata?: any;
}

export class HeyGenAvatarService {
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

  async generateAvatar(request: AvatarRequest): Promise<AvatarResponse> {
    const startTime = Date.now();

    try {
      console.log('🗣️ Starting HeyGen avatar generation:', request.text);

      const response = await fetch('https://api.heygen.com/v1/video.generate', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.HEYGEN_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_inputs: [
            {
              character: {
                type: 'avatar',
                avatar_id: request.avatar || 'default'
              },
              voice: {
                type: 'text',
                input_text: request.text,
                voice_id: request.voice || 'pt-BR-FranciscaNeural'
              }
            }
          ],
          dimension: {
            width: 1280,
            height: 720
          },
          aspect_ratio: '16:9'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HeyGen API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as any;
      
      if (data.data?.video_id) {
        // Poll for completion
        const result = await this.pollForCompletion(data.data.video_id);
        
        if (result.success && result.videoUrl) {
          // Download and save video
          const localPath = await this.downloadVideo(result.videoUrl, request.text);
          
          const finalResponse: AvatarResponse = {
            success: true,
            videoUrl: localPath,
            taskId: data.data.video_id,
            status: 'completed',
            metadata: {
              text: request.text,
              voice: request.voice || 'pt-BR-FranciscaNeural',
              avatar: request.avatar || 'default',
              provider: 'HeyGen',
              generatedAt: new Date().toISOString(),
              processingTime: Date.now() - startTime
            }
          };

          this.logAvatarGeneration(request, finalResponse, Date.now() - startTime);
          return finalResponse;
        }
      }

      throw new Error('Invalid response from HeyGen');

    } catch (error) {
      console.error('❌ HeyGen avatar generation failed:', error);
      
      const errorResponse: AvatarResponse = {
        success: false,
        status: 'failed',
        error: (error as Error).message
      };

      this.logAvatarGeneration(request, errorResponse, Date.now() - startTime);
      return errorResponse;
    }
  }

  private async pollForCompletion(videoId: string, maxAttempts: number = 30): Promise<AvatarResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
          headers: {
            'X-Api-Key': process.env.HEYGEN_API_KEY
          }
        });

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data = await response.json() as any;
        
        if (data.data?.status === 'completed') {
          return {
            success: true,
            videoUrl: data.data.video_url,
            status: 'completed'
          };
        }

        if (data.data?.status === 'failed') {
          throw new Error('Video generation failed');
        }

        // Still processing
        console.log(`🔄 Avatar generation in progress... (${attempt + 1}/${maxAttempts})`);
        await this.sleep(3000);

      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await this.sleep(3000);
      }
    }

    throw new Error('Avatar generation timeout');
  }

  private async downloadVideo(url: string, text: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    const filename = `heygen_avatar_${Date.now()}.mp4`;
    const filepath = path.join(this.outputDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Avatar video saved: ${filepath} (${buffer.length} bytes)`);
    
    return `/ai-content/${filename}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logAvatarGeneration(request: AvatarRequest, response: AvatarResponse, duration: number) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      service: 'heygen',
      text: request.text,
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
      const result = await this.generateAvatar({
        text: 'Olá! Este é um teste do avatar HeyGen integrado ao IA Board.',
        voice: 'pt-BR-FranciscaNeural'
      });

      if (result.success && result.videoUrl) {
        // Verify the file exists and is accessible
        const fullPath = path.join(process.cwd(), 'public', result.videoUrl.replace('/', ''));
        const exists = fs.existsSync(fullPath);
        
        return {
          success: exists,
          message: exists ? 'HeyGen avatar generation working' : 'Avatar video file not accessible',
          videoUrl: result.videoUrl
        };
      }

      return {
        success: false,
        message: result.error || 'Avatar generation failed'
      };
    } catch (error) {
      return {
        success: false,
        message: `Health check failed: ${(error as Error).message}`
      };
    }
  }
}

export const heyGenAvatarService = new HeyGenAvatarService();