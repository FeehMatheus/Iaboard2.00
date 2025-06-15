interface VideoGenerationRequest {
  prompt: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: number;
  style?: 'realistic' | 'anime' | 'cartoon' | 'cinematic';
}

interface VideoGenerationResponse {
  success: boolean;
  videoUrl?: string;
  jobId?: string;
  status?: 'processing' | 'completed' | 'failed';
  error?: string;
  estimatedTime?: number;
}

export class RealVideoService {
  private stabilityApiKey: string;

  constructor() {
    this.stabilityApiKey = process.env.STABILITY_API_KEY || '';
  }

  async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    if (!this.stabilityApiKey) {
      return {
        success: false,
        error: 'Stability AI API key not configured'
      };
    }

    try {
      // Create video generation job
      const response = await fetch('https://api.stability.ai/v2alpha/generation/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.stabilityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          aspect_ratio: request.aspectRatio || '16:9',
          duration: request.duration || 5,
          cfg_scale: 7,
          motion_strength: 7,
          seed: Math.floor(Math.random() * 1000000),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Stability AI Video Error:', response.status, errorData);
        return {
          success: false,
          error: `Stability AI error: ${response.status} - ${errorData}`
        };
      }

      const data = await response.json();
      
      if (data.id) {
        // Start polling for completion
        const videoUrl = await this.pollForCompletion(data.id);
        
        if (videoUrl) {
          return {
            success: true,
            videoUrl,
            jobId: data.id,
            status: 'completed'
          };
        } else {
          return {
            success: false,
            error: 'Video generation timed out',
            jobId: data.id,
            status: 'failed'
          };
        }
      } else {
        return {
          success: false,
          error: 'No job ID returned from Stability AI'
        };
      }
    } catch (error) {
      console.error('Video generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async pollForCompletion(jobId: string, maxAttempts: number = 30): Promise<string | null> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`https://api.stability.ai/v2alpha/generation/video/result/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${this.stabilityApiKey}`,
            'Accept': 'video/*',
          },
        });

        if (response.ok) {
          // Video is ready, save it
          const videoBuffer = await response.arrayBuffer();
          const timestamp = Date.now();
          const filename = `stability_video_${timestamp}.mp4`;
          const filepath = `public/ai-content/${filename}`;
          
          // Ensure directory exists
          const fs = await import('fs');
          const path = await import('path');
          const dir = path.dirname(filepath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // Save video file
          fs.writeFileSync(filepath, Buffer.from(videoBuffer));
          
          return `/ai-content/${filename}`;
        } else if (response.status === 202) {
          // Still processing, wait and retry
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          continue;
        } else {
          console.error(`Video result error: ${response.status}`);
          return null;
        }
      } catch (error) {
        console.error('Polling error:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    return null; // Timed out
  }

  async checkVideoStatus(jobId: string): Promise<VideoGenerationResponse> {
    if (!this.stabilityApiKey) {
      return {
        success: false,
        error: 'Stability AI API key not configured'
      };
    }

    try {
      const response = await fetch(`https://api.stability.ai/v2alpha/generation/video/result/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.stabilityApiKey}`,
          'Accept': 'video/*',
        },
      });

      if (response.ok) {
        return {
          success: true,
          status: 'completed',
          jobId
        };
      } else if (response.status === 202) {
        return {
          success: true,
          status: 'processing',
          jobId,
          estimatedTime: 30 // seconds
        };
      } else {
        return {
          success: false,
          status: 'failed',
          error: `Status check failed: ${response.status}`,
          jobId
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        jobId
      };
    }
  }

  async healthCheck(): Promise<{ success: boolean; message: string }> {
    if (!this.stabilityApiKey) {
      return {
        success: false,
        message: 'Stability AI API key not configured'
      };
    }

    try {
      // Test with a simple request to check API availability
      const response = await fetch('https://api.stability.ai/v1/user/account', {
        headers: {
          'Authorization': `Bearer ${this.stabilityApiKey}`,
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Stability AI Video service operational'
        };
      } else {
        return {
          success: false,
          message: `Stability AI API error: ${response.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const realVideoService = new RealVideoService();