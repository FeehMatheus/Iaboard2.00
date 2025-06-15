import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Download video from URL and save locally
const downloadVideoFile = async (videoUrl: string, filename: string) => {
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error(`Failed to download: ${response.status}`);
    
    const buffer = await response.arrayBuffer();
    const filePath = path.join(downloadsDir, filename);
    
    fs.writeFileSync(filePath, Buffer.from(buffer));
    
    return {
      filename,
      path: `/downloads/${filename}`,
      size: buffer.byteLength,
      type: 'video'
    };
  } catch (error) {
    console.error('Download error:', error);
    return null;
  }
};

// Luma Dream Machine - correct API implementation
const generateWithLuma = async (prompt: string, duration: number) => {
  try {
    console.log('[LUMA] Generating video with prompt:', prompt);
    
    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: '16:9',
        loop: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[LUMA] API Error:', response.status, errorText);
      throw new Error(`Luma API error: ${response.status}`);
    }

    const generation = await response.json();
    console.log('[LUMA] Generation started:', generation.id);
    
    // Poll for completion
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generation.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
        },
      });
      
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        console.log('[LUMA] Status check:', status.state);
        
        if (status.state === 'completed' && status.assets?.video) {
          return {
            url: status.assets.video,
            provider: 'Luma Dream Machine',
            generationId: generation.id
          };
        } else if (status.state === 'failed') {
          throw new Error('Luma generation failed');
        }
      }
    }
    
    throw new Error('Luma generation timeout');
  } catch (error: any) {
    console.error('[LUMA] Error:', error.message);
    throw error;
  }
};

// Haiper AI - correct API implementation  
const generateWithHaiper = async (prompt: string, duration: number) => {
  try {
    console.log('[HAIPER] Generating video with prompt:', prompt);
    
    const response = await fetch('https://api.haiper.ai/v2/video/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HAIPER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: Math.min(duration, 6),
        aspect_ratio: '16:9',
        seed: Math.floor(Math.random() * 1000000)
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[HAIPER] API Error:', response.status, errorText);
      throw new Error(`Haiper API error: ${response.status}`);
    }

    const task = await response.json();
    console.log('[HAIPER] Generation started:', task.id);
    
    // Poll for completion
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusResponse = await fetch(`https://api.haiper.ai/v2/video/generation/${task.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.HAIPER_API_KEY}`,
        },
      });
      
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        console.log('[HAIPER] Status check:', status.state);
        
        if (status.state === 'succeeded' && status.video_url) {
          return {
            url: status.video_url,
            provider: 'Haiper AI',
            taskId: task.id
          };
        } else if (status.state === 'failed') {
          throw new Error('Haiper generation failed');
        }
      }
    }
    
    throw new Error('Haiper generation timeout');
  } catch (error: any) {
    console.error('[HAIPER] Error:', error.message);
    throw error;
  }
};

// RunwayML Gen-3 - correct API implementation
const generateWithRunway = async (prompt: string, duration: number) => {
  try {
    console.log('[RUNWAY] Generating video with prompt:', prompt);
    
    const response = await fetch('https://api.runwayml.com/v1/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskType: 'gen3a_turbo',
        internal: false,
        options: {
          name: `IA Board Video - ${Date.now()}`,
          seconds: Math.min(duration, 10),
          text_prompt: prompt,
          seed: Math.floor(Math.random() * 1000000),
          exploreMode: false,
          watermark: false
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[RUNWAY] API Error:', response.status, errorText);
      throw new Error(`Runway API error: ${response.status}`);
    }

    const task = await response.json();
    console.log('[RUNWAY] Generation started:', task.id);
    
    // Poll for completion
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${task.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        },
      });
      
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        console.log('[RUNWAY] Status check:', status.status);
        
        if (status.status === 'SUCCEEDED' && status.output?.length > 0) {
          return {
            url: status.output[0],
            provider: 'RunwayML Gen-3',
            taskId: task.id
          };
        } else if (status.status === 'FAILED') {
          throw new Error('Runway generation failed');
        }
      }
    }
    
    throw new Error('Runway generation timeout');
  } catch (error: any) {
    console.error('[RUNWAY] Error:', error.message);
    throw error;
  }
};

// Production video generation endpoint
router.post('/api/production-video/generate', async (req, res) => {
  try {
    const { prompt, duration = 5, style = 'realistic' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt é obrigatório para geração de vídeo'
      });
    }

    const startTime = Date.now();
    let videoResult = null;
    let errors = [];

    // Try providers in order of preference
    const providers = [
      { name: 'Luma', fn: generateWithLuma, available: !!process.env.LUMA_API_KEY },
      { name: 'Haiper', fn: generateWithHaiper, available: !!process.env.HAIPER_API_KEY },
      { name: 'Runway', fn: generateWithRunway, available: !!process.env.RUNWAY_API_KEY }
    ];

    for (const provider of providers) {
      if (!provider.available || videoResult) continue;
      
      try {
        console.log(`[PRODUCTION-VIDEO] Attempting ${provider.name}...`);
        const result = await provider.fn(prompt, duration);
        
        if (result?.url) {
          videoResult = result;
          console.log(`[PRODUCTION-VIDEO] Success with ${provider.name}`);
          break;
        }
      } catch (error: any) {
        console.log(`[PRODUCTION-VIDEO] ${provider.name} failed:`, error.message);
        errors.push(`${provider.name}: ${error.message}`);
      }
    }

    if (!videoResult) {
      return res.status(503).json({
        success: false,
        error: 'Video generation services temporarily unavailable',
        errors,
        availableProviders: providers.filter(p => p.available).map(p => p.name),
        suggestion: 'Please check API keys and try again'
      });
    }

    // Download the video file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `video-${timestamp}.mp4`;
    const savedFile = await downloadVideoFile(videoResult.url, filename);

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      video: {
        ...videoResult,
        localUrl: savedFile ? savedFile.path : null,
        format: 'mp4',
        duration,
        prompt,
        style
      },
      file: savedFile,
      processingTime,
      isRealVideo: true,
      message: `Video generated successfully with ${videoResult.provider}`,
      downloadedLocally: !!savedFile
    });

  } catch (error: any) {
    console.error('[PRODUCTION-VIDEO] General error:', error);
    res.status(500).json({
      success: false,
      error: 'Video generation service error',
      details: error?.message || 'Unknown error'
    });
  }
});

// Status endpoint
router.get('/api/production-video/status', (req, res) => {
  const providers = [
    {
      name: 'Luma Dream Machine',
      available: !!process.env.LUMA_API_KEY,
      status: process.env.LUMA_API_KEY ? 'ready' : 'missing_key',
      maxDuration: 5,
      quality: 'high'
    },
    {
      name: 'Haiper AI',
      available: !!process.env.HAIPER_API_KEY,
      status: process.env.HAIPER_API_KEY ? 'ready' : 'missing_key',
      maxDuration: 6,
      quality: 'medium'
    },
    {
      name: 'RunwayML Gen-3',
      available: !!process.env.RUNWAY_API_KEY,
      status: process.env.RUNWAY_API_KEY ? 'ready' : 'missing_key',
      maxDuration: 10,
      quality: 'premium'
    }
  ];

  const activeCount = providers.filter(p => p.available).length;

  res.json({
    success: true,
    providers,
    activeCount,
    status: activeCount > 0 ? 'operational' : 'no_providers',
    recommendation: activeCount === 0 ? 'Configure API keys for video generation' : `${activeCount} video provider(s) ready`
  });
});

export default router;