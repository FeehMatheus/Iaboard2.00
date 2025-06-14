import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

interface RealVideoRequest {
  prompt: string;
  aspectRatio?: string;
  style?: string;
  duration?: number;
}

interface RealVideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
  metadata?: any;
}

export class RealVideoAPIs {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'ai-generated-videos');
    this.ensureOutputDir();
  }

  private async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  async generateVideo(request: RealVideoRequest): Promise<RealVideoResponse> {
    console.log('🎬 Generating video with real APIs:', request.prompt);

    // Try real video generation APIs in order
    const apis = [
      () => this.tryHuggingFaceVideoAPI(request),
      () => this.tryReplicateAPI(request),
      () => this.tryRunwayMLAPI(request),
      () => this.tryPikaLabsAPI(request),
      () => this.tryLeonardoAIAPI(request),
      () => this.tryStabilityVideoAPI(request)
    ];

    for (const api of apis) {
      try {
        const result = await api();
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.log(`API failed: ${(error as Error).message}`);
      }
    }

    return { success: false, error: 'All real video APIs failed' };
  }

  private async tryHuggingFaceVideoAPI(request: RealVideoRequest): Promise<RealVideoResponse> {
    console.log('🤗 Trying Hugging Face Video Generation API...');
    
    try {
      // Use Zeroscope XL model for text-to-video
      const response = await fetch('https://api-inference.huggingface.co/models/cospaia/zeroscope_v2_XL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: request.prompt,
          parameters: {
            num_frames: Math.min((request.duration || 5) * 8, 24),
            height: request.aspectRatio === '9:16' ? 1024 : 576,
            width: request.aspectRatio === '9:16' ? 576 : 1024
          }
        })
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('video')) {
          const videoBuffer = await response.buffer();
          const videoId = `hf_zeroscope_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
          const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
          
          await fs.writeFile(outputPath, videoBuffer);
          
          return {
            success: true,
            videoUrl: `/ai-generated-videos/${videoId}.mp4`,
            metadata: {
              provider: 'Hugging Face Zeroscope XL',
              prompt: request.prompt,
              authentic: true
            }
          };
        }
      }

      // Try alternative model
      const response2 = await fetch('https://api-inference.huggingface.co/models/damo-vilab/text-to-video-ms-1.7b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: request.prompt
        })
      });

      if (response2.ok) {
        const videoBuffer = await response2.buffer();
        if (videoBuffer.length > 10000) {
          const videoId = `hf_damo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
          const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
          
          await fs.writeFile(outputPath, videoBuffer);
          
          return {
            success: true,
            videoUrl: `/ai-generated-videos/${videoId}.mp4`,
            metadata: {
              provider: 'Hugging Face DAMO ViLab',
              prompt: request.prompt,
              authentic: true
            }
          };
        }
      }
    } catch (error) {
      console.log('Hugging Face API error:', (error as Error).message);
    }

    return { success: false, error: 'Hugging Face video API failed' };
  }

  private async tryReplicateAPI(request: RealVideoRequest): Promise<RealVideoResponse> {
    console.log('🔄 Trying Replicate API...');
    
    try {
      // Use Zeroscope v2 on Replicate (free tier available)
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + (process.env.REPLICATE_API_TOKEN || '')
        },
        body: JSON.stringify({
          version: "anotherjesse/zeroscope-v2-xl",
          input: {
            prompt: request.prompt,
            width: request.aspectRatio === '9:16' ? 576 : 1024,
            height: request.aspectRatio === '9:16' ? 1024 : 576,
            num_frames: 24,
            num_inference_steps: 20,
            guidance_scale: 17.5,
            model: "xl"
          }
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.id) {
          // Poll for completion
          for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
              headers: {
                'Authorization': 'Token ' + (process.env.REPLICATE_API_TOKEN || '')
              }
            });
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json() as any;
              
              if (statusData.status === 'succeeded' && statusData.output) {
                const videoUrl = await this.downloadVideo(statusData.output, 'replicate');
                
                return {
                  success: true,
                  videoUrl,
                  metadata: {
                    provider: 'Replicate Zeroscope XL',
                    prompt: request.prompt,
                    authentic: true,
                    predictionId: data.id
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
      console.log('Replicate API error:', (error as Error).message);
    }

    return { success: false, error: 'Replicate API failed' };
  }

  private async tryRunwayMLAPI(request: RealVideoRequest): Promise<RealVideoResponse> {
    console.log('🚀 Trying RunwayML API...');
    
    try {
      // RunwayML Gen-2 API
      const response = await fetch('https://api.runwayml.com/v1/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (process.env.RUNWAY_API_KEY || '')
        },
        body: JSON.stringify({
          model: 'gen2',
          prompt: request.prompt,
          duration: request.duration || 4,
          aspect_ratio: request.aspectRatio || '16:9',
          motion: 'default'
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.task_id) {
          // Poll for completion
          for (let i = 0; i < 60; i++) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const statusResponse = await fetch(`https://api.runwayml.com/v1/video/${data.task_id}`, {
              headers: {
                'Authorization': 'Bearer ' + (process.env.RUNWAY_API_KEY || '')
              }
            });
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json() as any;
              
              if (statusData.status === 'completed' && statusData.video_url) {
                const videoUrl = await this.downloadVideo(statusData.video_url, 'runway');
                
                return {
                  success: true,
                  videoUrl,
                  metadata: {
                    provider: 'RunwayML Gen-2',
                    prompt: request.prompt,
                    authentic: true,
                    taskId: data.task_id
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
      console.log('RunwayML API error:', (error as Error).message);
    }

    return { success: false, error: 'RunwayML API failed' };
  }

  private async tryPikaLabsAPI(request: RealVideoRequest): Promise<RealVideoResponse> {
    console.log('⚡ Trying Pika Labs API...');
    
    try {
      // Pika Labs API
      const response = await fetch('https://api.pika.art/v1/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (process.env.PIKA_API_KEY || '')
        },
        body: JSON.stringify({
          prompt: request.prompt,
          aspectRatio: request.aspectRatio || '16:9',
          motion: 1,
          seed: Math.floor(Math.random() * 1000000)
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.id) {
          // Poll for completion
          for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 4000));
            
            const statusResponse = await fetch(`https://api.pika.art/v1/videos/${data.id}`, {
              headers: {
                'Authorization': 'Bearer ' + (process.env.PIKA_API_KEY || '')
              }
            });
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json() as any;
              
              if (statusData.status === 'completed' && statusData.result_url) {
                const videoUrl = await this.downloadVideo(statusData.result_url, 'pika');
                
                return {
                  success: true,
                  videoUrl,
                  metadata: {
                    provider: 'Pika Labs',
                    prompt: request.prompt,
                    authentic: true,
                    videoId: data.id
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
      console.log('Pika Labs API error:', (error as Error).message);
    }

    return { success: false, error: 'Pika Labs API failed' };
  }

  private async tryLeonardoAIAPI(request: RealVideoRequest): Promise<RealVideoResponse> {
    console.log('🎨 Trying Leonardo AI API...');
    
    try {
      // Leonardo AI Motion API
      const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations-motion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (process.env.LEONARDO_API_KEY || '')
        },
        body: JSON.stringify({
          prompt: request.prompt,
          modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628', // Leonardo Vision XL
          width: request.aspectRatio === '9:16' ? 576 : 1024,
          height: request.aspectRatio === '9:16' ? 1024 : 576,
          motionStrength: 5
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.sdGenerationJob && data.sdGenerationJob.generationId) {
          const generationId = data.sdGenerationJob.generationId;
          
          // Poll for completion
          for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            const statusResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
              headers: {
                'Authorization': 'Bearer ' + (process.env.LEONARDO_API_KEY || '')
              }
            });
            
            if (statusResponse.ok) {
              const statusData = await statusResponse.json() as any;
              
              if (statusData.generations_by_pk && statusData.generations_by_pk.status === 'COMPLETE') {
                const motionVideos = statusData.generations_by_pk.generated_images.filter((img: any) => img.motionMP4URL);
                
                if (motionVideos.length > 0) {
                  const videoUrl = await this.downloadVideo(motionVideos[0].motionMP4URL, 'leonardo');
                  
                  return {
                    success: true,
                    videoUrl,
                    metadata: {
                      provider: 'Leonardo AI Motion',
                      prompt: request.prompt,
                      authentic: true,
                      generationId
                    }
                  };
                }
              }
              
              if (statusData.generations_by_pk && statusData.generations_by_pk.status === 'FAILED') {
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('Leonardo AI API error:', (error as Error).message);
    }

    return { success: false, error: 'Leonardo AI API failed' };
  }

  private async tryStabilityVideoAPI(request: RealVideoRequest): Promise<RealVideoResponse> {
    console.log('🎯 Trying Stability AI Video API...');
    
    try {
      // Stability AI Stable Video Diffusion
      const response = await fetch('https://api.stability.ai/v2beta/image-to-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (process.env.STABILITY_API_KEY || '')
        },
        body: JSON.stringify({
          image: await this.generateImageForVideo(request.prompt),
          seed: Math.floor(Math.random() * 1000000),
          cfg_scale: 1.8,
          motion_bucket_id: 127
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        
        if (data.video) {
          const videoBuffer = Buffer.from(data.video, 'base64');
          const videoId = `stability_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
          const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
          
          await fs.writeFile(outputPath, videoBuffer);
          
          return {
            success: true,
            videoUrl: `/ai-generated-videos/${videoId}.mp4`,
            metadata: {
              provider: 'Stability AI Video',
              prompt: request.prompt,
              authentic: true
            }
          };
        }
      }
    } catch (error) {
      console.log('Stability AI API error:', (error as Error).message);
    }

    return { success: false, error: 'Stability AI Video API failed' };
  }

  private async downloadVideo(url: string, provider: string): Promise<string> {
    const videoId = `${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
    
    const response = await fetch(url);
    const buffer = await response.buffer();
    await fs.writeFile(outputPath, buffer);
    
    return `/ai-generated-videos/${videoId}.mp4`;
  }

  private async generateImageForVideo(prompt: string): Promise<string> {
    try {
      // Generate image first for image-to-video
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (process.env.STABILITY_API_KEY || '')
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        if (data.artifacts && data.artifacts[0]) {
          return data.artifacts[0].base64;
        }
      }
    } catch (error) {
      console.log('Image generation for video failed:', (error as Error).message);
    }

    // Fallback: return placeholder base64 image
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  }
}

export const realVideoAPIs = new RealVideoAPIs();