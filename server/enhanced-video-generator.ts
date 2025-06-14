import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

interface AIVideoRequest {
  prompt: string;
  description?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: string;
  duration?: number;
}

interface AIVideoResponse {
  success: boolean;
  videoUrl?: string;
  error?: string;
  metadata?: {
    prompt: string;
    duration: number;
    aspectRatio: string;
    style: string;
    processingTime: number;
  };
}

export class EnhancedVideoGenerator {
  private openai: OpenAI;
  private outputDir: string;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.outputDir = path.join(process.cwd(), 'public', 'ai-videos');
    this.initializeOutputDirectory();
  }

  private async initializeOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  async generateAIVideo(request: AIVideoRequest): Promise<AIVideoResponse> {
    const startTime = Date.now();
    
    try {
      console.log('🎬 Iniciando geração de vídeo AI avançado...');
      
      // Gerar conceito visual detalhado com IA
      const visualConcept = await this.generateVisualConcept(request.prompt, request.style || 'cinematic');
      
      // Gerar script de movimento e transições
      const motionScript = await this.generateMotionScript(visualConcept, request.duration || 5);
      
      // Criar vídeo com base no conceito visual
      const videoResult = await this.createAdvancedVideo({
        ...request,
        visualConcept,
        motionScript
      });

      const processingTime = Date.now() - startTime;

      if (videoResult.success) {
        return {
          success: true,
          videoUrl: videoResult.videoUrl,
          metadata: {
            prompt: request.prompt,
            duration: request.duration || 5,
            aspectRatio: request.aspectRatio || '16:9',
            style: request.style || 'cinematic',
            processingTime
          }
        };
      }

      return {
        success: false,
        error: videoResult.error || 'Falha na geração do vídeo'
      };

    } catch (error) {
      console.error('Enhanced video generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro na geração de vídeo AI'
      };
    }
  }

  private async generateVisualConcept(prompt: string, style: string): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'system',
          content: `Você é um diretor de vídeo especialista em conceitos visuais. Crie um conceito visual detalhado em JSON com:
          - colors: paleta de cores hexadecimais (5 cores)
          - scenes: array de 3-5 cenas com descrição, duração e movimento
          - transitions: tipos de transição entre cenas
          - effects: efeitos visuais específicos
          - typography: estilo de texto e posicionamento
          - mood: atmosfera geral do vídeo
          
          Responda sempre em JSON válido.`
        }, {
          role: 'user',
          content: `Prompt: ${prompt}\nEstilo: ${style}\n\nCrie um conceito visual cinematográfico detalhado.`
        }],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      const concept = JSON.parse(response.choices[0].message.content || '{}');
      console.log('✨ Conceito visual gerado:', concept.mood);
      return concept;

    } catch (error) {
      console.error('Visual concept generation error:', error);
      return this.getDefaultVisualConcept(style);
    }
  }

  private async generateMotionScript(visualConcept: any, duration: number): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{
          role: 'system',
          content: `Baseado no conceito visual, crie um script de movimento em JSON com:
          - keyframes: pontos-chave de animação com tempo e propriedades
          - cameraMovements: movimentos de câmera (zoom, pan, etc.)
          - textAnimations: animações de texto com timing
          - colorTransitions: transições de cor ao longo do tempo
          
          Responda sempre em JSON válido.`
        }, {
          role: 'user',
          content: `Conceito: ${JSON.stringify(visualConcept)}\nDuração: ${duration}s\n\nCrie script de movimento cinematográfico.`
        }],
        response_format: { type: "json_object" },
        max_tokens: 600
      });

      const motionScript = JSON.parse(response.choices[0].message.content || '{}');
      console.log('🎭 Script de movimento gerado');
      return motionScript;

    } catch (error) {
      console.error('Motion script generation error:', error);
      return this.getDefaultMotionScript(duration);
    }
  }

  private async createAdvancedVideo(request: any): Promise<{success: boolean, videoUrl?: string, error?: string}> {
    const videoId = `ai_video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
    const { width, height } = this.getVideoDimensions(request.aspectRatio || '16:9');
    const duration = request.duration || 5;

    return new Promise((resolve) => {
      const { colors, scenes, typography } = request.visualConcept || {};
      const primaryColor = colors?.[0] || '#4a90e2';
      const secondaryColor = colors?.[1] || '#7b68ee';
      
      // Texto principal processado
      const mainText = this.sanitizeText(request.prompt);
      const styleText = (request.style || 'AI Generated').toUpperCase();

      const ffmpegArgs = [
        '-f', 'lavfi',
        '-i', `color=c=${primaryColor}:size=${width}x${height}:duration=${duration}:rate=30`,
        '-f', 'lavfi',
        '-i', `color=c=${secondaryColor}:size=${width}x${height}:duration=${duration}:rate=30`,
        '-filter_complex', this.buildAdvancedFilterChain({
          width,
          height,
          duration,
          mainText,
          styleText,
          colors: colors || [primaryColor, secondaryColor],
          scenes: scenes || []
        }),
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-y',
        outputPath
      ];

      console.log('🎬 Renderizando vídeo AI avançado...');

      const ffmpeg = spawn('ffmpeg', ffmpegArgs);
      let errorOutput = '';

      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes('error') || output.includes('Error')) {
          errorOutput += output;
        }
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          const videoUrl = `/ai-videos/${videoId}.mp4`;
          console.log('✅ Vídeo AI gerado com sucesso:', videoUrl);
          resolve({
            success: true,
            videoUrl
          });
        } else {
          console.error('FFmpeg error:', errorOutput);
          resolve({
            success: false,
            error: `Erro na renderização: código ${code}`
          });
        }
      });

      ffmpeg.on('error', (error) => {
        console.error('FFmpeg spawn error:', error);
        resolve({
          success: false,
          error: error.message
        });
      });
    });
  }

  private buildAdvancedFilterChain(params: any): string {
    const { width, height, duration, mainText, styleText, colors } = params;
    
    const filters = [
      // Gradiente animado de fundo
      `[0:v][1:v]blend=all_mode=multiply:all_opacity=0.7[bg]`,
      
      // Efeito de zoom sutil
      `[bg]zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':d=${duration * 30}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'[zoomed]`,
      
      // Texto principal com animação
      `[zoomed]drawtext=text='${mainText}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=${Math.floor(width/20)}:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:borderw=3:bordercolor=black:alpha='if(lt(t,1),t,if(gt(t,${duration-1}),${duration}-t,1))':enable='between(t,0.5,${duration-0.5})'[text1]`,
      
      // Texto de estilo
      `[text1]drawtext=text='${styleText}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:fontsize=${Math.floor(width/40)}:fontcolor=${colors[2] || '#ffd700'}:x=(w-text_w)/2:y=h*0.8:borderw=2:bordercolor=black:alpha='if(lt(t,1.5),t-0.5,if(gt(t,${duration-1}),${duration}-t,1))':enable='between(t,1,${duration-0.5})'[text2]`,
      
      // Elementos decorativos animados
      `[text2]drawbox=x=w*0.1:y=h*0.1:w=w*0.8:h=4:color=${colors[3] || '#50c878'}:t=fill:enable='between(t,0.5,${duration})'[decorated]`,
      
      // Partículas flutuantes
      `[decorated]drawbox=x='w*0.2+sin(t*2)*50':y='h*0.3+cos(t*3)*30':w=8:h=8:color=white@0.7:t=fill:enable='between(t,1,${duration})'[particles]`
    ];

    return filters.join(';');
  }

  private getVideoDimensions(aspectRatio: string) {
    const dimensions: Record<string, { width: number; height: number }> = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1080, height: 1080 }
    };
    return dimensions[aspectRatio] || dimensions['16:9'];
  }

  private sanitizeText(text: string): string {
    return text
      .replace(/['"\\]/g, '')
      .replace(/:/g, ' ')
      .substring(0, 80);
  }

  private getDefaultVisualConcept(style: string) {
    const concepts = {
      cinematic: {
        colors: ['#1a1a2e', '#16213e', '#ffd700', '#f39c12', '#2c3e50'],
        mood: 'dramático e cinematográfico',
        scenes: [
          { description: 'abertura com fade in', duration: 1, movement: 'static' },
          { description: 'texto principal', duration: 3, movement: 'zoom' },
          { description: 'finalização', duration: 1, movement: 'fade out' }
        ]
      },
      anime: {
        colors: ['#ff6b6b', '#4ecdc4', '#ff9ff3', '#54a0ff', '#feca57'],
        mood: 'vibrante e dinâmico',
        scenes: [
          { description: 'entrada explosiva', duration: 1, movement: 'burst' },
          { description: 'apresentação colorida', duration: 3, movement: 'float' },
          { description: 'saída suave', duration: 1, movement: 'fade' }
        ]
      }
    };
    return (concepts as any)[style] || concepts.cinematic;
  }

  private getDefaultMotionScript(duration: number) {
    return {
      keyframes: [
        { time: 0, opacity: 0, scale: 0.8 },
        { time: 1, opacity: 1, scale: 1 },
        { time: duration - 1, opacity: 1, scale: 1.1 },
        { time: duration, opacity: 0, scale: 1.2 }
      ],
      cameraMovements: ['zoom_in', 'pan_right'],
      textAnimations: ['fade_in', 'slide_up'],
      colorTransitions: ['gradient_shift', 'pulse']
    };
  }
}

export const enhancedVideoGenerator = new EnhancedVideoGenerator();