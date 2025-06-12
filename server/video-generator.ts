import OpenAI from 'openai';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface VideoGenerationRequest {
  script: string;
  style: 'vsl' | 'product-demo' | 'tutorial' | 'testimonial' | 'promotional';
  duration: number; // in seconds
  voiceGender: 'male' | 'female';
  backgroundMusic?: boolean;
  subtitles?: boolean;
}

interface GeneratedVideo {
  id: string;
  videoUrl: string;
  audioUrl: string;
  scriptData: {
    fullScript: string;
    scenes: VideoScene[];
    totalDuration: number;
  };
  thumbnailUrl: string;
  status: 'generating' | 'completed' | 'error';
  metadata: {
    createdAt: Date;
    style: string;
    duration: number;
  };
}

interface VideoScene {
  id: string;
  text: string;
  duration: number;
  visualDescription: string;
  timestamp: number;
}

export class VideoGenerator {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'public', 'generated-videos');
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateVideo(request: VideoGenerationRequest): Promise<GeneratedVideo> {
    const videoId = uuidv4();
    
    try {
      // Step 1: Enhance and structure the script using AI
      const structuredScript = await this.enhanceScript(request.script, request.style, request.duration);
      
      // Step 2: Generate professional voiceover using OpenAI TTS
      const audioUrl = await this.generateVoiceover(structuredScript.fullScript, request.voiceGender, videoId);
      
      // Step 3: Generate visual assets and thumbnails
      const thumbnailUrl = await this.generateThumbnail(structuredScript.scenes[0].visualDescription, videoId);
      
      // Step 4: Create video scenes with AI-generated visuals
      const videoUrl = await this.createVideoFromScenes(structuredScript.scenes, audioUrl, videoId);

      return {
        id: videoId,
        videoUrl,
        audioUrl,
        scriptData: structuredScript,
        thumbnailUrl,
        status: 'completed',
        metadata: {
          createdAt: new Date(),
          style: request.style,
          duration: request.duration
        }
      };

    } catch (error) {
      console.error('Video generation error:', error);
      
      return {
        id: videoId,
        videoUrl: '',
        audioUrl: '',
        scriptData: { fullScript: request.script, scenes: [], totalDuration: 0 },
        thumbnailUrl: '',
        status: 'error',
        metadata: {
          createdAt: new Date(),
          style: request.style,
          duration: request.duration
        }
      };
    }
  }

  private async enhanceScript(originalScript: string, style: string, targetDuration: number): Promise<{
    fullScript: string;
    scenes: VideoScene[];
    totalDuration: number;
  }> {
    const prompt = `
You are a professional video script writer. Transform this script into a compelling ${style} video script optimized for ${targetDuration} seconds.

Original script: "${originalScript}"

Requirements:
1. Create engaging, conversion-focused content
2. Break into ${Math.ceil(targetDuration / 10)} scenes of approximately 10 seconds each
3. Include specific visual descriptions for each scene
4. Add compelling hooks, emotional triggers, and clear CTAs
5. Ensure natural speech flow and proper pacing

Format the response as JSON:
{
  "fullScript": "complete enhanced script",
  "scenes": [
    {
      "id": "scene_1",
      "text": "script text for this scene",
      "duration": 10,
      "visualDescription": "detailed description of visuals/graphics needed",
      "timestamp": 0
    }
  ],
  "totalDuration": ${targetDuration}
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  private async generateVoiceover(script: string, voiceGender: string, videoId: string): Promise<string> {
    try {
      // Use OpenAI TTS to generate professional voiceover
      const voice = voiceGender === 'female' ? 'nova' : 'onyx';
      
      const mp3Response = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: voice,
        input: script,
        speed: 1.0
      });

      const audioBuffer = Buffer.from(await mp3Response.arrayBuffer());
      const audioPath = path.join(this.outputDir, `${videoId}_audio.mp3`);
      const audioUrl = `/generated-videos/${videoId}_audio.mp3`;
      
      require('fs').writeFileSync(audioPath, audioBuffer);
      
      return audioUrl;
    } catch (error) {
      console.error('Voiceover generation error:', error);
      throw new Error('Failed to generate voiceover');
    }
  }

  private async generateThumbnail(visualDescription: string, videoId: string): Promise<string> {
    try {
      // Generate thumbnail using DALL-E
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Professional video thumbnail: ${visualDescription}. High quality, engaging, marketing-focused, 16:9 aspect ratio, vibrant colors, clear text overlay space.`,
        size: "1792x1024",
        quality: "hd",
        n: 1
      });

      const imageUrl = imageResponse.data[0].url;
      if (!imageUrl) throw new Error('No image generated');

      // Download and save the image
      const response = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      const thumbnailPath = path.join(this.outputDir, `${videoId}_thumbnail.png`);
      const thumbnailUrl = `/generated-videos/${videoId}_thumbnail.png`;
      
      require('fs').writeFileSync(thumbnailPath, imageBuffer);
      
      return thumbnailUrl;
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return this.createFallbackThumbnail(videoId);
    }
  }

  private createFallbackThumbnail(videoId: string): string {
    // Create a simple SVG thumbnail as fallback
    const svgContent = `
      <svg width="1792" height="1024" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <circle cx="896" cy="512" r="80" fill="white" opacity="0.9"/>
        <polygon points="856,472 856,552 936,512" fill="#8B5CF6"/>
        <text x="896" y="600" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold">
          Vídeo IA Gerado
        </text>
      </svg>
    `;
    
    const thumbnailPath = path.join(this.outputDir, `${videoId}_thumbnail.svg`);
    const thumbnailUrl = `/generated-videos/${videoId}_thumbnail.svg`;
    
    require('fs').writeFileSync(thumbnailPath, svgContent);
    return thumbnailUrl;
  }

  private async createVideoFromScenes(scenes: VideoScene[], audioUrl: string, videoId: string): Promise<string> {
    // For now, create an HTML5 video player with synchronized scenes
    // In production, you could integrate with video generation APIs like RunwayML, Synthesia, etc.
    
    const videoPlayerHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vídeo IA Gerado</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
        }
        .video-container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(0,0,0,0.8);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .scene {
            display: none;
            text-align: center;
            padding: 40px 20px;
            min-height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .scene.active {
            display: flex;
        }
        .scene-content {
            background: linear-gradient(135deg, #8B5CF6, #3B82F6);
            padding: 40px;
            border-radius: 20px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .scene-text {
            font-size: 24px;
            line-height: 1.6;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .scene-visual {
            font-size: 16px;
            opacity: 0.8;
            font-style: italic;
        }
        .controls {
            text-align: center;
            margin-top: 20px;
        }
        .btn {
            background: #8B5CF6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            margin: 0 10px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: #7C3AED;
            transform: translateY(-2px);
        }
        .progress {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            margin: 20px 0;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #8B5CF6, #3B82F6);
            width: 0%;
            transition: width 0.3s ease;
        }
        .scene-indicator {
            text-align: center;
            margin-bottom: 20px;
            font-size: 14px;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="video-container">
        <h1 style="text-align: center; margin-bottom: 30px; font-size: 32px;">🎬 Vídeo IA Gerado</h1>
        
        <div class="scene-indicator">
            <span id="current-scene">1</span> / <span id="total-scenes">${scenes.length}</span>
        </div>
        
        <div class="progress">
            <div class="progress-bar" id="progress-bar"></div>
        </div>
        
        <div id="scenes-container">
            ${scenes.map((scene, index) => `
                <div class="scene ${index === 0 ? 'active' : ''}" data-scene="${index}">
                    <div class="scene-content">
                        <div class="scene-text">${scene.text}</div>
                        <div class="scene-visual">💭 ${scene.visualDescription}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="controls">
            <button class="btn" onclick="playVideo()">▶️ Reproduzir</button>
            <button class="btn" onclick="pauseVideo()">⏸️ Pausar</button>
            <button class="btn" onclick="restartVideo()">🔄 Reiniciar</button>
            <button class="btn" onclick="downloadVideo()">📥 Baixar</button>
        </div>
        
        <audio id="audio-player" src="${audioUrl}" preload="auto"></audio>
    </div>

    <script>
        const scenes = ${JSON.stringify(scenes)};
        let currentSceneIndex = 0;
        let isPlaying = false;
        let sceneTimeouts = [];
        
        const audioPlayer = document.getElementById('audio-player');
        const progressBar = document.getElementById('progress-bar');
        const currentSceneSpan = document.getElementById('current-scene');
        
        function showScene(index) {
            document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
            document.querySelector(\`[data-scene="\${index}"]\`).classList.add('active');
            currentSceneIndex = index;
            currentSceneSpan.textContent = index + 1;
        }
        
        function playVideo() {
            if (isPlaying) return;
            isPlaying = true;
            
            audioPlayer.play();
            
            let totalTime = 0;
            scenes.forEach((scene, index) => {
                const timeout = setTimeout(() => {
                    showScene(index);
                }, totalTime * 1000);
                sceneTimeouts.push(timeout);
                totalTime += scene.duration;
            });
            
            // Update progress bar
            const duration = scenes.reduce((total, scene) => total + scene.duration, 0);
            let elapsed = 0;
            const progressInterval = setInterval(() => {
                elapsed += 0.1;
                const progress = (elapsed / duration) * 100;
                progressBar.style.width = progress + '%';
                
                if (elapsed >= duration) {
                    clearInterval(progressInterval);
                    isPlaying = false;
                }
            }, 100);
        }
        
        function pauseVideo() {
            isPlaying = false;
            audioPlayer.pause();
            sceneTimeouts.forEach(timeout => clearTimeout(timeout));
            sceneTimeouts = [];
        }
        
        function restartVideo() {
            pauseVideo();
            audioPlayer.currentTime = 0;
            showScene(0);
            progressBar.style.width = '0%';
        }
        
        function downloadVideo() {
            // Create download package
            const downloadData = {
                scenes: scenes,
                audioUrl: '${audioUrl}',
                videoId: '${videoId}',
                generatedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'video-${videoId}.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
    `;
    
    const videoPath = path.join(this.outputDir, `${videoId}_video.html`);
    const videoUrl = `/generated-videos/${videoId}_video.html`;
    
    require('fs').writeFileSync(videoPath, videoPlayerHtml);
    return videoUrl;
  }

  async generateVSLVideo(productInfo: string, targetDuration: number = 120): Promise<GeneratedVideo> {
    const vslScript = `
Descubra como ${productInfo} pode transformar completamente seus resultados!

Imagine ter acesso a uma solução que resolve todos os seus problemas de forma automática e eficiente.

Com nossa tecnologia revolucionária, você vai conseguir resultados extraordinários em tempo record.

Milhares de pessoas já estão usando e obtendo resultados incríveis.

Não perca esta oportunidade única! Clique agora e comece sua transformação hoje mesmo.
    `;

    return await this.generateVideo({
      script: vslScript,
      style: 'vsl',
      duration: targetDuration,
      voiceGender: 'male',
      backgroundMusic: true,
      subtitles: true
    });
  }

  async generateDemoVideo(): Promise<GeneratedVideo> {
    const demoScript = `
Bem-vindo ao IA BOARD BY FILIPPE™ - a plataforma mais avançada de inteligência artificial para negócios digitais.

Veja como nossa tecnologia revoluciona a criação de produtos digitais com múltiplas IAs trabalhando em conjunto.

Com apenas alguns cliques, você pode gerar produtos completos, campanhas de marketing e estratégias de crescimento.

Nossa plataforma integra as melhores IAs do mercado: OpenAI, Claude e Gemini Pro.

Experimente agora mesmo e descubra o poder da automação inteligente!
    `;

    return await this.generateVideo({
      script: demoScript,
      style: 'product-demo',
      duration: 90,
      voiceGender: 'female',
      backgroundMusic: true,
      subtitles: true
    });
  }

  async processExternalVideoLink(url: string): Promise<{ processed: boolean; videoData: any }> {
    try {
      // Analyze the external video link and extract information
      const analysisPrompt = `
Analyze this video URL and provide insights: ${url}

Based on the URL structure and domain, provide:
1. Video platform (YouTube, Vimeo, etc.)
2. Estimated content type
3. Potential marketing insights
4. Suggested improvements
5. Competition analysis

Respond in JSON format.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: analysisPrompt }],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');

      return {
        processed: true,
        videoData: {
          originalUrl: url,
          analysis,
          processedAt: new Date(),
          suggestions: analysis.suggestions || [],
          competitorInsights: analysis.insights || []
        }
      };
    } catch (error) {
      console.error('External video processing error:', error);
      return {
        processed: false,
        videoData: { error: 'Failed to process external video link' }
      };
    }
  }
}

export const videoGenerator = new VideoGenerator();