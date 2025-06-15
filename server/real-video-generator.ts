import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  style?: string;
  aspect_ratio?: string;
}

interface VideoResult {
  url: string;
  provider: string;
  format: 'mp4' | 'webm';
  size: number;
  duration: number;
  status: 'completed' | 'processing' | 'failed';
}

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Runway ML API integration
const generateWithRunway = async (prompt: string, duration: number = 4): Promise<VideoResult> => {
  console.log('[RUNWAY] Starting video generation...');
  
  try {
    // Step 1: Create generation task
    const taskResponse = await fetch('https://api.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptText: prompt,
        seed: Math.floor(Math.random() * 1000000),
        watermark: false,
        duration: duration,
        ratio: "16:9"
      }),
    });

    if (!taskResponse.ok) {
      const errorText = await taskResponse.text();
      throw new Error(`Runway API error: ${taskResponse.status} - ${errorText}`);
    }

    const taskData = await taskResponse.json();
    const taskId = taskData.id;

    console.log(`[RUNWAY] Task created: ${taskId}`);

    // Step 2: Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes timeout

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

      const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log(`[RUNWAY] Status: ${statusData.status}`);

        if (statusData.status === 'SUCCEEDED' && statusData.output) {
          // Download the video
          const videoResponse = await fetch(statusData.output[0]);
          if (videoResponse.ok) {
            const videoBuffer = await videoResponse.arrayBuffer();
            const buffer = Buffer.from(videoBuffer);
            
            const timestamp = Date.now();
            const filename = `runway-video-${timestamp}.mp4`;
            const filePath = path.join(downloadsDir, filename);
            
            fs.writeFileSync(filePath, buffer);
            
            return {
              url: `/downloads/${filename}`,
              provider: 'Runway ML',
              format: 'mp4',
              size: buffer.byteLength,
              duration: duration,
              status: 'completed'
            };
          }
        } else if (statusData.status === 'FAILED') {
          throw new Error('Runway generation failed');
        }
      }

      attempts++;
    }

    throw new Error('Runway generation timeout');
  } catch (error: any) {
    console.error('[RUNWAY] Error:', error.message);
    throw error;
  }
};

// Luma AI integration
const generateWithLuma = async (prompt: string, duration: number = 4): Promise<VideoResult> => {
  console.log('[LUMA] Starting video generation...');
  
  try {
    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: "16:9",
        loop: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Luma API error: ${response.status} - ${errorText}`);
    }

    const taskData = await response.json();
    const generationId = taskData.id;

    console.log(`[LUMA] Generation started: ${generationId}`);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log(`[LUMA] Status: ${statusData.state}`);

        if (statusData.state === 'completed' && statusData.assets?.video) {
          const videoResponse = await fetch(statusData.assets.video);
          if (videoResponse.ok) {
            const videoBuffer = await videoResponse.arrayBuffer();
            const buffer = Buffer.from(videoBuffer);
            
            const timestamp = Date.now();
            const filename = `luma-video-${timestamp}.mp4`;
            const filePath = path.join(downloadsDir, filename);
            
            fs.writeFileSync(filePath, buffer);
            
            return {
              url: `/downloads/${filename}`,
              provider: 'Luma AI',
              format: 'mp4',
              size: buffer.byteLength,
              duration: duration,
              status: 'completed'
            };
          }
        } else if (statusData.state === 'failed') {
          throw new Error('Luma generation failed');
        }
      }

      attempts++;
    }

    throw new Error('Luma generation timeout');
  } catch (error: any) {
    console.error('[LUMA] Error:', error.message);
    throw error;
  }
};

// Pika Labs integration
const generateWithPika = async (prompt: string, duration: number = 4): Promise<VideoResult> => {
  console.log('[PIKA] Starting video generation...');
  
  try {
    const response = await fetch('https://api.pika.art/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PIKA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: duration,
        aspect_ratio: "16:9",
        motion: 2,
        guidance_scale: 12,
        negative_prompt: "blurry, low quality, distorted"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pika API error: ${response.status} - ${errorText}`);
    }

    const taskData = await response.json();
    const jobId = taskData.job_id;

    console.log(`[PIKA] Job started: ${jobId}`);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await fetch(`https://api.pika.art/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PIKA_API_KEY}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log(`[PIKA] Status: ${statusData.status}`);

        if (statusData.status === 'completed' && statusData.result?.videos?.[0]) {
          const videoUrl = statusData.result.videos[0];
          const videoResponse = await fetch(videoUrl);
          
          if (videoResponse.ok) {
            const videoBuffer = await videoResponse.arrayBuffer();
            const buffer = Buffer.from(videoBuffer);
            
            const timestamp = Date.now();
            const filename = `pika-video-${timestamp}.mp4`;
            const filePath = path.join(downloadsDir, filename);
            
            fs.writeFileSync(filePath, buffer);
            
            return {
              url: `/downloads/${filename}`,
              provider: 'Pika Labs',
              format: 'mp4',
              size: buffer.byteLength,
              duration: duration,
              status: 'completed'
            };
          }
        } else if (statusData.status === 'failed') {
          throw new Error('Pika generation failed');
        }
      }

      attempts++;
    }

    throw new Error('Pika generation timeout');
  } catch (error: any) {
    console.error('[PIKA] Error:', error.message);
    throw error;
  }
};

// Haiper AI integration
const generateWithHaiper = async (prompt: string, duration: number = 4): Promise<VideoResult> => {
  console.log('[HAIPER] Starting video generation...');
  
  try {
    const response = await fetch('https://api.haiper.ai/v2/create_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HAIPER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: duration,
        aspect_ratio: "16:9",
        quality: "high"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Haiper API error: ${response.status} - ${errorText}`);
    }

    const taskData = await response.json();
    const taskId = taskData.data.id;

    console.log(`[HAIPER] Task started: ${taskId}`);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await fetch(`https://api.haiper.ai/v2/get_video/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.HAIPER_API_KEY}`,
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log(`[HAIPER] Status: ${statusData.data.state}`);

        if (statusData.data.state === 'completed' && statusData.data.video_url) {
          const videoResponse = await fetch(statusData.data.video_url);
          
          if (videoResponse.ok) {
            const videoBuffer = await videoResponse.arrayBuffer();
            const buffer = Buffer.from(videoBuffer);
            
            const timestamp = Date.now();
            const filename = `haiper-video-${timestamp}.mp4`;
            const filePath = path.join(downloadsDir, filename);
            
            fs.writeFileSync(filePath, buffer);
            
            return {
              url: `/downloads/${filename}`,
              provider: 'Haiper AI',
              format: 'mp4',
              size: buffer.byteLength,
              duration: duration,
              status: 'completed'
            };
          }
        } else if (statusData.data.state === 'failed') {
          throw new Error('Haiper generation failed');
        }
      }

      attempts++;
    }

    throw new Error('Haiper generation timeout');
  } catch (error: any) {
    console.error('[HAIPER] Error:', error.message);
    throw error;
  }
};

// Main video generation endpoint
router.post('/api/real-video/generate', async (req, res) => {
  try {
    const { prompt, duration = 4, style = 'realistic' }: VideoGenerationRequest = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt é obrigatório para geração de vídeo'
      });
    }

    const startTime = Date.now();
    let videoResult: VideoResult | null = null;
    let errors: string[] = [];

    // Try video providers in order of preference
    const providers = [
      { name: 'Runway', fn: generateWithRunway, key: 'RUNWAY_API_KEY' },
      { name: 'Luma', fn: generateWithLuma, key: 'LUMA_API_KEY' },
      { name: 'Pika', fn: generateWithPika, key: 'PIKA_API_KEY' },
      { name: 'Haiper', fn: generateWithHaiper, key: 'HAIPER_API_KEY' }
    ];

    for (const provider of providers) {
      if (process.env[provider.key]) {
        try {
          console.log(`[REAL-VIDEO] Attempting ${provider.name} generation...`);
          videoResult = await provider.fn(prompt, duration);
          console.log(`[REAL-VIDEO] ${provider.name} success!`);
          break;
        } catch (error: any) {
          console.log(`[REAL-VIDEO] ${provider.name} failed:`, error.message);
          errors.push(`${provider.name}: ${error.message}`);
        }
      } else {
        errors.push(`${provider.name}: API key not configured`);
      }
    }

    if (!videoResult) {
      return res.status(500).json({
        success: false,
        error: 'Todos os provedores de vídeo falharam',
        errors: errors
      });
    }

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      video: {
        ...videoResult,
        prompt: prompt,
        style: style
      },
      file: {
        filename: path.basename(videoResult.url),
        path: videoResult.url,
        size: videoResult.size,
        type: 'video/mp4'
      },
      processingTime,
      isRealVideo: true,
      message: `Vídeo real MP4 gerado com ${videoResult.provider}`,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('[REAL-VIDEO] General error:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração de vídeo real',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

// Status endpoint
router.get('/api/real-video/status', (req, res) => {
  const providers = [
    {
      name: 'Runway ML',
      available: !!process.env.RUNWAY_API_KEY,
      status: process.env.RUNWAY_API_KEY ? 'ready' : 'missing_key',
      type: 'Text-to-Video MP4'
    },
    {
      name: 'Luma AI',
      available: !!process.env.LUMA_API_KEY,
      status: process.env.LUMA_API_KEY ? 'ready' : 'missing_key',
      type: 'Dream Machine MP4'
    },
    {
      name: 'Pika Labs',
      available: !!process.env.PIKA_API_KEY,
      status: process.env.PIKA_API_KEY ? 'ready' : 'missing_key',
      type: 'AI Video Generation MP4'
    },
    {
      name: 'Haiper AI',
      available: !!process.env.HAIPER_API_KEY,
      status: process.env.HAIPER_API_KEY ? 'ready' : 'missing_key',
      type: 'High-Quality Video MP4'
    }
  ];

  const availableProviders = providers.filter(p => p.available).length;

  res.json({
    success: true,
    providers,
    canGenerateVideo: availableProviders > 0,
    availableProviders,
    recommendation: availableProviders > 0 
      ? `Sistema com ${availableProviders} provedores de vídeo real configurados`
      : 'Configure pelo menos uma API key para geração de vídeo real'
  });
});

export default router;