import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { tokenManager } from './token-manager';

interface VideoRequest {
  prompt: string;
  aspectRatio?: string;
  style?: string;
  duration?: number;
}

interface VideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
  metadata?: any;
}

export class FreeRealVideoAPIs {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'real-ai-videos');
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  async generateVideo(request: VideoRequest): Promise<VideoResponse> {
    console.log('🎬 Using FREE REAL AI Video APIs:', request.prompt);

    // Check available services with tokens
    const availableServices = tokenManager.getAvailableServices();
    console.log('Available services:', availableServices);

    if (availableServices.length === 0) {
      console.log('⏰ All services have reached their token limit, will reset hourly');
      return { 
        success: false, 
        error: 'All services have reached token limits. Services reset hourly.',
        metadata: { tokenStatus: tokenManager.getAllServiceStatus() }
      };
    }

    // Try services that have available tokens
    const serviceMap: Record<string, () => Promise<VideoResponse>> = {
      'huggingface': () => this.tryHuggingFaceFree(request),
      'replicate': () => this.tryReplicateFree(request),
      'gradio': () => this.tryGoogleColabFree(request),
      'fal': () => this.tryFalAIFree(request)
    };

    for (const service of availableServices) {
      if (serviceMap[service] && tokenManager.canUseService(service)) {
        try {
          console.log(`🔄 Trying ${service} (tokens available)`);
          tokenManager.useToken(service);
          
          const result = await serviceMap[service]();
          if (result.success) {
            result.metadata = {
              ...result.metadata,
              tokensUsed: true,
              serviceUsed: service
            };
            return result;
          }
        } catch (error) {
          console.log(`${service} failed: ${(error as Error).message}`);
        }
      }
    }

    return { 
      success: false, 
      error: 'All available services failed to generate video',
      metadata: { tokenStatus: tokenManager.getAllServiceStatus() }
    };
  }

  private async tryHuggingFaceFree(request: VideoRequest): Promise<VideoResponse> {
    console.log('🤗 Trying Hugging Face FREE APIs...');
    
    const models = [
      'ali-vilab/text-to-video-ms-1.7b',
      'damo-vilab/text-to-video-ms-1.7b',
      'cerspense/zeroscope_v2_576w',
      'cerspense/zeroscope_v2_xl'
    ];

    for (const model of models) {
      try {
        console.log(`Testing model: ${model}`);
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: request.prompt,
            parameters: {
              num_frames: 16,
              height: request.aspectRatio === '9:16' ? 1024 : 512,
              width: request.aspectRatio === '9:16' ? 512 : 1024
            }
          })
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('video') || contentType.includes('application/octet-stream')) {
            const videoBuffer = await response.buffer();
            
            if (videoBuffer.length > 10000) {
              const videoId = `hf_${model.split('/')[1]}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
              const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
              
              await fs.writeFile(outputPath, videoBuffer);
              
              return {
                success: true,
                videoUrl: `/real-ai-videos/${videoId}.mp4`,
                metadata: {
                  provider: `Hugging Face - ${model}`,
                  prompt: request.prompt,
                  authentic: true,
                  free: true
                }
              };
            }
          }
        }
        
        // Check for JSON response with video URL
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.video_url || data.output) {
            const videoUrl = await this.downloadVideo(data.video_url || data.output, 'huggingface');
            return {
              success: true,
              videoUrl,
              metadata: {
                provider: `Hugging Face - ${model}`,
                prompt: request.prompt,
                authentic: true,
                free: true
              }
            };
          }
        } catch (e) {
          // Not JSON, continue
        }
        
      } catch (error) {
        console.log(`Model ${model} failed:`, (error as Error).message);
      }
    }

    return { success: false, error: 'Hugging Face free APIs failed' };
  }

  private async tryReplicateFree(request: VideoRequest): Promise<VideoResponse> {
    console.log('🔄 Trying Replicate FREE tier...');
    
    try {
      // Use free tier models
      const freeModels = [
        'anotherjesse/zeroscope-v2-xl',
        'cjwbw/damo-text-to-video',
        'lucataco/animate-diff'
      ];

      for (const model of freeModels) {
        try {
          console.log(`Testing Replicate model: ${model}`);
          
          // Try without API key first (some models are public)
          const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              version: model,
              input: {
                prompt: request.prompt,
                num_frames: 16,
                width: request.aspectRatio === '9:16' ? 576 : 1024,
                height: request.aspectRatio === '9:16' ? 1024 : 576
              }
            })
          });

          if (response.ok) {
            const data = await response.json() as any;
            
            if (data.id) {
              // Poll for completion
              for (let i = 0; i < 20; i++) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`);
                
                if (statusResponse.ok) {
                  const statusData = await statusResponse.json() as any;
                  
                  if (statusData.status === 'succeeded' && statusData.output) {
                    const videoUrl = await this.downloadVideo(statusData.output, 'replicate');
                    
                    return {
                      success: true,
                      videoUrl,
                      metadata: {
                        provider: `Replicate Free - ${model}`,
                        prompt: request.prompt,
                        authentic: true,
                        free: true
                      }
                    };
                  }
                  
                  if (statusData.status === 'failed') {
                    break;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.log(`Replicate model ${model} failed:`, (error as Error).message);
        }
      }
    } catch (error) {
      console.log('Replicate free tier error:', (error as Error).message);
    }

    return { success: false, error: 'Replicate free tier failed' };
  }

  private async tryGoogleColabFree(request: VideoRequest): Promise<VideoResponse> {
    console.log('🔬 Trying Google Colab free endpoints...');
    
    try {
      // Try public Colab endpoints
      const colabEndpoints = [
        'https://api.ngrok.io/endpoints',
        'https://gradio.live',
        'https://huggingface.co/spaces'
      ];

      // Try Text2Video-Zero via Gradio
      const gradioResponse = await fetch('https://text2video-zero.hf.space/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [
            request.prompt,
            16, // num_frames
            512, // height
            512, // width
            0.75, // guidance_scale
            42 // seed
          ]
        })
      });

      if (gradioResponse.ok) {
        const data = await gradioResponse.json() as any;
        
        if (data.data && data.data[0]) {
          const videoUrl = await this.downloadVideo(data.data[0], 'text2video-zero');
          
          return {
            success: true,
            videoUrl,
            metadata: {
              provider: 'Text2Video-Zero (Gradio)',
              prompt: request.prompt,
              authentic: true,
              free: true
            }
          };
        }
      }

    } catch (error) {
      console.log('Google Colab free endpoints error:', (error as Error).message);
    }

    return { success: false, error: 'Google Colab free endpoints failed' };
  }

  private async tryFalAIFree(request: VideoRequest): Promise<VideoResponse> {
    console.log('⚡ Trying Fal.ai FREE tier...');
    
    try {
      // Fal.ai has free tier for some models
      const response = await fetch('https://fal.run/fal-ai/text-to-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          video_length: 16,
          fps: 8
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.video && data.video.url) {
          const videoUrl = await this.downloadVideo(data.video.url, 'fal-ai');
          
          return {
            success: true,
            videoUrl,
            metadata: {
              provider: 'Fal.ai Free Tier',
              prompt: request.prompt,
              authentic: true,
              free: true
            }
          };
        }
      }

    } catch (error) {
      console.log('Fal.ai free tier error:', (error as Error).message);
    }

    return { success: false, error: 'Fal.ai free tier failed' };
  }

  private async tryVideoLabs(request: VideoRequest): Promise<VideoResponse> {
    console.log('🎥 Trying VideoCrafter and other free labs...');
    
    try {
      // Try VideoCrafter via public endpoint
      const response = await fetch('https://videocrafter.github.io/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: request.prompt,
          num_frames: 16,
          height: 512,
          width: 512
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.video_path) {
          const videoUrl = await this.downloadVideo(data.video_path, 'videocrafter');
          
          return {
            success: true,
            videoUrl,
            metadata: {
              provider: 'VideoCrafter Free',
              prompt: request.prompt,
              authentic: true,
              free: true
            }
          };
        }
      }

    } catch (error) {
      console.log('Video labs error:', (error as Error).message);
    }

    return { success: false, error: 'Video labs failed' };
  }

  private async tryMidjourneyVideo(request: VideoRequest): Promise<VideoResponse> {
    console.log('🎨 Trying free Midjourney-style video generators...');
    
    try {
      // Try free alternatives to Midjourney for video
      const response = await fetch('https://api.runpod.ai/v2/vqgan-clip/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {
            prompts: [request.prompt],
            max_frames: 16,
            width: 512,
            height: 512
          }
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.output && data.output.video_url) {
          const videoUrl = await this.downloadVideo(data.output.video_url, 'runpod');
          
          return {
            success: true,
            videoUrl,
            metadata: {
              provider: 'RunPod VQGAN-CLIP',
              prompt: request.prompt,
              authentic: true,
              free: true
            }
          };
        }
      }

    } catch (error) {
      console.log('Midjourney-style video error:', (error as Error).message);
    }

    return { success: false, error: 'Free video generators failed' };
  }

  private async downloadVideo(url: string, provider: string): Promise<string> {
    try {
      const videoId = `${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const buffer = await response.buffer();
      await fs.writeFile(outputPath, buffer);
      
      return `/real-ai-videos/${videoId}.mp4`;
    } catch (error) {
      console.log('Video download error:', (error as Error).message);
      throw error;
    }
  }
}

export const freeRealVideoAPIs = new FreeRealVideoAPIs();