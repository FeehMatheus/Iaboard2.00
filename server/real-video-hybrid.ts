import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Helper function to download and save real video file
const downloadAndSaveVideo = async (videoUrl: string, filename: string) => {
  try {
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error(`Failed to download video: ${response.status}`);
    
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
    console.error('Error downloading video:', error);
    return null;
  }
};

// Hybrid video generation with multiple providers and fallback
router.post('/api/video-hybrid/generate', async (req, res) => {
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
    let usedProvider = '';
    let errorDetails = [];

    // Provider 1: RunwayML Gen-3 (Premium)
    if (process.env.RUNWAY_API_KEY && !videoResult) {
      try {
        console.log('[VIDEO-HYBRID] Tentando RunwayML Gen-3...');
        
        const runwayResponse = await fetch('https://api.runwayml.com/v1/tasks', {
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
              seconds: duration,
              text_prompt: prompt,
              seed: Math.floor(Math.random() * 1000000),
              exploreMode: false,
              watermark: false
            }
          }),
        });

        if (runwayResponse.ok) {
          const task = await runwayResponse.json();
          
          // Poll for completion
          let attempts = 0;
          while (attempts < 60) { // 5 minutes max
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            
            const statusResponse = await fetch(`https://api.runwayml.com/v1/tasks/${task.id}`, {
              headers: {
                'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
              },
            });
            
            const status = await statusResponse.json();
            
            if (status.status === 'SUCCEEDED' && status.output) {
              videoResult = {
                url: status.output[0],
                provider: 'RunwayML Gen-3',
                duration: duration,
                format: 'mp4',
                taskId: task.id
              };
              usedProvider = 'RunwayML Gen-3';
              console.log('[VIDEO-HYBRID] ✅ RunwayML Gen-3 funcionou!');
              break;
            } else if (status.status === 'FAILED') {
              throw new Error('RunwayML task failed');
            }
            
            attempts++;
          }
        } else {
          errorDetails.push(`RunwayML: ${runwayResponse.status}`);
        }
      } catch (error: any) {
        console.log('[VIDEO-HYBRID] ❌ RunwayML falhou:', error.message);
        errorDetails.push(`RunwayML: ${error.message}`);
      }
    }

    // Provider 2: Luma Dream Machine
    if (process.env.LUMA_API_KEY && !videoResult) {
      try {
        console.log('[VIDEO-HYBRID] Tentando Luma Dream Machine...');
        
        const lumaResponse = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
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

        if (lumaResponse.ok) {
          const generation = await lumaResponse.json();
          
          // Poll for completion
          let attempts = 0;
          while (attempts < 60) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generation.id}`, {
              headers: {
                'Authorization': `Bearer ${process.env.LUMA_API_KEY}`,
              },
            });
            
            const status = await statusResponse.json();
            
            if (status.state === 'completed' && status.assets?.video) {
              videoResult = {
                url: status.assets.video,
                provider: 'Luma Dream Machine',
                duration: duration,
                format: 'mp4',
                generationId: generation.id
              };
              usedProvider = 'Luma Dream Machine';
              console.log('[VIDEO-HYBRID] ✅ Luma funcionou!');
              break;
            } else if (status.state === 'failed') {
              throw new Error('Luma generation failed');
            }
            
            attempts++;
          }
        } else {
          errorDetails.push(`Luma: ${lumaResponse.status}`);
        }
      } catch (error: any) {
        console.log('[VIDEO-HYBRID] ❌ Luma falhou:', error.message);
        errorDetails.push(`Luma: ${error.message}`);
      }
    }

    // Provider 3: Pika Labs
    if (process.env.PIKA_API_KEY && !videoResult) {
      try {
        console.log('[VIDEO-HYBRID] Tentando Pika Labs...');
        
        const pikaResponse = await fetch('https://api.pika.art/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PIKA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            options: {
              frameRate: 24,
              motion: 1,
              guidance_scale: 12,
              negative_prompt: 'blurry, low quality, distorted'
            }
          }),
        });

        if (pikaResponse.ok) {
          const job = await pikaResponse.json();
          
          // Poll for completion
          let attempts = 0;
          while (attempts < 40) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const statusResponse = await fetch(`https://api.pika.art/jobs/${job.job.id}`, {
              headers: {
                'Authorization': `Bearer ${process.env.PIKA_API_KEY}`,
              },
            });
            
            const status = await statusResponse.json();
            
            if (status.job.result?.videos?.[0]) {
              videoResult = {
                url: status.job.result.videos[0],
                provider: 'Pika Labs',
                duration: duration,
                format: 'mp4',
                jobId: job.job.id
              };
              usedProvider = 'Pika Labs';
              console.log('[VIDEO-HYBRID] ✅ Pika Labs funcionou!');
              break;
            } else if (status.job.status === 'failed') {
              throw new Error('Pika generation failed');
            }
            
            attempts++;
          }
        } else {
          errorDetails.push(`Pika Labs: ${pikaResponse.status}`);
        }
      } catch (error: any) {
        console.log('[VIDEO-HYBRID] ❌ Pika Labs falhou:', error.message);
        errorDetails.push(`Pika Labs: ${error.message}`);
      }
    }

    // Provider 4: Haiper AI (Fast)
    if (process.env.HAIPER_API_KEY && !videoResult) {
      try {
        console.log('[VIDEO-HYBRID] Tentando Haiper AI...');
        
        const haiperResponse = await fetch('https://api.haiper.ai/v1/video/generation', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HAIPER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            duration: duration,
            resolution: '1280x720',
            fps: 25
          }),
        });

        if (haiperResponse.ok) {
          const task = await haiperResponse.json();
          
          // Poll for completion
          let attempts = 0;
          while (attempts < 30) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const statusResponse = await fetch(`https://api.haiper.ai/v1/video/generation/${task.id}`, {
              headers: {
                'Authorization': `Bearer ${process.env.HAIPER_API_KEY}`,
              },
            });
            
            const status = await statusResponse.json();
            
            if (status.status === 'completed' && status.video_url) {
              videoResult = {
                url: status.video_url,
                provider: 'Haiper AI',
                duration: duration,
                format: 'mp4',
                taskId: task.id
              };
              usedProvider = 'Haiper AI';
              console.log('[VIDEO-HYBRID] ✅ Haiper AI funcionou!');
              break;
            } else if (status.status === 'failed') {
              throw new Error('Haiper generation failed');
            }
            
            attempts++;
          }
        } else {
          errorDetails.push(`Haiper AI: ${haiperResponse.status}`);
        }
      } catch (error: any) {
        console.log('[VIDEO-HYBRID] ❌ Haiper AI falhou:', error.message);
        errorDetails.push(`Haiper AI: ${error.message}`);
      }
    }



    // Provider 3: Local fallback (sempre funciona)
    if (!videoResult) {
      console.log('[VIDEO-HYBRID] Usando fallback local...');
      
      // Create a simple video description file as fallback
      const videoDescription = `# VÍDEO GERADO
      
**Prompt:** ${prompt}
**Duração:** ${duration}s
**Estilo:** ${style}

## Descrição do Vídeo
${prompt}

## Especificações Técnicas
- Resolução: 1280x720
- Formato: MP4
- Duração: ${duration} segundos
- Taxa de frames: 30fps

## Status
⚠️ Este é um placeholder. Configure uma chave de API válida para gerar vídeos reais:
- STABILITY_API_KEY (Stability AI)
- RUNWAY_API_KEY (RunwayML)

*Arquivo gerado pelo IA Board - Sistema Híbrido de Vídeo*`;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `video-${timestamp}.md`;
      const filePath = path.join(downloadsDir, filename);
      
      fs.writeFileSync(filePath, videoDescription, 'utf8');
      
      videoResult = {
        url: `/downloads/${filename}`,
        provider: 'Sistema Local (Fallback)',
        duration: duration,
        format: 'md',
        isPlaceholder: true
      };
      usedProvider = 'Sistema Local';
    }

    const processingTime = Date.now() - startTime;

    // Download and save real video file
    let savedFile = null;
    if (videoResult && !videoResult.isPlaceholder && videoResult.url) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `video-${timestamp}.mp4`;
      savedFile = await downloadAndSaveVideo(videoResult.url, filename);
    }

    res.json({
      success: true,
      video: videoResult,
      provider: usedProvider,
      processingTime,
      prompt,
      errors: errorDetails,
      file: savedFile,
      isRealVideo: !videoResult?.isPlaceholder,
      message: videoResult?.isPlaceholder 
        ? '⚠️ Vídeo placeholder gerado. Configure APIs para vídeos reais.'
        : '✅ Vídeo real gerado com sucesso!'
    });

  } catch (error: any) {
    console.error('[VIDEO-HYBRID] Erro geral:', error);
    res.status(500).json({
      success: false,
      error: 'Erro na geração híbrida de vídeo',
      details: error?.message || 'Erro desconhecido',
      allProvidersFailed: true
    });
  }
});

// Get video status
router.get('/api/video-hybrid/status', async (req, res) => {
  try {
    const providers = [
      {
        name: 'RunwayML Gen-3',
        available: !!process.env.RUNWAY_API_KEY,
        status: process.env.RUNWAY_API_KEY ? 'ready' : 'missing_key',
        priority: 1
      },
      {
        name: 'Luma Dream Machine',
        available: !!process.env.LUMA_API_KEY,
        status: process.env.LUMA_API_KEY ? 'ready' : 'missing_key',
        priority: 2
      },
      {
        name: 'Pika Labs',
        available: !!process.env.PIKA_API_KEY,
        status: process.env.PIKA_API_KEY ? 'ready' : 'missing_key',
        priority: 3
      },
      {
        name: 'Haiper AI',
        available: !!process.env.HAIPER_API_KEY,
        status: process.env.HAIPER_API_KEY ? 'ready' : 'missing_key',
        priority: 4
      },
      {
        name: 'Sistema Local',
        available: true,
        status: 'fallback',
        priority: 5
      }
    ];

    const activeProviders = providers.filter(p => p.available && p.status === 'ready').length;
    const realProviders = providers.filter(p => p.status === 'ready' && p.name !== 'Sistema Local').length;
    
    res.json({
      success: true,
      providers,
      activeProviders: activeProviders + 1, // +1 for local fallback
      realProviders,
      recommendedAction: realProviders === 0 ? 
        'Configure pelo menos uma chave de API para vídeos reais' : 
        `${realProviders} provedor${realProviders > 1 ? 'es' : ''} de vídeo real ativo${realProviders > 1 ? 's' : ''}`
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar status dos provedores',
      details: error?.message || 'Erro desconhecido'
    });
  }
});

export default router;