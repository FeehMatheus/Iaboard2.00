import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { directLLMService } from './direct-llm-service';

interface VideoAnalysis {
  url: string;
  title?: string;
  duration?: number;
  transcript?: string;
  keyMoments: Array<{
    timestamp: string;
    description: string;
    importance: number;
  }>;
  summary: string;
  insights: string[];
  actionItems: string[];
}

export class YouTubeAnalyzer {
  private tempDir = './temp/youtube';

  constructor() {
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }
  }

  async analyzeVideo(youtubeUrl: string): Promise<VideoAnalysis> {
    console.log(`🎥 Starting analysis of: ${youtubeUrl}`);
    
    try {
      // Extract video ID from URL
      const videoId = this.extractVideoId(youtubeUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Download audio for transcription
      const audioPath = await this.downloadAudio(youtubeUrl, videoId);
      
      // Get video metadata
      const metadata = await this.getVideoMetadata(youtubeUrl);
      
      // Transcribe audio to text
      const transcript = await this.transcribeAudio(audioPath);
      
      // Analyze content with AI
      const analysis = await this.analyzeContent(transcript, metadata);
      
      // Extract key moments
      const keyMoments = await this.extractKeyMoments(transcript);
      
      // Cleanup temporary files
      await this.cleanup(audioPath);
      
      return {
        url: youtubeUrl,
        title: metadata.title,
        duration: metadata.duration,
        transcript,
        keyMoments,
        summary: analysis.summary,
        insights: analysis.insights,
        actionItems: analysis.actionItems
      };
      
    } catch (error) {
      console.error('YouTube analysis error:', error);
      throw new Error(`Failed to analyze video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }

  private async downloadAudio(url: string, videoId: string): Promise<string> {
    const outputPath = path.join(this.tempDir, `${videoId}.wav`);
    
    return new Promise((resolve, reject) => {
      console.log('🎵 Downloading audio...');
      
      // Use yt-dlp to download audio
      const ytDlp = spawn('yt-dlp', [
        '--extract-audio',
        '--audio-format', 'wav',
        '--audio-quality', '0',
        '--output', outputPath.replace('.wav', '.%(ext)s'),
        url
      ]);

      let stderr = '';
      
      ytDlp.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ytDlp.on('close', (code) => {
        if (code === 0) {
          resolve(outputPath);
        } else {
          console.error('yt-dlp stderr:', stderr);
          reject(new Error(`Audio download failed with code ${code}`));
        }
      });

      ytDlp.on('error', (error) => {
        reject(new Error(`Failed to start yt-dlp: ${error.message}`));
      });
    });
  }

  private async getVideoMetadata(url: string): Promise<{ title?: string; duration?: number }> {
    return new Promise((resolve, reject) => {
      console.log('📋 Getting video metadata...');
      
      const ytDlp = spawn('yt-dlp', [
        '--print', '%(title)s',
        '--print', '%(duration)s',
        '--no-download',
        url
      ]);

      let stdout = '';
      let stderr = '';

      ytDlp.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      ytDlp.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ytDlp.on('close', (code) => {
        if (code === 0) {
          const lines = stdout.trim().split('\n');
          resolve({
            title: lines[0] || 'Unknown Title',
            duration: parseInt(lines[1]) || 0
          });
        } else {
          console.error('Metadata error:', stderr);
          resolve({ title: 'Unknown Title', duration: 0 });
        }
      });

      ytDlp.on('error', (error) => {
        console.error('Metadata extraction error:', error);
        resolve({ title: 'Unknown Title', duration: 0 });
      });
    });
  }

  private async transcribeAudio(audioPath: string): Promise<string> {
    try {
      console.log('🎤 Transcribing audio...');
      
      // Check if file exists
      try {
        await fs.access(audioPath);
      } catch {
        throw new Error('Audio file not found');
      }

      // Use OpenAI Whisper for transcription
      if (process.env.OPENAI_API_KEY) {
        return await this.transcribeWithOpenAI(audioPath);
      } else {
        return await this.transcribeWithLocal(audioPath);
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async transcribeWithOpenAI(audioPath: string): Promise<string> {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    try {
      const audioFile = await fs.readFile(audioPath);
      const formData = new FormData();
      formData.append('file', new Blob([audioFile]), 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', 'pt');

      const response = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'pt'
      });

      return response.text;
    } catch (error) {
      console.error('OpenAI transcription error:', error);
      throw error;
    }
  }

  private async transcribeWithLocal(audioPath: string): Promise<string> {
    // Fallback: Extract text from audio using basic speech recognition
    // This is a simplified version - in production you'd use a proper speech-to-text service
    return new Promise((resolve, reject) => {
      console.log('📝 Using fallback transcription...');
      
      // Use ffmpeg to extract segments and analyze
      const ffmpeg = spawn('ffmpeg', [
        '-i', audioPath,
        '-f', 'wav',
        '-ar', '16000',
        '-ac', '1',
        '-'
      ]);

      let audioData = Buffer.alloc(0);
      
      ffmpeg.stdout.on('data', (data) => {
        audioData = Buffer.concat([audioData, data]);
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          // For now, return a placeholder indicating we need the actual audio content
          resolve('[ÁUDIO DETECTADO - Transcription requires OpenAI API key for full functionality]');
        } else {
          reject(new Error('Audio processing failed'));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async analyzeContent(transcript: string, metadata: any): Promise<{
    summary: string;
    insights: string[];
    actionItems: string[];
  }> {
    console.log('🧠 Analyzing content with AI...');
    
    const analysisPrompt = `Analise detalhadamente o seguinte conteúdo de vídeo do YouTube:

TÍTULO: ${metadata.title}
DURAÇÃO: ${metadata.duration} segundos
TRANSCRIÇÃO: ${transcript}

Forneça uma análise completa incluindo:

1. RESUMO EXECUTIVO (máximo 3 parágrafos)
2. PRINCIPAIS INSIGHTS (5-7 pontos importantes)
3. ITENS DE AÇÃO (3-5 ações práticas que podem ser implementadas)

Seja específico e foque nos pontos mais valiosos do conteúdo.`;

    try {
      const response = await directLLMService.generateContent({
        prompt: analysisPrompt,
        model: 'mistral-large',
        temperature: 0.7,
        maxTokens: 3000
      });

      if (response.success) {
        return this.parseAnalysisResponse(response.content);
      } else {
        throw new Error('AI analysis failed');
      }
    } catch (error) {
      console.error('Content analysis error:', error);
      return {
        summary: 'Análise não disponível devido a erro no processamento.',
        insights: ['Conteúdo requer análise manual'],
        actionItems: ['Revisar conteúdo manualmente']
      };
    }
  }

  private parseAnalysisResponse(content: string): {
    summary: string;
    insights: string[];
    actionItems: string[];
  } {
    const sections = content.split(/(?:1\.|2\.|3\.)\s*/);
    
    return {
      summary: sections[1]?.trim() || content.substring(0, 500),
      insights: this.extractListItems(sections[2] || ''),
      actionItems: this.extractListItems(sections[3] || '')
    };
  }

  private extractListItems(text: string): string[] {
    const lines = text.split('\n');
    return lines
      .filter(line => line.trim().match(/^[-•]\s+/))
      .map(line => line.trim().replace(/^[-•]\s+/, ''))
      .filter(item => item.length > 0);
  }

  private async extractKeyMoments(transcript: string): Promise<Array<{
    timestamp: string;
    description: string;
    importance: number;
  }>> {
    console.log('⏰ Extracting key moments...');
    
    // Split transcript into segments and identify important moments
    const segments = transcript.split(/\.\s+/);
    const keyMoments = [];
    
    let currentTime = 0;
    const avgWordsPerMinute = 150;
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i].trim();
      if (segment.length < 20) continue;
      
      const wordCount = segment.split(' ').length;
      const timeInSeconds = (wordCount / avgWordsPerMinute) * 60;
      currentTime += timeInSeconds;
      
      // Identify important segments based on keywords
      const importance = this.calculateImportance(segment);
      
      if (importance > 0.6) {
        keyMoments.push({
          timestamp: this.formatTimestamp(currentTime),
          description: segment.substring(0, 100) + '...',
          importance: Math.round(importance * 100) / 100
        });
      }
    }
    
    return keyMoments.slice(0, 10); // Return top 10 moments
  }

  private calculateImportance(text: string): number {
    const importantKeywords = [
      'importante', 'crucial', 'essencial', 'fundamental', 'chave',
      'primeiro', 'segundo', 'terceiro', 'conclusão', 'resultado',
      'estratégia', 'método', 'técnica', 'solução', 'problema',
      'dica', 'conselho', 'atenção', 'cuidado', 'lembre-se'
    ];
    
    let score = 0;
    const words = text.toLowerCase().split(' ');
    
    for (const keyword of importantKeywords) {
      if (words.includes(keyword)) {
        score += 0.1;
      }
    }
    
    // Boost score for questions and exclamations
    if (text.includes('?') || text.includes('!')) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  private formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  private async cleanup(filePath: string) {
    try {
      await fs.unlink(filePath);
      console.log('🗑️ Temporary files cleaned up');
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

export const youtubeAnalyzer = new YouTubeAnalyzer();