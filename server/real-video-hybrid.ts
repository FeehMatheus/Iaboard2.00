import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure downloads directory exists
const downloadsDir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Helper function to save video file
const saveVideoToDownloads = (videoData: any, filename: string) => {
  const filePath = path.join(downloadsDir, filename);
  if (typeof videoData === 'string' && videoData.startsWith('http')) {
    // If it's a URL, we'll store the URL for now (in production, download the actual file)
    fs.writeFileSync(filePath + '.url', videoData, 'utf8');
    return {
      filename: filename + '.url',
      path: `/downloads/${filename}.url`,
      size: Buffer.byteLength(videoData, 'utf8'),
      type: 'video-url'
    };
  }
  return null;
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

    // Provider 1: Stability AI Video
    if (process.env.STABILITY_API_KEY && !videoResult) {
      try {
        console.log('[VIDEO-HYBRID] Tentando Stability AI...');
        
        const stabilityResponse = await fetch('https://api.stability.ai/v2alpha/generation/image-to-video', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`, // Minimal base64 image
            cfg_scale: 1.8,
            motion_bucket_id: 127,
            seed: 0
          }),
        });

        if (stabilityResponse.ok) {
          const result = await stabilityResponse.json();
          if (result.video) {
            videoResult = {
              url: result.video,
              provider: 'Stability AI',
              duration: duration,
              format: 'mp4'
            };
            usedProvider = 'Stability AI';
            console.log('[VIDEO-HYBRID] ✅ Stability AI funcionou!');
          }
        } else {
          errorDetails.push(`Stability AI: ${stabilityResponse.status}`);
        }
      } catch (error: any) {
        console.log('[VIDEO-HYBRID] ❌ Stability AI falhou:', error.message);
        errorDetails.push(`Stability AI: ${error.message}`);
      }
    }

    // Provider 2: RunwayML (fallback)
    if (!videoResult && process.env.RUNWAY_API_KEY) {
      try {
        console.log('[VIDEO-HYBRID] Tentando RunwayML...');
        
        const runwayResponse = await fetch('https://api.runwayml.com/v1/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            duration: duration,
            resolution: '1280x720'
          }),
        });

        if (runwayResponse.ok) {
          const result = await runwayResponse.json();
          if (result.video_url) {
            videoResult = {
              url: result.video_url,
              provider: 'RunwayML',
              duration: duration,
              format: 'mp4'
            };
            usedProvider = 'RunwayML';
            console.log('[VIDEO-HYBRID] ✅ RunwayML funcionou!');
          }
        } else {
          errorDetails.push(`RunwayML: ${runwayResponse.status}`);
        }
      } catch (error: any) {
        console.log('[VIDEO-HYBRID] ❌ RunwayML falhou:', error.message);
        errorDetails.push(`RunwayML: ${error.message}`);
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

    // Save video info to downloads if it's a real video
    let savedFile = null;
    if (videoResult && !videoResult.isPlaceholder) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `video-${timestamp}.mp4`;
      savedFile = saveVideoToDownloads(videoResult.url, filename);
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
        name: 'Stability AI',
        available: !!process.env.STABILITY_API_KEY,
        status: process.env.STABILITY_API_KEY ? 'ready' : 'missing_key'
      },
      {
        name: 'RunwayML', 
        available: !!process.env.RUNWAY_API_KEY,
        status: process.env.RUNWAY_API_KEY ? 'ready' : 'missing_key'
      },
      {
        name: 'Sistema Local',
        available: true,
        status: 'ready'
      }
    ];

    const activeProviders = providers.filter(p => p.available).length;
    
    res.json({
      success: true,
      providers,
      activeProviders,
      recommendedAction: activeProviders === 1 ? 
        'Configure chaves de API para vídeos reais' : 
        'Sistema operacional'
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