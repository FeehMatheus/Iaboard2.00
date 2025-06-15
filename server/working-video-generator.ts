import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execAsync = promisify(exec);

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Generate real video using HuggingFace Diffusion Models
const generateVideoWithHuggingFace = async (prompt: string, duration: number) => {
  try {
    console.log('[HF-VIDEO] Starting generation with prompt:', prompt);
    
    // Use Zeroscope for video generation
    const response = await fetch('https://api-inference.huggingface.co/models/cerspense/zeroscope_v2_576w', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_frames: Math.min(duration * 8, 24), // 8 fps max 24 frames
          height: 320,
          width: 576,
          num_inference_steps: 25
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[HF-VIDEO] API Error:', errorText);
      
      // If model is loading, wait and retry
      if (response.status === 503 || errorText.includes('loading')) {
        console.log('[HF-VIDEO] Model loading, waiting 20 seconds...');
        await new Promise(resolve => setTimeout(resolve, 20000));
        
        // Retry request
        const retryResponse = await fetch('https://api-inference.huggingface.co/models/cerspense/zeroscope_v2_576w', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              num_frames: Math.min(duration * 8, 24),
              height: 320,
              width: 576,
              num_inference_steps: 25
            }
          }),
        });
        
        if (retryResponse.ok) {
          const videoBuffer = await retryResponse.arrayBuffer();
          return Buffer.from(videoBuffer);
        }
      }
      
      throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
    }

    const videoBuffer = await response.arrayBuffer();
    console.log('[HF-VIDEO] Generated video buffer size:', videoBuffer.byteLength);
    
    return Buffer.from(videoBuffer);
  } catch (error: any) {
    console.error('[HF-VIDEO] Error:', error.message);
    throw error;
  }
};

// Generate video using text-to-image + animation
const generateAnimatedVideo = async (prompt: string, duration: number) => {
  try {
    console.log('[ANIMATED-VIDEO] Creating animated video from text...');
    
    // First generate an image with DALL-E style model
    const imageResponse = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt + ", cinematic, high quality, detailed, 4k",
        parameters: {
          width: 512,
          height: 512,
          num_inference_steps: 30
        }
      }),
    });

    if (!imageResponse.ok) {
      throw new Error(`Image generation failed: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const timestamp = Date.now();
    const imagePath = path.join(downloadsDir, `temp_image_${timestamp}.png`);
    const videoPath = path.join(downloadsDir, `animated_video_${timestamp}.mp4`);
    
    // Save the generated image
    fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
    
    // Create animated video using FFmpeg with zoom and pan effects
    const ffmpegCommand = `ffmpeg -loop 1 -i "${imagePath}" -filter_complex "[0:v]scale=1280:720,zoompan=z='min(zoom+0.0015,1.5)':d=25*${duration}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',format=yuv420p" -t ${duration} -r 25 "${videoPath}"`;
    
    await execAsync(ffmpegCommand);
    
    // Clean up temp image
    fs.unlinkSync(imagePath);
    
    if (fs.existsSync(videoPath)) {
      console.log('[ANIMATED-VIDEO] Video created successfully');
      return fs.readFileSync(videoPath);
    } else {
      throw new Error('Video file was not created');
    }
  } catch (error: any) {
    console.error('[ANIMATED-VIDEO] Error:', error.message);
    throw error;
  }
};

// Main video generation endpoint
router.post('/api/working-video/generate', async (req, res) => {
  try {
    const { prompt, duration = 3, style = 'realistic' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt é obrigatório para geração de vídeo'
      });
    }

    const startTime = Date.now();
    let videoBuffer = null;
    let provider = '';
    let errors = [];

    // Try HuggingFace video generation first
    if (process.env.HUGGINGFACE_API_KEY && !videoBuffer) {
      try {
        console.log('[WORKING-VIDEO] Trying HuggingFace video generation...');
        videoBuffer = await generateVideoWithHuggingFace(prompt, duration);
        provider = 'HuggingFace Zeroscope';
      } catch (error: any) {
        console.log('[WORKING-VIDEO] HuggingFace failed:', error.message);
        errors.push(`HuggingFace: ${error.message}`);
      }
    }

    // Try animated video generation as fallback
    if (!videoBuffer && process.env.HUGGINGFACE_API_KEY) {
      try {
        console.log('[WORKING-VIDEO] Trying animated video generation...');
        videoBuffer = await generateAnimatedVideo(prompt, duration);
        provider = 'Animated Video (Stable Diffusion + FFmpeg)';
      } catch (error: any) {
        console.log('[WORKING-VIDEO] Animated video failed:', error.message);
        errors.push(`Animated: ${error.message}`);
      }
    }

    if (!videoBuffer) {
      return res.status(500).json({
        success: false,
        error: 'Falha na geração de vídeo real',
        errors,
        suggestion: 'Verifique se a HUGGINGFACE_API_KEY está configurada corretamente'
      });
    }

    // Save the video file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `video-real-${timestamp}.mp4`;
    const filePath = path.join(downloadsDir, filename);
    
    fs.writeFileSync(filePath, videoBuffer);

    const processingTime = Date.now() - startTime;
    const fileStats = fs.statSync(filePath);

    res.json({
      success: true,
      video: {
        url: `/downloads/${filename}`,
        localPath: filePath,
        provider: provider,
        duration: duration,
        format: 'mp4',
        prompt: prompt,
        style: style
      },
      file: {
        filename,
        path: `/downloads/${filename}`,
        size: fileStats.size,
        type: 'video'
      },
      processingTime,
      isRealVideo: true,
      message: `✅ Vídeo real gerado com ${provider} em ${Math.round(processingTime/1000)}s`
    });

  } catch (error: any) {
    console.error('[WORKING-VIDEO] Erro geral:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração de vídeo',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Status endpoint
router.get('/api/working-video/status', (req, res) => {
  const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY;
  const hasFFmpeg = true; // Assume FFmpeg is available in the environment
  
  res.json({
    success: true,
    providers: [
      {
        name: 'HuggingFace Zeroscope',
        available: hasHuggingFace,
        status: hasHuggingFace ? 'ready' : 'missing_key',
        type: 'AI Video Generation'
      },
      {
        name: 'Animated Video (SD + FFmpeg)',
        available: hasHuggingFace && hasFFmpeg,
        status: hasHuggingFace ? 'ready' : 'missing_key',
        type: 'Text-to-Image + Animation'
      }
    ],
    canGenerateVideo: hasHuggingFace,
    recommendation: hasHuggingFace ? 
      'Sistema pronto para gerar vídeos reais' : 
      'Configure HUGGINGFACE_API_KEY para gerar vídeos reais'
  });
});

export default router;