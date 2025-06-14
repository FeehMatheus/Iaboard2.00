interface VideoRequest {
  prompt: string;
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  duration?: number;
  fps?: number;
  motion_bucket_id?: number;
  seed?: number;
}

interface VideoResponse {
  success: boolean;
  video_url?: string;
  video_id?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  metadata?: {
    duration: number;
    resolution: string;
    fps: number;
    file_size?: number;
    processing_time?: number;
  };
  error?: string;
}

export class VideoGenerationService {
  private stabilityKey: string;
  private baseUrl = 'https://api.stability.ai/v2beta/video/generate';

  constructor() {
    this.stabilityKey = process.env.STABILITY_API_KEY || '';
  }

  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    if (!this.stabilityKey) {
      throw new Error('Stability AI API key not configured');
    }

    console.log(`🎬 Starting video generation: ${request.prompt.substring(0, 50)}...`);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stabilityKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          aspect_ratio: request.aspect_ratio || '16:9',
          duration: request.duration || 5,
          fps: request.fps || 24,
          motion_bucket_id: request.motion_bucket_id || 127,
          seed: request.seed || Math.floor(Math.random() * 1000000)
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stability AI video error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Stability AI error: ${data.error.message}`);
      }

      // Poll for completion
      const completedVideo = await this.pollVideoCompletion(data.id);
      
      return completedVideo;

    } catch (error) {
      console.error(`❌ Video generation failed:`, error);
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Stability AI authentication failed. Please check API key.');
      }
      
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Stability AI access denied. API key may be invalid or expired.');
      }
      
      if (error instanceof Error && error.message.includes('quota')) {
        throw new Error('Stability AI quota exceeded. Please upgrade your plan.');
      }
      
      throw error;
    }
  }

  private async pollVideoCompletion(videoId: string): Promise<VideoResponse> {
    const maxAttempts = 60; // 5 minutes max
    const pollInterval = 5000; // 5 seconds
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`https://api.stability.ai/v2beta/video/result/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${this.stabilityKey}`
          }
        });

        if (!response.ok) {
          throw new Error(`Poll error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'completed') {
          console.log(`✅ Video generation completed: ${videoId}`);
          
          return {
            success: true,
            video_url: data.video_url,
            video_id: videoId,
            status: 'completed',
            metadata: {
              duration: data.duration || 5,
              resolution: data.resolution || '1024x576',
              fps: data.fps || 24,
              file_size: data.file_size,
              processing_time: attempt * pollInterval
            }
          };
        }
        
        if (data.status === 'failed') {
          throw new Error(`Video generation failed: ${data.error || 'Unknown error'}`);
        }
        
        console.log(`⏳ Video processing... (${attempt + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }
    
    throw new Error('Video generation timeout after 5 minutes');
  }

  async testConnection(): Promise<{ success: boolean; credits?: number; error?: string }> {
    try {
      const testResponse = await this.generateVideo({
        prompt: 'A simple test animation of a bouncing ball',
        duration: 3,
        aspect_ratio: '1:1'
      });
      
      return {
        success: testResponse.success
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const videoGenerationService = new VideoGenerationService();